// MV de autorización de accesos restringidos
exports.loginRequired = function(req, res, next) {
	if (req.session.user) {
		next();
	} else {
		res.redirect('/login');
	}
};

// MV de autorización de accesos restringidos solo admin
exports.adminRequired = function(req, res, next) {
	if (req.session.user.username === 'admin') {
		next();
	} else {
		res.redirect('/login');
	}
};

exports.propietarios = function(req, res, next) {
	if (req.session.user.id === parseInt(req.params.userId) || req.session.user.username === 'admin') {
		next();	
	} else {
		res.redirect('/users');
	}
} 

// Get /login -- Formulario de login
exports.new = function(req, res) {
	var errors = req.session.errors || {};
	req.session.errors = {};

	res.render('sessions/new', {errors: errors});
};

// POST /login --Crear la sesión
exports.create = function(req, res) {
	var login = req.body.login;
	var password = req.body.password;

	var userController = require('./user_controller');
	userController.autenticar(login, password, function(error, user) {
		if (error) {
			req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
			res.redirect("/login");
			return;
		}
		// Crear req.session.user y guarda campos id y username
		// La sesión se define por la existencia de: req.session.user
		req.session.user = {id:user.id, username:user.username};
		res.redirect(req.session.redir.toString()); // Redirección a path anterior a login
	});
};

// DELETE /logout --Destruir sesión
exports.destroy = function(req, res) {
	delete req.session.user;
	res.redirect(req.session.redir.toString()); // Redirección a path anterior a login
};