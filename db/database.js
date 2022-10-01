const mongo = require("mongodb").MongoClient;
//const config = require("./config.json");
//const collectionName = "docs";
require('dotenv').config()

const database = {
    getDb: async function getDb (collectionName = "docs") {
        let dsn = `mongodb+srv://myeditor:${process.env.ATLAS_PASSWORD}@cluster0.hvbargr.mongodb.net/editor?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = `mongodb://localhost:27017/test`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            db: db,
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;