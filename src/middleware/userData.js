const axios = require('axios');
const { GraphQLID } = require('graphql');

const userData = async (req, res, next) => {
    if (!req.verifiedUser){
        next();
        return;
    }

    const query = `query user($id: ID!) {
        user ( id: $id ) {
            id,
            username,
            quizzes {
                id,
                slug,
                title,
                description,
                questions {
                    title,
                    order,
                    correctAnswer
                },
                submissions {
                    score,
                    userId
                },
                avgScore
            },
            submissions {
                id,
                quizId,
                score,
                quiz {
                    title,
                    description
                    avgScore
                }
            }
        }
    }`
    console.log(`Current user ID: ${req.verifiedUser.user._id}`);
    let data = {}
    try {
        data = await axios.post(process.env.GRAPHQL_ENDPOINT, {
            query,
            variables: {
                id: req.verifiedUser.user._id
            }
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        console.log(e);
    }
    // now we should have access to the response from the graphQL query
    req.verifiedUser.user.quizzes = data.data.data.user.quizzes;
    req.verifiedUser.user.submissions = data.data.data.user.submissions;
    console.log('UserData:', req.verifiedUser.user);
    next(); // this will be sending us to our actual routing, so I should add to the request parameters anything I intend to use there
}

module.exports = { userData }