const database = require('../db/database');

const jwt = require('jsonwebtoken');

const ObjectId = require('mongodb').ObjectId;

const docsModel = {
    getDocs: async function getDocs() {
        const db = await database.getDb();
        const resultSet = await db.collection.find({}).toArray();
        await db.client.close();
            
        return resultSet;
    },

    getUserDocs: async function getUserDocs(email) {
        const user = {
            user: email
        };

        console.log(email);

        const db = await database.getDb();
        const resultSet = await db.collection.find(user).toArray();
        await db.client.close();
            
        return resultSet;
    },

    postDocs: async function postDocs(newDoc) {
        const docData = {
            user: newDoc.user,
            name: newDoc.name,
            content: "",
            access: new Array()
        };

        const db = await database.getDb();
        const resultSet = await db.collection.insertOne(docData);
        await db.client.close();
    
        return resultSet;
    },

    putDocs: async function putDocs(id, name, content, access) {
        const filter = { _id: ObjectId(id) };

        const updateDoc = {
            $set: {
                name: name,
                content: content,
                access: access
            }
        };

        const db = await database.getDb();
        const resultSet = await db.collection.updateOne(
            filter,
            updateDoc,
            { upsert: true }
        );
        await db.client.close();
    
        return resultSet;
    },
    
    deleteDocs: async function deleteDocs(id) {
        const filter = { _id: ObjectId(id) };

        const db = await database.getDb();
        await db.collection.deleteOne(
            filter
        );
        await db.client.close();

        return;
    },

    checkToken: async function checkToken(req, res, next) {
        const token = req.headers['x-access-token'];
    
        jwt.verify(token, process.env.JWT_SECRET, function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        message: "Token has expired"
                    }
                })
            }
    
            // Valid token send on the request
            next();
        });
    },
};

module.exports = docsModel;