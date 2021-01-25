const jwt = require('jsonwebtoken')

exports.verificacaoAdm = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]
        console.log(token)

        const decode = jwt.verify(token, process.env.JWT_KEY)
        console.log(req.usuario)
        req.usuario = decode
        console.log(req.usuario)

        if(req.usuario.status != 'admin'){
            return res.status(401).send({
                mensagem: "Você precisa ser admin para realizar esta ação"
            })
        }
        else{
            next()
        }

    } catch (error) {
        return res.status(401).send({
            mensagem: "Falha na autenticação: login"
        })
    }
}