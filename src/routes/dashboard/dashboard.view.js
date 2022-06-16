const axios = require('axios');

module.exports = async (req, res) => {
    /* const quizzesData = []
    const query = `{
        quizzes {
              id,
              slug,
              description,
              avgScore
              }
    }`
    try {
        const { data } = await axios.get(process.env.GRAPHQL_ENDPOINT, {
            query: query,
            variables: {}
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(data.data.quizzes); */
        res.render('dashboard', { user: req.verifiedUser.user });
/*     } catch (e) {
        console.log(e.response.data.errors);
        res.redirect('/auth/login');
    } */
}