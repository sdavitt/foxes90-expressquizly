const { GraphQLList, GraphQLID, GraphQLString } = require('graphql');
const { UserType, QuizType, SubmissionType } = require('./types');
const { User, Quiz, Submission } = require('../models');

// all users in our DB - testing
const users = {
    type: new GraphQLList(UserType),
    description: 'Query all users in our db',
    resolve(parent, args) {
        return User.find()
    }
}

// get a specific user by their id
const user = {
    type: UserType,
    description: 'Query a specific user by ID',
    args: {
        id: { type: GraphQLID }
    },
    resolve(parent, args) {
        return User.findById(args.id)
    }
}

// get a quiz by its slug
const quizBySlug = {
    type: QuizType,
    description: 'Query a specific quiz by slug',
    args: {
        slug: { type: GraphQLString }
    },
    resolve(parent, args) {
        return Quiz.findOne({ slug: args.slug })
    }
}

// get a submission by its ID
const submissionById = {
    type: SubmissionType,
    description: 'Query a specific submission by ID',
    args: {
        id: { type: GraphQLString }
    },
    resolve(parent, args) {
        return Submission.findById(args.id)
    }
}

module.exports = { users, user, quizBySlug, submissionById }