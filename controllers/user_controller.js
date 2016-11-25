var models = require('../models/models.js');

// Comprueba se el ususario esta registrado en users
// Si la autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	models.Usuario.findOne({where: { username: login, password: password}}).then(function(user) {
		if (user) {
			callback(null, user);
		}
		else {
			callback(new Error('Datos incorrectos'));
		}
	}) .catch (function(error) {error;});	
};