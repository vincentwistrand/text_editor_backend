var express = require('express');
const { ReturnDocument } = require('mongodb');
var router = express.Router();

const database = require('../db/database');

router.get("/docs", (req, res) => {
    (async () => {
        const db = await database.getDb();
        const resultSet = await db.collection.find({}).toArray();
        await db.client.close();

        res.json({data: resultSet});
    })();
});

router.post("/docs", (req, res) => {
    const newDoc = req.query;
    //console.log(req)
    if (newDoc.name && newDoc.content) {
        const docData = {
            name: req.query.name,
            content: req.query.content,
        };
    
        (async () => {
            const db = await database.getDb();
            const result = await db.collection.insertOne(docData);
            await db.client.close();
    
            res.status(201).json({data: result });
        })();
    } else {
        res.status(400).json({ errors: {
            message: "'name' and 'content' needed to create new document."
            }
        });
    }
});

router.put("/docs", (req, res) => {
    if (!req.query.id) {
        res.status(400).send("Missing 'id' key")
        return;
    }

    const ObjectId = require('mongodb').ObjectId;
    const filter = { _id: ObjectId(req.query.id) };

    const updateDoc = {
        $set: {
            name: req.query.name,
            content: req.query.content
        }
    };

    (async () => {
        const db = await database.getDb();
        const result = await db.collection.updateOne(
            filter,
            updateDoc,
            { upsert: true }
        );

        await db.client.close();
        res.status(201).json({data: result });
    })();

});

router.delete("/docs", (req, res) => {
    const ObjectId = require('mongodb').ObjectId;
    const filter = { _id: ObjectId(req.query.id) };

    if (!req.query.id) {
        res.status(400).send("Missing 'id' key")
    }

    (async () => {
        const db = await database.getDb();
        await db.collection.deleteOne(
            filter
        );
        await db.client.close();

        res.status(204).json();
    })();
});

module.exports = router;