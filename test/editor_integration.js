process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require('../db/database.js');
const collectionName = "docs";

chai.should();

chai.use(chaiHttp);

describe('Documents', () => {
    before(() => {
        return new Promise(async (resolve) =>{
            const db = await database.getDb();

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
        it('Get all documents, one document should exist, status 200', (done) => {
            chai.request(server)
                .get("/docs")
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
                name: "New title",
                content: "<p>New content</p>"
            };
    
            chai.request(server)
                .post("/docs")
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
                .end((err, res) => {

                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].should.have.property("_id");
                    res.body.data[0].should.have.property("name");
                    res.body.data[0].name.should.equal("New title");
                    res.body.data[0].should.have.property("content");
                    res.body.data[0].content.should.equal("<p>New content</p>");

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
                .end((err, res) => {

                    res.body.data.length.should.be.equal(1);
                    res.body.data[0].should.have.property("_id");
                    res.body.data[0].should.have.property("name");
                    res.body.data[0].name.should.equal("New title");
                    res.body.data[0].should.have.property("content");
                    res.body.data[0].content.should.equal("<p>New content</p>");

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
                    name: "Updated title",
                    content: "<p>Updated content</p>"
                };
        
                chai.request(server)
                    .put("/docs")
                    .query(document)
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
                    .query(document)
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
                    .query({})
                    .end((err, res) => {

                        res.should.have.status(400);

                        done();
                    });
            })();
        });
    });

    describe('POST /docs', () => {
        it('Status 500', (done) => {
            (async () => {
                
                let document = {
                    id: "43256",
                    name: "Updated title",
                    content: "<p>Updated content</p>"
                };
        
                chai.request(server)
                    .put("/docs")
                    .query(document)
                    .end((err, res) => {

                        res.should.have.status(500);

                        done();
                    });
            })();
        });
    });

});