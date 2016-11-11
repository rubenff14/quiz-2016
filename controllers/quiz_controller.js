var models = require('../models/models.js');

// Autoload, factorizar el código si la ruta incluye el quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		}
		else {
			next(new Error('No existe quizId = ' + quizId));
		}
	}) .catch (function(error) {next(error);});
};

// GET /:quizes
exports.index = function (req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index.ejs', {quizes: quizes, errors:[]});
	}).catch (function(error) {next(error);});
};

// GET /quizes/id
exports.show = function (req, res) {
	var fallos = req.query.fallos;
	var capital = req.query.capital;

	if (typeof capital == 'undefined') {
		capital = '';
	}

	for (var i = 0; i < fallos; i ++) {
		capital = capital + req.quiz.respuesta.charAt(i);
	}
	
	res.render('quizes/show.ejs', {quiz: req.quiz, fallos: fallos, capital: capital, errors:[]});
};

// GET /quizes/:id/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
	var fallos = req.query.fallos;

	if (typeof fallos == 'undefined') {
		fallos = 0;
	}

	if(req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
		resultado = 'Correcto';
		fallos = 0;
	}
	else {
		fallos ++;	
	}

	res.render('quizes/answer.ejs', {quiz: req.quiz, respuesta: resultado, comprobarFallos: fallos, errors:[]});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // Crea objeto quiz
		{pregunta: "pregunta", respuesta: "respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors:[]});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// Guarda en la base de datos los campos pregunta y respuesta de quiz
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {			
			res.redirect('/quizes'); // Redirección a lista de pregunta (URL relativo)
			})
		}
	});
};