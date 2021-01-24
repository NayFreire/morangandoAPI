const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

// const rotasUsuarios = require('./routes/usuarios')
const rotasFornecedores = require('./routes/fornecedores')
// const rotasClientes = require('./routes/clientes')
const rotasProdutos = require('./routes/produtos')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

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

// app.use('/usuarios', rotasUsuarios)
app.use('/fornecedores', rotasFornecedores)
// app.use('/clientes', rotasClientes)
app.use('/produtos', rotasProdutos)

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