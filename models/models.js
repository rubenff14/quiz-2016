var path = require('path');

// Cargar modulo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
	{dialect: "sqlite", storage: "quiz.sqlite"}
);

// Importar la definicion de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// exportar definición de la tabla Quiz
exports.Quiz = Quiz;

// sequelize.sync() crea e inicializa tabla de preguntas en BD
sequelize.sync().then(function() {
	// success() ejecuta el manejador una vez creada la tabla
	Quiz.count().then(function(count) {
		if(count === 0) { // La tabla se inicializa solo si está vacía
			Quiz.create({pregunta: 'Capital de Italia',
						respuesta: 'Roma'
			})
		.then(function() {console.log('Base de datos inicializada')});
		};
	});
});