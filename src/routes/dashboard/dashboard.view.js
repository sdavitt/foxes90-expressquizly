const axios = require('axios');

module.exports = async (req, res) => {
    const query = `query quizzes{
        quizzes {
              id,
              slug,
              title,
              description,
              avgScore,
              submissions {
                  id
              },
              user {
                  username
              }
            }
        }`
    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, {
            query: query,
            variables: {}
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(data.data.quizzes);
        res.render('dashboard', { user: req.verifiedUser.user, quizzes: data.data.quizzes });
    } catch (e) {
        console.log(e.response.data.errors);
        console.log(e.response.data.errors[0].locations);
        res.redirect('/auth/login');
    }
}