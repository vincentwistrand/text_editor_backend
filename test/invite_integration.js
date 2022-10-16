/*eslint-disable */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app.js');
const database = require('../db/database.js');
const collectionName = "users";

chai.should();

chai.use(chaiHttp);

const secret = process.env.JWT_SECRET;

const payload = { email: "test@test.com" };
const jwt = require('jsonwebtoken');
const token = jwt.sign(payload, secret, { expiresIn: '1h'});

describe('Invite', () => {

    describe('POST /invite/send', () => {
        it('Send mail to non validet email address, status 400, return errors', (done) => {
            const mail = {
                to: "test@test",
                from: "test@test.se",
                title: "Title"
            };

            chai.request(server)
                .post("/invite/send")
                .set("content-type", "application/json")
                .set('x-access-token', token)
                .send(JSON.stringify(mail))
                .end((err, res) => {

                    res.should.have.status(400);
                    res.body.should.have.property("errors");

                    done();
                });
        });
    });
});