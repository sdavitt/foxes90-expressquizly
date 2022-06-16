const axios = require("axios");

module.exports = async (req, res) => {
    const quizInputs = req.body;
    console.log(req.verifiedUser.user);
    const quizData = {
        userId: req.verifiedUser.user._id,
        title: quizInputs['quizTitle'],
        description: quizInputs['quizDescription'],
        questions: [] // {title: <>, order: <>, correctAnswer: <>}
    };
    // populates questions array in quizData
    for (key in quizInputs) {
        if (key.includes('questionTitle')) {
            // questionTitle1
            const questionNum = parseInt(key.split('questionTitle')[1]);
            // if this question doesn't yet exist in our quizData, create it
            while (!quizData.questions[questionNum]) {
                quizData.questions.push({})
            }
            quizData.questions[questionNum].title = quizInputs[key]
        } else if (key.includes('questionAnswer')) {
            const questionNum = parseInt(key.split('questionAnswer')[1]);
            quizData.questions[questionNum].correctAnswer = quizInputs[key]
            quizData.questions[questionNum].order = questionNum + 1
        }
    }

    const mutation = `mutation createQuiz($userId: String!, $title: String!, $description: String!, $questions: [QuestionInput!]!){
        createQuiz(userId: $userId, title: $title, description: $description, questions: $questions)
    }`;
    try {
        const { data } = await axios.post(process.env.GRAPHQL_ENDPOINT, {
            query: mutation,
            variables: quizData
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(data);
        quizSlug = data.data.createQuiz;
        res.redirect(`/quiz/success/${quizSlug}`);
    } catch(e){
        console.log(e.response.data.errors);
        res.redirect('/');
    }
}