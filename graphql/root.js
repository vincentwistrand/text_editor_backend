const docsModel = require("../models/docs.js");
const usersModel = require("../models/users.js");
const DocType = require("./docs.js");
const UserType = require("./users.js");

const {
    GraphQLObjectType,
    GraphQLList,
    GraphQLString
} = require('graphql');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({

      docs: {
        type: new GraphQLList(DocType),
        description: 'List of Documents',
        resolve: async function() {
            return await docsModel.getDocs();
        }
      },

      matchingdocs: {
        type: new GraphQLList(DocType),
        description: 'List of all documents matching email',
        args: {
            user: { type: GraphQLString }
        },
        resolve: async function(parent, args) {
            let docsArray = await docsModel.getDocs();

            return docsArray.filter(doc => doc.user === args.user);
        }
      },

      users: {
        type: new GraphQLList(UserType),
        description: 'List of users',
        resolve: async function() {
            return await usersModel.getAllUsers();
        }
      },

      user: {
        type: UserType,
        description: 'A single user',
        args: {
            email: { type: GraphQLString }
        },
        resolve: async function(parent, args) {
            let usersArray = await usersModel.getAllUsers();

            return usersArray.find(user => user.email === args.email);
        }
      },
    })
})

module.exports = RootQueryType;