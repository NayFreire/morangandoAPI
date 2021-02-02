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
                                        url: 'https://morangandoapi.herokuapp.com/clientes/'
                                    }
                                }
                            })
                        }
                        return res.status(200).send({response})
                    })
    })
}

exports.getCliente = (req, res, next) => {
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
                    ON idColab = colabClienteId
                    AND idColab = ?`, [req.params.idColab], (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrado produto com esse ID"
                })
            }

            const response = {
                mensagem: "Cliente encontrado",
                cliente: {
                        idColab: result[0].idColab,
                        nome: result[0].nome,
                        cidade: result[0].cidade,
                        bairro: result[0].bairro,
                        email: result[0].email,
                        telefone: result[0].telefone,
                        cnpj: result[0].cnpj,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os fornecedores',
                            url: 'https://morangandoapi.herokuapp.com/clientes/' + result[0].idColab
                        }
                }
            }

            return res.status(200).send({response})
        })
    })
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
                        url: 'https://morangandoapi.herokuapp.com/clientes/'
                    }
                }
                return res.status(201).send({response})
            })
            
        })
    })
}

exports.updateCliente = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query('UPDATE colabs SET nome = ?, cidade = ?, bairro = ?, email = ?, telefone = ? WHERE idColab = ? ', [req.body.nome, req.body.cidade, req.body.bairro, req.body.email, req.body.telefone, req.body.idColab], (error, result1, fields) => {
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            console.log(result1)

            conn.query('UPDATE cliente SET cnpj = ? WHERE colabClienteId = ?', [req.body.cnpj, req.body.idColab], (error, result, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Cliente atualizado com sucesso',
                    idColab: req.body.idColab,
                    nome: req.body.nome,
                    cidade: req.body.cidade,
                    bairro: req.body.bairro,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    cpf: req.body.cpf,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna os dados de um fornecedor',
                        url: 'https://morangandoapi.herokuapp.com/clientes/' + req.body.idColab
                    }
                }
                return res.status(201).send({response})
            })
            
        })
    })
}

exports.deleteCliente = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM colabs WHERE idColab = ?', [req.body.idColab], (error, resultBusca, fields) => {
            console.log(resultBusca)
            if(resultBusca.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrado fornecedor com o ID passado"
                })
            }
            else{
                conn.query('DELETE FROM cliente WHERE colabClienteId = ?', [req.body.idColab], (error, result1, fields) => {
                    if(error){
                        return res.status(500).send({
                            error: error,
                            response: null
                        })
                    }
        
                    conn.query('DELETE FROM colabs WHERE idColab = ?', [req.body.idColab], (error, result2, fields) => {
                        conn.release();
        
                        if(error){
                            return res.status(500).send({
                                error: error,
                                response: null
                            })
                        }
        
                        const response = {
                            mensagem: 'Cliente deletado com sucesso',
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os fornecedores',
                                url: 'https://morangandoapi.herokuapp.com/fornecedores/',
                                body: {
                                    nome: 'String',
                                    cidade: 'String',
                                    bairro: 'String',
                                    email: 'String',
                                    telefone: 'Number',
                                    cpf: 'String'
                                }
                            }
                        }
                        return res.status(201).send({response})
                    })
                    
                })
            }
        })
        
        
    })
}