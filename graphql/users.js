const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLBoolean,
    GraphQLNonNull
} = require('graphql');


const UserType = new GraphQLObjectType({
    name: 'User',
    description: 'This represents a document',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      email: { type: GraphQLNonNull(GraphQLString) },
      password: { type: GraphQLNonNull(GraphQLString) },
      admin: { type: GraphQLNonNull(GraphQLBoolean) }
    })
})

module.exports = UserType;