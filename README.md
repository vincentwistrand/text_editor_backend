Text-editor API
================================
This is an API used by a text editor to manage documents.
The API is constructed using Express, Node.js and MongoDB.

How to run
--------------------------------
You need to have npm, node.js and nodemon installed.
Use "npm start" to start server at localhost:1337.

Routes
--------------------------------
In routes/editor.js there is 4 routes to manage the documents:
GET /docs, POST /docs, PUT /docs and DELETE /docs.
In routes/auth.js there is 4 routes to manage users:
POST /auth/register, POST /auth/login, GET /auth/user and GET /auth/users.
In routes/invite there is one route to send invitation email:
POST invite/send.