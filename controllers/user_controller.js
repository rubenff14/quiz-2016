var models = require('../models/models.js');

// Autoload :id de usuarios
exports.load = function(req, res, next, userId) {
	models.User.findOne({
		where: {
			id: Number(userId)
		}
	}).then(function(user) {
		if(user) {
			req.user = user;
			next();
		} else {
			next(new Error('No existe userId = ' + userId))
		}
	}
	).catch(function(error) {next(error)});
};

// GET /users
exports.index = function (req, res) {
	models.User.findAll().then(function(users) {
		res.render('users/index.ejs', {users: users, errors:[]});
	}).catch (function(error) {next(error);});
};

// GET /users/new
exports.new = function(req, res) {
	var user = models.User.build({}); // Crea objeto usuario vacio
	res.render('users/new', {user: user, errors:[]});
};

// POST /users/create
exports.create = function(req, res) {
	var user = models.User.build(req.body.user);

	user.validate().then(function(err) {
		if(err) {
			res.render('users/new', {user: user, errors: err.errors});
		} else {
			if (req.body.user.password === req.body.password1) {
				// Guarda en la base de datos los campos username y password de usuario
				user.save({fields: ["username", "password"]}).then(function() {			
				res.redirect('/users'); // Redirección a users (URL relativo)
				})	
			} else {
				res.render('users/new', {user: user, errors: [{message: 'Las contraseñas no son iguales'}]});
			}
		}
	});
};

// GET /users/edit
exports.edit = function(req, res) {
	var user = req.user;
	
	res.render('users/edit', {user: user, errors:[]});
};

// PUT /users/:id
exports.update = function(req, res) {
	req.user.username = req.body.user.username;
	req.user.password = req.body.user.password;

	req.user.validate().then(
		function(err) {
			if(err) {
				res.render('users/edit', {user: req.user, errors: err.errors});
			}
			else {
				if (req.body.user.password === req.body.password1) {
					// Guarda en la base de datos los campos username y password de req.user
					req.user.save({fields: ["username", "password"]}).then(function() {			
					res.redirect('/users'); // Redirección a lista de pregunta (URL relativo)
					});
				} else {
				res.render('users/edit', {user: req.user, errors: [{message: 'Las contraseñas no son iguales'}]});
				}
			}
		}
	);
};

// DELETE /users/:id
exports.destroy = function(req, res) {
	req.user.destroy().then( function() {
		res.redirect('/users');
	}).catch(function(error) {next (error)});
};

// Comprueba se el ususario esta registrado en users
// Si la autenticación falla o hay errores se ejecuta callback(error)
exports.autenticar = function(login, password, callback) {
	models.User.findOne({where: { username: login, password: password}}).then(function(user) {
		if (user) {
			callback(null, user);
		}
		else {
			callback(new Error('Datos incorrectos'));
		}
	}) .catch (function(error) {error;});	
};