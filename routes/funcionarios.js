const express = require('express');
const router = express.Router();
const usuariosController = require('../controller/funcionarios-controller');

router.post('/cadastro', usuariosController.postFuncionario)

module.exports = router;