const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const clienteController = require('../controller/cliente-controller')

router.get('/', clienteController.getClientes)
router.get('/:idColab', clienteController.getCliente)
router.post('/', login.verificacaoAdm, clienteController.postCliente)
router.patch('/', login.verificacaoAdm, clienteController.updateCliente)
router.delete('/', login.verificacaoAdm, clienteController.deleteCliente)

module.exports = router