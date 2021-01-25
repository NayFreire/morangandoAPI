const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const fpController = require('../controller/fornecedoresProdutos-controller')

router.get('/', fpController.getPodutosDeFornecedores)

router.post('/', fpController.postProdutoDeFornecedor)

module.exports = router