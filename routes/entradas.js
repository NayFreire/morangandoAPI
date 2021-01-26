const express = require('express');
const router = express.Router();;
const entradasController = require('../controller/entradas-controller')

router.get('/', entradasController.getEntradas)
router.get('/:idEntrada', entradasController.getEntrada)
router.post('/', entradasController.postEntrada)
router.patch('/:idEntrada', entradasController.updateEntrada)

module.exports = router