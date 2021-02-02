const express = require('express');
const router = express.Router();
const login = require('../middleware/login');
const pagamentosController = require('../controller/pagamentos-controller');

router.get('/', pagamentosController.getPagamentos)
router.get('/:idPagamento', pagamentosController.getPagamento)

module.exports = router
