const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const clienteController = require('../controller/cliente-controller')

router.get('/', clienteController.getClientes)
router.get('/:idColab', clienteController.getCliente)
router.post('/', clienteController.postCliente)
router.patch('/', clienteController.updateCliente)
router.delete('/', clienteController.deleteCliente)

module.exports = router