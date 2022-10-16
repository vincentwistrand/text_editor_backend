/*eslint-disable */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require('../db/database.js');
const collectionName = "docs";

chai.should();

chai.use(chaiHttp);

const secret = process.env.JWT_SECRET;

const payload = { email: "test@test.com" };
const jwt = require('jsonwebtoken');
const token = jwt.sign(payload, secret, { expiresIn: '1h'});

describe('Documents', () => {
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

    describe('GET /docs', () => {
        it('Get all documents, none should exist, status 200', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.should.have.status(200);
                    res.body.should.be.an("object");
                    res.body.data.should.be.an("array");
                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('POST /docs', () => {
        it('Create new document, status 201', (done) => {
            let document = {
                name: "New title"
            };
    
            chai.request(server)
                .post("/docs")
                .set('x-access-token', token)
                .query(document)
                .end((err, res) => {

                    res.should.have.status(201);
                    res.body.should.be.an("object");
                    res.body.should.have.property("data");
                    res.body.data.should.have.property("acknowledged");
                    res.body.data.should.have.property("insertedId");
                    res.body.data.acknowledged.should.equal(true);
                    
                    done();
                });
        });
    });

    describe('GET /docs', () => {
        it('Check new document', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].should.have.property("_id");
                    res.body.data[0].should.have.property("name");
                    res.body.data[0].name.should.equal("New title");

                    done();
                });
        });
    });

    describe('POST /docs', () => {
        it('Create new document with missing name, status 400', (done) => {
            let document = {
                content: "<p>New content</p>"
            };
    
            chai.request(server)
                .post("/docs")
                .set('x-access-token', token)
                .query(document)
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.be.an("object");
                    res.body.should.have.property("errors");
                    res.body.errors.should.have.property("message");
    
                    done();
                });
        });
    });

    describe('GET /docs', () => {
        it('Check that new document was not created', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].should.have.property("_id");
                    res.body.data[0].should.have.property("name");
                    res.body.data[0].name.should.equal("New title");

                    done();
                });
        });
    });

    describe('PUT /docs', () => {
        it('Update document, status 201', (done) => {
            (async () => {

                // Retrieve document id
                const db = await database.getDb();
                const testDoc = await db.collection.find().toArray();
                const docId = testDoc[0]._id.toString();
                
                let document = {
                    id: docId,
                    user: "test@test.com",
                    name: "Updated title",
                    content: "<p>Updated content</p>",
                    access: []
                };
        
                chai.request(server)
                    .put("/docs")
                    .set({
                        "content-type": "application/json",
                        "x-access-token": token,
                    })
                    .send(JSON.stringify(document))
                    .end((err, res) => {
                        res.body.data.should.have.property("acknowledged");
                        res.body.data.acknowledged.should.equal(true);

                        done();
                    });
            })();
        });
    });

    describe('GET /docs', () => {
        it('Check if document is updated', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].name.should.be.equal("Updated title");
                    res.body.data[0].content.should.be.equal("<p>Updated content</p>");

                    done();
                });
        });
    });

    describe('PUT /docs', () => {
        it('Update document without id, status 400', (done) => {
            (async () => {
           
                let document = {
                    name: "New updated title",
                    content: "<p>New updated content</p>"
                };
        
                chai.request(server)
                    .put("/docs")
                    .set({
                        "content-type": "application/json",
                        "x-access-token": token,
                    })
                    .send(JSON.stringify(document))
                    .end((err, res) => {

                        res.should.have.status(400);
                    
                        done();
                    });
            })();
        });
    });

    describe('GET /docs', () => {
        it('Check that nothing was updated or created', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].name.should.be.equal("Updated title");
                    res.body.data[0].content.should.be.equal("<p>Updated content</p>");

                    done();
                });
        });
    });

    describe('DELETE /docs', () => {
        it('Delete document, status 204', (done) => {
            (async () => {

                // Retrieve document id
                const db = await database.getDb();
                const testDoc = await db.collection.find().toArray();
                const docId = testDoc[0]._id.toString();
                
                let document = {
                    id: docId
                };
        
                chai.request(server)
                    .delete("/docs")
                    .set('x-access-token', token)
                    .query(document)
                    .end((err, res) => {

                        res.should.have.status(204);

                        done();
                    });
            })();
        });
    });

    describe('GET /docs', () => {
        it('Check that document was deleted', (done) => {
            chai.request(server)
                .get("/docs")
                .set('x-access-token', token)
                .end((err, res) => {

                    res.body.data.length.should.be.equal(0);

                    done();
                });
        });
    });

    describe('DELETE /docs', () => {
        it('Delete document no id, status 400', (done) => {
            (async () => {

                chai.request(server)
                    .delete("/docs")
                    .set('x-access-token', token)
                    .query({})
                    .end((err, res) => {

                        res.should.have.status(400);

                        done();
                    });
            })();
        });
    });
});