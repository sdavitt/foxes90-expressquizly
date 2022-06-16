// import some stuff from graphql
const { GraphQLSchema, GraphQLObjectType } = require('graphql');
// import our queries
const queries = require('./queries');
// import our mutations
const mutations = require('./mutations');

const QueryType = new GraphQLObjectType({
    name: 'QueryType',
    description: 'GraphQL Queries',
    fields: queries
});

const MutationType = new GraphQLObjectType({
    name: 'MutationType',
    description: 'GraphQL Mutations',
    fields: mutations
});

module.exports = new GraphQLSchema({query: QueryType, mutation: MutationType});