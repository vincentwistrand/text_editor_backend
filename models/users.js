const database = require('../db/database');
const validator = require("email-validator");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const jwt = require('jsonwebtoken');

const usersModel = {
    getAllUsers: async function getAllUsers() {
        let db = await database.getDb("users");
        const users = await db.collection.find({}).toArray();

        await db.client.close();

        return users;
    },

    register: async function register(res, body) {
        const email = body.email;
        const password = body.password;
        const admin = body.admin;

        const query = {
            email: email
        };

        let db = await database.getDb("users");
        const user = await db.collection.findOne(query);

        if (user) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "User already exists.",
                }
            });
        }

        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email or password is missing",
                }
            });
        }

        if (!validator.validate(email)) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email has wrong format",
                }
            });
        }

        bcrypt.hash(password, saltRounds, async function(err, hash) {
            if (err) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        message: "Could not hash password",
                    }
                });
            }

            try {
                const user = {
                    email: email,
                    password: hash,
                    admin: admin
                };

                await db.collection.insertOne(user);

                return res.status(201).json({
                    data: {
                        message: "User successfully created."
                    }
                });
            } catch (error) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Could not create new user"
                    }
                });
            } finally {
                await db.client.close();
            }
        });
    },

    login: async function login(res, body) {
        const email = body.email;
        const password = body.password;

        if (!email || !password) {
            return res.status(400).json({
                errors: {
                    status: 400,
                    message: "Email or password is missing",
                }
            });
        }

        let db = await database.getDb("users");

        try {
            const query = {
                email: email
            };

            const user = await db.collection.findOne(query);

            if (user) {
                return usersModel.comparePasswords(res, user, password);
            } else {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        message: "User do not exist",
                    }
                });
            }
        } finally {
            await db.client.close();
        }
    },

    comparePasswords: async function comparePasswords(res, user, password) {
        const hash = user.password;

        bcrypt.compare(password, hash, function(err, result) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        message: "Decryption error."
                    }
                });
            }

            if (result === false) {
                return res.status(400).json({
                    errors: {
                        status: 400,
                        message: "Wrong password."
                    }
                });
            }

            if (result) {
                const payload = { email: user.email };
                const secret = process.env.JWT_SECRET;

                const token = jwt.sign(payload, secret, { expiresIn: '1h'});

                return res.status(201).json({
                    data: {
                        _id: user._id,
                        email: user.email,
                        token: token
                    }
                });
            }
        });
    },

};

module.exports = usersModel;
