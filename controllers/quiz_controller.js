var models = require('../models/models.js');

// GET /:quizes
exports.index = function (req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes})
	});
};

// GET /quizes/id
exports.show = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show.ejs', {quiz: quiz})
	});
};

// GET /quizes/:id/answer
exports.answer = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function(quiz) {
		if(req.query.respuesta.toUpperCase() === quiz.respuesta.toUpperCase()) {
			res.render('quizes/answer.ejs', {quiz: quiz, respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer.ejs', {quiz: quiz, respuesta: 'Incorrecto'});
		}	
	});
};