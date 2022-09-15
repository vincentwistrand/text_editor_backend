const express = require("express");
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 1337;

const editor = require('./routes/editor');

// Must use cors before use routes.
app.use(cors());
app.options('*', cors());

app.use('/', editor);

app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
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
const server = app.listen(port, () => console.log(`API listening on port ${port}!`));

module.exports = server;