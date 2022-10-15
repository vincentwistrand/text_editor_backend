const express = require("express");
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');

const app = express();
const port = process.env.PORT || 1337;

const editor = require('./routes/editor.js');
const auth = require('./routes/auth.js');
const invite = require('./routes/invite.js');

const docsModel = require('./models/docs');

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))

// Must use cors before use routes.
app.use(cors());
app.options('*', cors());

// After cors.
app.use('/', editor);
app.use('/auth', auth);
app.use('/invite', invite);

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});



//GraphQL
const RootQueryType = require("./graphql/root.js");

const {
    GraphQLSchema
} = require('graphql');

const schema = new GraphQLSchema({
    query: RootQueryType
})

app.use('/graphql',
    //(req, res, next) => docsModel.checkToken(req, res, next),
    graphqlHTTP({
        schema: schema,
        graphiql: true
    }))



//Socket.io
const database = require('./db/database');
const httpServer = require("http").createServer(app);

const io = require("socket.io")(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let throttleTimer;

io.on('connection', function(socket) {
    console.log("User with id " + socket.id + " has connected");
    
    socket.on('create', function(room) {
        console.log("New room with id: " + room + " created");
        socket.join(room);
    });

    socket.on("doc", function (data) {
        console.log(data);
        socket.to(data["_id"]).emit("doc", data);

        clearTimeout(throttleTimer);
        console.log("writing...");
        throttleTimer = setTimeout(async function() {

            // Update database
            const ObjectId = require('mongodb').ObjectId;
            const filter = { _id: ObjectId(data["_id"]) };

            const updateDoc = {
                $set: {
                    content: data["html"]
                }
            };

            const db = await database.getDb();
            const result = await db.collection.updateOne(
                filter,
                updateDoc,
                { upsert: true }
            );
            await db.client.close();

            if (result.acknowledged === true) {
                console.log("Saved");
                socket.emit("save", "Sparar...");
            }

        }, 5000);
    });
});



// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('combined'));
}


// Put last.
app.use((req, res, next) => {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});


//Error
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.status || 500).json({
        "errors": [
            {
                "status": err.status,
                "title":  err.message,
                "detail": err.message
            }
        ]
    });
});


// Start up server
const server = httpServer.listen(port, () => console.log(`API listening on port ${port}!`));

module.exports = server;