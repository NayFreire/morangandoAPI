const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const saidasController = require('../controller/saidas-controller')

router.get('/', saidasController.getSaidas)
router.get('/:idSaida', saidasController.getSaida)
router.post('/', login.verificacaoAdm, saidasController.postSaida)
router.patch('/', login.verificacaoAdm, saidasController.updateSaida)
router.delete('/', login.verificacaoAdm, saidasController.deleteSaida)

module.exports = router