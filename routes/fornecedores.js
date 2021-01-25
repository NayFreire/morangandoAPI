const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const fornecedorController = require('../controller/fornecedor-controller')

router.get('/', fornecedorController.getFornecedores)

router.get('/:idColab', fornecedorController.getFornecedor)

router.post('/', login.verificacaoAdm, fornecedorController.postFornecedor)

router.patch('/', login.verificacaoAdm, fornecedorController.patchFornecedor)

router.delete('/', login.verificacaoAdm, fornecedorController.deleteFornecedor)

module.exports = router