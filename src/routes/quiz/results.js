const axios = require('axios');

module.exports = async (req, res) => {
    const query = `query submissionById($id: String!){
        submissionById(id: $id){
            id,
            quiz {
                title
            },
            user {
                id
            },
            score
        }
    }
    `

    let submission = {}
    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query,
                variables: {
                    id: req.params.id
                }
            },{
                headers:{
                    'Content-Type': 'application/json'
                }
            });
        submission = data.data.submissionById;
        // 1 issue to handle: someone typed in a random submission id and is viewing another user's submission
        if (submission.user.id !== req.verifiedUser.user._id){
            res.redirect('/');
        }
        res.render('quiz-results', { submission });
    } catch(e){
        console.log(e);
        res.redirect('/');
    }
}