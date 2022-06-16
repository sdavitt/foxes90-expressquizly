const { GraphQLString, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLInt } = require('graphql');
const { QuestionInputType, AnswerInputType } = require('./types');
const { User, Quiz, Question, Submission } = require('../models');
const { createJwtToken } = require('../util/auth');

const register = {
    type: GraphQLString, // return type
    args: {
        username: { type: GraphQLString },
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args){
        // we need to determine if this email is already in use
        const checkUser = await User.findOne({ email: args.email });
        if (checkUser){
            throw new Error("User with this email already exists.");
        }
        // we need to create a new User object to put in the database with this information
        // deconstruct the args object
        const { username, email, password } = args;
        const user = new User({ username, email, password });
        // then actually put it in the database
        await user.save()
        // then whatever other operations we need to ensure that this is a working user account (we'll need to create  JWT for them)
        // create JWT
        let token = createJwtToken(user);
        return token
    }
}

const login = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString }
    },
    async resolve(parent, args){
        const user = await User.findOne({ email: args.email });
        if (!user || args.password !== user.password){
            throw new Error("Invalid Credentials");
        }

        // create their token and hand it to them to log in
        let token = createJwtToken(user);
        return token
    }
}

const createQuiz = {
    type: GraphQLString,
    args: {
        title: { type: GraphQLString },
        description: { type:GraphQLString },
        userId: { type: GraphQLString },
        questions: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(QuestionInputType)))
        }
    },
    async resolve(parent, args){
        // generate our slug
        let slugify = args.title.toLowerCase().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
        let fullSlug;
        while (true) {
            let slugId = Math.floor(Math.random()*10000);
            fullSlug = `${slugify}-${slugId}`;
            const existingQuiz = await Quiz.findOne({ slug: fullSlug });
            if (!existingQuiz){
                break;
            }
        }
        // create the quiz object
        const quiz = new Quiz({
            title: args.title,
            slug: fullSlug,
            description: args.description,
            userId: args.userId
        });
        // save the quiz to the database
        await quiz.save()
        // create the questions
        for (const question of args.questions){
            const questionItem = new Question({
                title: question.title,
                correctAnswer: question.correctAnswer,
                order: question.order,
                quizId: quiz.id
            })
            // save the questions in the database
            questionItem.save()
        }
        // return the slug (aka what can be used to identify the quiz)
        return quiz.slug
    }
}

const submitQuiz = {
    type: GraphQLString,
    args: {
        answers: {
            type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(AnswerInputType)))
        },
        userId: { type: GraphQLString },
        quizId: { type: GraphQLString }
    },
    async resolve(parent, args){
        try{
            let correct = 0;
            let questions = args.answers.length;
            for ( const answer of args.answers){
                // for each answer, grab the question from the database and compare the correct answer to the given answer
                const question = await Question.findById(answer.questionId);
                if (answer.answer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase()){
                    correct++;
                }
            }
            const score = correct/questions*100;
            const submission = new Submission({
                userId: args.userId,
                quizId: args.quizId,
                score: score
            });
            submission.save()
            return submission.id
        } catch(e) {
            console.log(e);
            return null
        }
    }
}

module.exports = { register, login, createQuiz, submitQuiz };