const express = require('express');
const router = express.Router();
const funcionariosController = require('../controller/funcionarios-controller');

router.post('/cadastro', funcionariosController.postFuncionario)
router.post('/login', funcionariosController.loginFuncionario)

module.exports = router;