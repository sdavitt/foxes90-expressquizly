// imports of GraphQL datatypes and our mongoose models
const { GraphQLObjectType, GraphQLInputObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLInt, GraphQLFloat } = require('graphql');
const { User, Quiz, Question, Submission } = require('../models');

const UserType = new GraphQLObjectType(
    {
        name: 'User',
        description: 'User GraphQL type',
        fields: () => ({
            id: { type: GraphQLID },
            email: { type: GraphQLString },
            username: {type: GraphQLString },
            quizzes: {
                type: GraphQLList(QuizType),
                resolve(parent, args) {
                    return Quiz.find({ userId: parent.id })
                }
            },
            submissions: {
                type: GraphQLList(SubmissionType),
                resolve(parent, args) {
                    return Submission.find({ userId: parent.id })
                }

            }
        })
    }
);

const QuestionType = new GraphQLObjectType(
    {
        name: 'Question',
        description: 'Question GraphQL type',
        fields: () => ({
            id: { type: GraphQLID },
            title: { type: GraphQLString },
            correctAnswer: { type: GraphQLString },
            quizId: { type: GraphQLString },
            order: { type: GraphQLInt },
            quiz: {
                type: QuizType,
                resolve(parent, args) {
                    Quiz.findById(parent.quizId);
                }
            }
        })
    }
);

const QuestionInputType = new GraphQLInputObjectType(
    {
        name: 'QuestionInput',
        description: 'QuestionInput GraphQL type',
        fields: () => ({
            title: { type: GraphQLString },
            order: { type: GraphQLInt },
            correctAnswer: { type: GraphQLString }
        })
    }
);

const AnswerInputType = new GraphQLInputObjectType(
    {
        name: 'AnswerInput',
        description: 'AnswerInput GraphQL type',
        fields: ()=>({
            questionId: { type: GraphQLString },
            answer: { type: GraphQLString }
        })
    }
)

const QuizType = new GraphQLObjectType(
    {
        name: 'Quiz',
        description: 'Quiz GraphQL type',
        fields: ()=>({
            id: { type: GraphQLID },
            slug: { type: GraphQLString },
            title: { type: GraphQLString },
            description: { type: GraphQLString },
            userId: { type: GraphQLString },
            user: {
                type: UserType,
                resolve(parent, args){
                    return User.findById(parent.userId)
                }
            },
            questions: {
                type: GraphQLList(QuestionType),
                resolve(parent, args){
                    return Question.find({ quizId: parent.id })
                }
            },
            submissions: {
                type: GraphQLList(SubmissionType),
                resolve(parent, args){
                    return Submission.find({ quizId: parent.id })
                }
            },
            avgScore: {
                type: GraphQLFloat,
                async resolve(parent, args){
                    const submissions = await Submission.find({ quizId: parent.id });
                    let total_score = 0;
                    console.log(submissions);
                    for (const submission of submissions){
                        total_score += submission.score
                    };
                    return total_score/submissions.length
                }
            }
        })
    }
);

const SubmissionType = new GraphQLObjectType({
    name: 'Submission',
    description: 'Submission GraphQL type',
    fields: ()=>({
        id: { type: GraphQLID },
        quizId: { type: GraphQLString },
        userId: { type: GraphQLString },
        score: { type: GraphQLInt },
        user: {
            type: UserType,
            resolve(parent, args){
                return User.findById(parent.userId)
            }
        },
        quiz: {
            type: QuizType,
            resolve(parent, args){
                return Quiz.findById(parent.quizId)
            }
        }
    })
});

module.exports = {
    UserType,
    QuizType,
    QuestionType,
    SubmissionType,
    QuestionInputType,
    AnswerInputType
}