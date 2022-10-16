/*eslint-disable */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require('../db/database.js');

chai.should();

chai.use(chaiHttp);

const secret = process.env.JWT_SECRET;

const payload = { email: "test@test.com" };
const jwt = require('jsonwebtoken');
const token = jwt.sign(payload, secret, { expiresIn: '1h'});

describe('GraphQL', () => {
    before(() => {
        return new Promise(async (resolve) =>{
            const db = await database.getDb("docs");

            db.db.listCollections(
                { name: "docs" }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }
                    const docData = {
                        user: "test@test.se",
                        name: "Uppsats",
                        content: "<p>text</p>",
                        type: "text",
                        access: ["test2@test.se"]
                    };
            
                    await db.collection.insertOne(docData);
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

    before(() => {
        return new Promise(async (resolve) =>{
            const db = await database.getDb("users");

            db.db.listCollections(
                { name: "users" }
            )
                .next()
                .then(async function (info) {
                    if (info) {
                        await db.collection.drop();
                    }

                    const user = {
                        email: "test@test.se",
                        password: "hrdhd",
                        admin: false
                    };
    
                    await db.collection.insertOne(user);
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

    describe('POST /graphql', () => {
        it('Get all documents, status 200', (done) => {
            const query = "{ docs { _id user name content type access } }";

            chai.request(server)
                .post("/graphql")
                .send(JSON.stringify({ query: query }))
                .set("content-type", "application/json")
                .set("Accept", "application/json")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("docs");
                    res.body.data.docs.length.should.be.equal(1);
                    res.body.data.docs[0].should.have.property("_id");
                    res.body.data.docs[0].should.have.property("user");
                    res.body.data.docs[0].should.have.property("name");
                    res.body.data.docs[0].should.have.property("content");
                    res.body.data.docs[0].should.have.property("type");
                    res.body.data.docs[0].should.have.property("access");

                    done();
                });
        });
    });

    describe('POST /graphql', () => {
        it('Get all users, status 200', (done) => {
            const query = "{ users { _id email password admin } }";

            chai.request(server)
                .post("/graphql")
                .send(JSON.stringify({ query: query }))
                .set("content-type", "application/json")
                .set("Accept", "application/json")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("users");
                    res.body.data.users.length.should.be.equal(1);
                    res.body.data.users[0].should.have.property("_id");
                    res.body.data.users[0].should.have.property("email");
                    res.body.data.users[0].should.have.property("password");
                    res.body.data.users[0].should.have.property("admin");

                    done();
                });
        });
    });

    describe('POST /graphql', () => {
        it('Get all docs matching a user, status 200', (done) => {
            const query = `{ matchingdocs(user: "test@test.se") { _id user name content type access } }`;

            chai.request(server)
                .post("/graphql")
                .send(JSON.stringify({ query: query }))
                .set("content-type", "application/json")
                .set("Accept", "application/json")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("matchingdocs");
                    res.body.data.matchingdocs.length.should.be.equal(1);
                    res.body.data.matchingdocs[0].should.have.property("_id");
                    res.body.data.matchingdocs[0].should.have.property("user");
                    res.body.data.matchingdocs[0].user.should.equal("test@test.se");
                    res.body.data.matchingdocs[0].should.have.property("name");
                    res.body.data.matchingdocs[0].name.should.equal("Uppsats");
                    res.body.data.matchingdocs[0].should.have.property("content");
                    res.body.data.matchingdocs[0].content.should.equal("<p>text</p>");
                    res.body.data.matchingdocs[0].should.have.property("type");
                    res.body.data.matchingdocs[0].type.should.equal("text");
                    res.body.data.matchingdocs[0].should.have.property("access");
                    res.body.data.matchingdocs[0].access.should.be.an("array");

                    done();
                });
        });
    });

    describe('POST /graphql', () => {
        it('Get all users matching email address, status 200', (done) => {
            const query = `{ user(email: "test@test.se") { _id email password admin } }`;

            chai.request(server)
                .post("/graphql")
                .send(JSON.stringify({ query: query }))
                .set("content-type", "application/json")
                .set("Accept", "application/json")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("user");
                    res.body.data.user.should.have.property("_id");
                    res.body.data.user.should.have.property("email");
                    res.body.data.user.email.should.equal("test@test.se");
                    res.body.data.user.should.have.property("password");
                    res.body.data.user.password.should.equal("hrdhd");
                    res.body.data.user.should.have.property("admin");
                    res.body.data.user.admin.should.equal(false);

                    done();
                });
        });
    });
});