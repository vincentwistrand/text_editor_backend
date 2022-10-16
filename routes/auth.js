var express = require('express');
var router = express.Router();

const usersModel = require('../models/users');


router.post("/register", async (req, res) => {
    const body = req.body;

    await usersModel.register(res, body);
});

router.post("/login", async (req, res) => {
    const body = req.body;

    await usersModel.login(res, body);
});

router.get("/users", async (req, res) => {
    const resultSet = await usersModel.getAllUsers();

    res.json({data: resultSet});
});

router.delete("/user", async (req, res) => {
    const id = req.body.id;

    await usersModel.deleteUser(id, res);
});


module.exports = router;
