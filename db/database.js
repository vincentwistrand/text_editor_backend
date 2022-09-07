const mongo = require("mongodb").MongoClient;
//const config = require("./config.json");
const collectionName = "crowd";
require('dotenv').config()

const database = {
    getDb: async function getDb () {
        let dsn = `mongodb+srv://myeditor:${process.env.ATLAS_PASSWORD}@cluster0.hvbargr.mongodb.net/docs?retryWrites=true&w=majority`;

        if (process.env.NODE_ENV === 'test') {
            dsn = `mongodb+srv://myeditor:${process.env.ATLAS_PASSWORD}@cluster0.hvbargr.mongodb.net/test?retryWrites=true&w=majority`;
        }

        const client  = await mongo.connect(dsn, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const db = await client.db();
        const collection = await db.collection(collectionName);

        return {
            collection: collection,
            client: client,
        };
    }
};

module.exports = database;