const MainQuizRouter = require('express').Router();

MainQuizRouter.route('/create')
    .get(require('./editor.js')) // view the creation form !
    .post(require('./create.js')); // submitting the creation form

MainQuizRouter.route('/success/:slug') // successful creation
    .get(require('./created.js')); // success page !

MainQuizRouter.route('/:slug') // taking the quiz
    .get(require('./view.js')); // see the questions/quiz form !

MainQuizRouter.route('/:slug/submit') // submitting the taken quiz
    .post(require('./submit.js'));

MainQuizRouter.route('/results/:id') // viewing your results
    .get(require('./results.js')); // !

module.export = MainQuizRouter;