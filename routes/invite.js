var express = require('express');
var router = express.Router();

const docsModel = require('../models/docs');
const inviteModel = require('../models/invite');


router.post("/send",
    (req, res, next) => docsModel.checkToken(req, res, next),
    async (req, res) => {
        const content = req.body;

        await inviteModel.sendMail(res, content);
    }
);

module.exports = router;
