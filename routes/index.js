var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');
var userController = require('../controllers/user_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Quiz 2016', errors:[] });
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load);
router.param('commentId', commentController.load);
router.param('userId', userController.load);

// Definición de rutas de sesion
router.get('/login', sessionController.new); // Formulario login
router.post('/login', sessionController.create); // Crear sesión
router.get('/logout', sessionController.destroy); // Destruir sesión 

// Definición de rutas de usuarios
router.get('/users', userController.index); // Listado de usuarios de la BD
router.get('/users/new', userController.new); // Añadir nuevo usuario
router.post('/users/create', userController.create); // Crear usuario en la BD
router.delete('/users/:userId(\\d+)', sessionController.adminRequired, userController.destroy); // Eliminar usuarios
router.get('/users/:userId(\\d+)/edit', sessionController.propietarios, userController.edit); // Ruta vista edit
router.put('/users/:userId(\\d+)', sessionController.propietarios, userController.update); // Ruta para actualizar

// Definición de rutas de /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);

router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);

router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

// Definición de rutas de comentarios
router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

module.exports = router;
