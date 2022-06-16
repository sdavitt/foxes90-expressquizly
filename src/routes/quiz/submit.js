const axios = require('axios');

module.exports = async (req, res) => {
    const slug = req.params.slug
    let answers = [];
    let submissionId = ''

    for (const key in req.body){
        if (key !== 'title' && key !== 'quizId'){
            answers.push({
                questionId: key,
                answer: String(req.body[key])
            });
        }
    }

    const mutation = `mutation submitQuiz($userId: String!, $quizId: String!, $answers: [AnswerInput!]!){
        submitQuiz(userId: $userId, quizId: $quizId, answers: $answers)
    }`

    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT,
            {
                query: mutation,
                variables: {
                    quizId: req.body.quizId,
                    userId: req.verifiedUser.user._id,
                    answers
                }
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        console.log(data);
        submissionId = data.data.submitQuiz;
        res.redirect(`/quiz/results/${submissionId}`);
    } catch(e){
        console.log(e);
        res.redirect('/');
    }
}