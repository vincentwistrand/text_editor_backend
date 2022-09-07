var express = require('express');
var router = express.Router();

const database = require('../db/database');

router.get("/docs", (req, res) => {
    (async () => {
        const db = await database.getDb();
        const resultSet = await db.collection.find({}).toArray();
        await db.client.close();

        res.json(resultSet);
    })();
});

router.post("/docs", (req, res) => {
    const newCharacter = {
        name: req.query.name,
        content: req.query.content,
    };

    (async () => {
        const db = await database.getDb();
        const result = await db.collection.insertOne(newCharacter);
        await db.client.close();

        res.status(201).json({msg: result });
    })();
});

router.put("/docs", (req, res) => {
    const ObjectId = require('mongodb').ObjectId;
    const filter = { _id: ObjectId(req.query.id) };

    const updateCharacter = {
        $set: {
            name: req.query.name,
            content: req.query.content
        }
    };

    (async () => {
        const db = await database.getDb();
        const result = await db.collection.updateOne(
            filter,
            updateCharacter,
            { upsert: true }
        );

        await db.client.close();
        res.json({msg: result });
    })();

});

router.delete("/docs", (req, res) => {
    const ObjectId = require('mongodb').ObjectId;
    const filter = { _id: ObjectId(req.query.id) };

    (async () => {
        const db = await database.getDb();
        await db.collection.deleteOne(
            filter
        );
        await db.client.close();

        res.status(204).json();
    })();
});

router.get("/test", (req, res) => {
    const data = {
        data: {
            msg: "test"
        }
    };

    res.json(data);
});

module.exports = router;