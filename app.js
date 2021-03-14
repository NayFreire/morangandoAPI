const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const rotasFuncionarios = require('./routes/funcionarios')
const rotasFornecedores = require('./routes/fornecedores')
const rotasClientes = require('./routes/clientes')
const rotasProdutos = require('./routes/produtos')
const rotasProdutosDeFornecedores = require('./routes/fornecedoresProdutos')
const rotasEntradas = require('./routes/entradas')
const rotasSaidas = require('./routes/saidas')
const rotasPagamentos = require('./routes/pagamentos')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(cors())

//Header control access
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*') //Permissão de controle de acesso a qualquer servidor. Caso quisesse que somente um servidor tenha acesso à essa API, substitua o * pelo link do servidor ao qual quer dar acesso
    res.header('Access-Control-Allow-Header', //Permissão de controle de acesso à cabeçalhos
    'Origin, X-Requested-With, Accept, Content-Type, Authorization')
    
    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET') //Permissão de controle de acesso de métodos
        return res.status(200).send({})
    }

    next()
})

app.use('/funcionarios', rotasFuncionarios)
app.use('/fornecedores', rotasFornecedores)
app.use('/clientes', rotasClientes)
app.use('/produtos', rotasProdutos)
app.use('/produtosDeFornecedores', rotasProdutosDeFornecedores)
app.use('/entradas', rotasEntradas)
app.use('/saidas', rotasSaidas)
app.use('/pagamentos', rotasPagamentos)

//QUANDO NENHUMA ROTA É ENCONTRADA, ENTRA AQUI
app.use((req, res, next) => {
    const erro = new Error('Não encontrado') //SETANDO O ERRO COMO NÃO ENCONTRADO
    erro.status = 404 //SETANDO O STATUS CODE COMO 404
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500) //SETANDO O STATUS PARA O STATUS DO ERRO OU 500
    return res.send({ //
        erro: {
            mensagem: error.message,
            errno: error.status
        }
    })
})

module.exports = app;