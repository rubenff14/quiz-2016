var models = require('../models/models.js');

exports.question = function (req, res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/question', { pregunta:quiz[0].pregunta})
	});
};

exports.estadisticas = function (req, res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/estadisticas', { aciertos:quiz[0].aciertos, fallos:quiz[0].fallos})
	});
};

exports.answer = function (req, res) {
	models.Quiz.findAll().then(function(quiz) {
		if(req.query.respuesta.toUpperCase() === quiz[0].respuesta.toUpperCase()) {
			quiz[0].aciertos ++;
			quiz[0].aciertosConsecutivos ++;
			quiz[0].save().then(function(quiz) {
				res.render('quizes/answer', {respuesta: 'Correcto'});
			});
		} else {
			quiz[0].fallos ++;
			var aciertosConsecutivos = quiz[0].aciertosConsecutivos;
			quiz[0].aciertosConsecutivos = 0;
			quiz[0].save().then(function(quiz) {
				res.render('quizes/aciertosConsecutivos', {respuesta: 'Incorrecto', aciertosConsecutivos: aciertosConsecutivos});
			});
		}	
	});
};