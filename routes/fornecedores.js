const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const fornecedorController = require('../controller/fornecedor-controller')

router.get('/', fornecedorController.getFornecedores)
router.get('/:idColab', fornecedorController.getFornecedor)
router.post('/', fornecedorController.postFornecedor)
router.patch('/', fornecedorController.patchFornecedor)
router.delete('/', fornecedorController.deleteFornecedor)

module.exports = router