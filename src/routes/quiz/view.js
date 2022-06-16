const axios = require('axios');

module.exports = async (req, res) => {
    const slug = req.params.slug;
    let quizData = {}

    const query = `query quizBySlug($slug: String!){
        quizBySlug(slug: $slug){
            id,
            slug,
            title,
            description,
            questions {
                id,
                title,
                order,
                correctAnswer
            }
        }
    }`;
    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query,
                variables: {
                    slug
                }
            }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        quizData = data.data.quizBySlug;
        console.log(quizData);
        // do we have to sort the questions by their order? maybe....
        res.render('quiz', { user: req.verifiedUser.user, quiz: quizData });
    } catch (e) {
        console.log(e);
        res.redirect('/');
    };
}