/*eslint-disable */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require('../db/database.js');
const collectionName = "users";

chai.should();

chai.use(chaiHttp);

describe('Auth', () => {
    before(() => {
        return new Promise(async (resolve) =>{
            const db = await database.getDb(collectionName);

            db.db.listCollections(
                { name: collectionName }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                })
                .catch(function (err) {
                    console.error(err);
                })
                .finally(async function () {
                    await db.client.close();
                    resolve();
                });
        })
    });

    describe('GET /auth/users', () => {
        it('Get all users, none should exist, status 200', (done) => {
            chai.request(server)
                .get("/auth/users")
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('Register a user, status 201, return data.message', (done) => {
            const user = {
                email: "test@test.se",
                password: "test",
                admin: false
            };

            chai.request(server)
                .post("/auth/register")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("message");

                    done();
                });
        });
    });

    describe('GET /auth/users', () => {
        it('Get all users, one user should exist, status 200', (done) => {
            chai.request(server)
                .get("/auth/users")
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('Register a user that already exists, status 400, return error.', (done) => {
            const user = {
                email: "test@test.se",
                password: "test",
                admin: false
            };

            chai.request(server)
                .post("/auth/register")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });

    describe('GET /auth/users', () => {
        it('Get all users, one user should exist, status 200', (done) => {
            chai.request(server)
                .get("/auth/users")
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('Register a user with invalide email address, status 400, return error.', (done) => {
            const user = {
                email: "test@test",
                password: "test",
                admin: false
            };

            chai.request(server)
                .post("/auth/register")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });

    describe('GET /auth/users', () => {
        it('Get all users, one user should exist, status 200', (done) => {
            chai.request(server)
                .get("/auth/users")
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });

    describe('POST /auth/register', () => {
        it('Register a user without email address, status 400, return error.', (done) => {
            const user = {
                password: "test",
                admin: false
            };

            chai.request(server)
                .post("/auth/register")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });

    describe('GET /auth/users', () => {
        it('Get all users, one user should exist, status 200', (done) => {
            chai.request(server)
                .get("/auth/users")
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(1);

                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('Login, status 201, return data with _id, email and token.', (done) => {
            const user = {
                email: "test@test.se",
                password: "test"
            };

            chai.request(server)
                .post("/auth/login")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("_id");
                    res.body.data.should.have.property("email");
                    res.body.data.should.have.property("token");
                    res.body.data.email.should.equal("test@test.se");

                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('Login non existing user, status 400, return error.', (done) => {
            const user = {
                email: "test1@test.se",
                password: "test"
            };

            chai.request(server)
                .post("/auth/login")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('Login wrong password, status 400, return error.', (done) => {
            const user = {
                email: "test@test.se",
                password: "test1"
            };

            chai.request(server)
                .post("/auth/login")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });

    describe('POST /auth/login', () => {
        it('Login missing email, status 400, return error.', (done) => {
            const user = {
                password: "test1"
            };

            chai.request(server)
                .post("/auth/login")
                .send(JSON.stringify(user))
                .set("content-type", "application/json")
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });
});