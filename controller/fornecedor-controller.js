const mysql = require('../mysql').pool

//RETORNA TODOS OS FORNECEDORES
exports.getFornecedores = (req, res, next) => {
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
                    fornecedor.cpf 
                    FROM colabs INNER JOIN fornecedor 
                    ON idColab = colabFornecedorId`, (error, result, fields) => {
                        conn.release()
                        if(error){
                            return res.status(500).send({
                                error: error
                            })
                        }

                        const response = {
                            quantidadeRegistros: result.length,
                            fornecedores: result.map(fornecedor => {
                                return{
                                    idColab: fornecedor.idColab,
                                    nome: fornecedor.nome,
                                    cidade: fornecedor.cidade,
                                    bairro: fornecedor.bairro,
                                    email: fornecedor.email,
                                    telefone: fornecedor.telefone,
                                    cpf: fornecedor.cpf,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna todos os fornecedores',
                                        url: 'http://localhost:3300/fornecedores/'
                                    }
                                }
                            })
                        }
                        return res.status(200).send({response})
                    })
    })
}

//RETORNA UM FORNECEDOR ESPECÍFICO
exports.getFornecedor = (req, res, next) => {
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
                    fornecedor.cpf 
                    FROM colabs INNER JOIN fornecedor 
                    ON idColab = colabFornecedorId
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
                quantidadeRegistros: result.length,
                fornecedores: result.map(fornecedor => {
                    return{
                        idColab: fornecedor.idColab,
                        nome: fornecedor.nome,
                        cidade: fornecedor.cidade,
                        bairro: fornecedor.bairro,
                        email: fornecedor.email,
                        telefone: fornecedor.telefone,
                        cpf: fornecedor.cpf,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os fornecedores',
                            url: 'http://localhost:3300/fornecedores/' + fornecedor.idColab
                        }
                    }
                })
            }

            return res.status(200).send({response})
        })
    })
}

//INSERE FORNECEDOR
exports.postFornecedor = (req, res, next) => {
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

            conn.query('INSERT INTO fornecedor (colabFornecedorId, cpf) VALUES (?, ?)', [result1.insertId, req.body.cpf], (error, result2, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Fornecedor inserido com sucesso',
                    idColab: result1.insertId,
                    nome: req.body.nome,
                    cidade: req.body.cidade,
                    bairro: req.body.bairro,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    cpf: req.body.cpf,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todos os fornecedores',
                        url: 'http://localhost:3300/fornecedores/'
                    }
                }
                return res.status(201).send({response})
            })
            
        })
    })
}

//ATUALIZA FORNECEDOR
exports.patchFornecedor = (req, res, next) => {
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

            conn.query('UPDATE fornecedor SET cpf = ? WHERE colabFornecedorId = ?', [req.body.cpf, req.body.idColab], (error, result, fields) => {
                conn.release();

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: 'Fornecedor atualizado com sucesso',
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
                        url: 'http://localhost:3300/fornecedores/' + req.body.idColab
                    }
                }
                return res.status(201).send({response})
            })
            
        })
    })
}

//DELETA FORNECEDOR
exports.deleteFornecedor = (req, res, next) => {
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
                conn.query('DELETE FROM colabs WHERE idColab = ?', [req.body.idColab], (error, result1, fields) => {
                    if(error){
                        return res.status(500).send({
                            error: error,
                            response: null
                        })
                    }
        
                    conn.query('DELETE FROM fornecedor WHERE colabFornecedorId = ?', [req.body.idColab], (error, result2, fields) => {
                        conn.release();
        
                        if(error){
                            return res.status(500).send({
                                error: error,
                                response: null
                            })
                        }
        
                        const response = {
                            mensagem: 'Fornecedor deletado com sucesso',
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todos os fornecedores',
                                url: 'http://localhost:3300/fornecedores/',
                                body: {
                                    nome: 'String',
                                    cidade: 'String',
                                    bairro: 'String',
                                    email: 'String',
                                    telefone: 'Number',
                                    cpf: "String"
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
