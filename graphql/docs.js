const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


const DocType = new GraphQLObjectType({
    name: 'Document',
    description: 'This represents a document',
    fields: () => ({
      _id: { type: GraphQLNonNull(GraphQLString) },
      user: { type: GraphQLNonNull(GraphQLString) },
      name: { type: GraphQLNonNull(GraphQLString) },
      type: { type: GraphQLNonNull(GraphQLString) },
      content: { type: GraphQLString },
      access: { type: GraphQLList(GraphQLString) },
    })
})

module.exports = DocType;