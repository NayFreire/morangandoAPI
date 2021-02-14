const express = require('express');
const router = express.Router();
const login = require('../middleware/login')
const entradasController = require('../controller/entradas-controller')

router.get('/', entradasController.getEntradas)
router.get('/:idEntrada', entradasController.getEntrada)
router.get('/:mes', entradasController.getEntradaPorMes)
router.post('/',login.verificacaoAdm, entradasController.postEntrada)
router.patch('/', login.verificacaoAdm, entradasController.updateEntrada)
router.delete('/', login.verificacaoAdm, entradasController.deleteEntrada)

module.exports = router