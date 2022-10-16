var express = require('express');
var router = express.Router();

const docsModel = require('../models/docs');


router.get("/docs",
    (req, res, next) => docsModel.checkToken(req, res, next),
    async (req, res) => {
        const resultSet = await docsModel.getDocs();

        res.json({data: resultSet});
    }
);


router.get("/userdocs",
    (req, res, next) => docsModel.checkToken(req, res, next),
    async (req, res) => {
        const email = req.query.email;
        const resultSet = await docsModel.getUserDocs(email);

        res.json({data: resultSet});
    }
);


router.post("/docs",
    (req, res, next) => docsModel.checkToken(req, res, next),
    async (req, res) => {
        const newDoc = req.query;

        if (newDoc.name) {
            const resultSet = await docsModel.postDocs(newDoc);

            res.status(201).json({data: resultSet });
        } else {
            res.status(400).json({ errors: {
                message: "'name' and 'content' needed to create new document."
            }});
        }
    }
);


router.put("/docs",
    (req, res, next) => docsModel.checkToken(req, res, next),
    async (req, res) => {
        const id = req.body.id;
        const name = req.body.name;
        const content = req.body.content;
        const access = req.body.access;

        if (!id) {
            res.status(400).send("Missing 'id' key");
            return;
        }

        const resultSet = await docsModel.putDocs(id, name, content, access);

        res.status(201).json({data: resultSet });
    }
);


router.delete("/docs",
    (req, res, next) => docsModel.checkToken(req, res, next),
    async (req, res) => {
        const id = req.query.id;

        if (!id) {
            res.status(400).send("Missing 'id' key");
        }

        await docsModel.deleteDocs(id);
        res.status(204).json();
    }
);

module.exports = router;
