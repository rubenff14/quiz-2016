var models = require('../models/models.js');

// Autoload, factorizar el código si la ruta incluye el quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findOne({where: { id: Number(quizId)}, include: [{model: models.Comment}]}).then(function(quiz) {
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
	res.render('quizes/show.ejs', {quiz: req.quiz, errors:[]});
};

// GET /quizes/:id/answer
exports.answer = function (req, res) {
	var resultado = 'Incorrecto';
		if(req.query.respuesta.toUpperCase() === req.quiz.respuesta.toUpperCase()) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer.ejs', {quiz: req.quiz, respuesta: resultado, errors:[]});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build({}); // Crea objeto quiz vacio
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

// GET /quizes/edit
exports.edit = function(req, res) {
	var quiz = req.quiz;
	
	res.render('quizes/edit', {quiz: quiz, errors:[]});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(
		function(err) {
			if(err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}
			else {
				// Guarda en la base de datos los campos pregunta y respuesta de req.quiz
				req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {			
				res.redirect('/quizes'); // Redirección a lista de pregunta (URL relativo)
				});
			}
		}
	);
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error) {next (error)});
};