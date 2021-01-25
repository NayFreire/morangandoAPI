const mysql = require('../mysql').pool

//RETORNA TODOS OS CLIENTES

exports.getClientes = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query(`SELECT 
                    colabs.idColab, 
                    colabs.nome, 
                    colabs.cidade, 
                    colabs.bairro, 
                    colabs.email, 
                    colabs.telefone, 
                    cliente.cnpj 
                    FROM colabs INNER JOIN cliente 
                    ON idColab = colabClienteId`, (error, result, fields) => {
                        conn.release()
                        if(error){
                            return res.status(500).send({
                                error: error
                            })
                        }

                        const response = {
                            quantidadeRegistros: result.length,
                            clientes: result.map(cliente => {
                                return{
                                    idColab: cliente.idColab,
                                    nome: cliente.nome,
                                    cidade: cliente.cidade,
                                    bairro: cliente.bairro,
                                    email: cliente.email,
                                    telefone: cliente.telefone,
                                    cnpj: cliente.cnpj,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna todos os fornecedores',
                                        url: 'http://localhost:3300/clientes/'
                                    }
                                }
                            })
                        }
                        return res.status(200).send({response})
                    })
    })
}

exports.getCliente = (req, res, next) => {
    
}

exports.postCliente = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query('INSERT INTO colabs (nome, cidade, bairro, email, telefone) VALUES (?, ?, ?, ?, ?)', [req.body.nome, req.body.cidade, req.body.bairro, req.body.email, req.body.telefone], (error, result1, fields) => {
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            conn.query('INSERT INTO cliente (colabClienteId, cnpj) VALUES (?, ?)', [result1.insertId, req.body.cnpj], (error, result2, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Cliente inserido com sucesso',
                    idColab: result1.insertId,
                    nome: req.body.nome,
                    cidade: req.body.cidade,
                    bairro: req.body.bairro,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    cnpj: req.body.cnpj,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os fornecedores',
                        url: 'http://localhost:3300/clientes/'
                    }
                }
                return res.status(201).send({response})
            })
            
        })
    })
}

exports.updateCliente = (req, res, next) => {
    
}

exports.deleteCliente = (req, res, next) => {
    
}