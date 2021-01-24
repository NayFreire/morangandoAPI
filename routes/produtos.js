const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const produtoController = require('../controller/produto-controller')

router.get('/', produtoController.getProdutos)
router.get('/:idProduto', produtoController.getProduto)
router.post('/', produtoController.postProdutos)
router.patch('/', produtoController.updateProduto)
router.delete('/', produtoController.deleteProduto)

module.exports = router