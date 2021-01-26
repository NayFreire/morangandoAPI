const express = require('express');
const router = express.Router();
const saidasController = require('../controller/saidas-controller')

router.get('/', saidasController.getSaidas)
router.get('/:idSaida', saidasController.getSaida)
router.post('/', saidasController.postSaida)
router.patch('/', saidasController.updateSaida)
router.delete('/', saidasController.deleteSaida)

module.exports = router