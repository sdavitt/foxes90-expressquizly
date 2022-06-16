module.exports = async (req, res) => {
    const quizInputs = req.body;

    const quizData = {
        userId: req.verifiedUser.user._id,
        title: quizInputs['quizTitle'],
        description: quizInputs['quizDescription'],
        questions: []
    };

    for (key in quizInputs){
        break;
    }
}