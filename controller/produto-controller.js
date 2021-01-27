const mysql = require('../mysql').pool

//RETORNA TODOS OS PRODUTOS
exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        conn.query('SELECT * FROM produto', (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error
                })
            }
            const response = {
                quantidade: result.length,
                produtos: result.map(prod => {
                    console.log(result)
                    return{
                        idProduto: prod.idproduto,
                        nome: prod.nome,
                        tipo: prod.tipo,
                        quantidadeEstoque: prod.qtdEstoque,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3300/produtos/' 
                        }
                    }
                })
            }

            return res.status(200).send({response})
        })
    })
}

//RETORNA UM PRODUTO ESPECÍFICO
exports.getProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM produto WHERE idProduto = ?', [req.params.idProduto], (error, result, fields) => {
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
                produto: {
                    idProduto: result[0].idProduto,
                    nome: result[0].nome,
                    tipo: result[0].tipo,
                    quantidadeEstoque: result[0].qtdEstoque,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna um produto com específico',
                        url: 'http://localhost:3300/produtos/' + result[0].idProduto
                    }
                }
            }

            return res.status(200).send({response})
        })
    })
}

//INSERE PRODUTO
exports.postProdutos = (req, res, next) => {
    console.log(req.usuario) 
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query('INSERT INTO produto (nome, tipo, qtdEstoque) VALUES (?, ?, ?)', [req.body.nome, req.body.tipo, req.body.qtdEstoque], (error, result, fields) => {
            conn.release();

            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            console.log(result)
            const response = {
                mensagem: 'Produto inserido com sucesso',
                produtoCriado: {
                    idProduto: result.insertId,
                    nome: req.body.nome,
                    tipo: req.body.tipo,
                    quantidadeEstoque: req.body.qtdEstoque,
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um novo produto',
                        url: 'http://localhost:3300/produtos'
                    }
                }
            }
            
            return res.status(201).send({response})
        })
    })
}

//ATUALIZA UM PRODUTO
exports.updateProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query('UPDATE produto SET nome = ?, tipo = ?, qtdEstoque = ? WHERE idProduto = ?', [req.body.nome, req.body.tipo, req.body.qtdEstoque, req.body.idProduto], (error, result, fields) => {
            conn.release();

            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            const response = {
                mensagem: 'Produto alterado com sucesso',
                produtoAlterado: {
                    idProduto: req.body.idProduto,
                    nome: req.body.nome,
                    tipo: req.body.tipo,
                    quantidadeEstoque: req.body.qtdEstoque,
                    request: {
                        tipo: 'PATCH',
                        descricao: 'Retorna os dados de um produto alterado',
                        url: 'http://localhost:3300/produtos' + req.body.idProduto
                    }
                }
            }

            return res.status(202).send({response})
        })
    })
}

//DELETA UM PRODUTO
exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query('SELECT * FROM produto WHERE idProduto = ?',[req.body.idProduto], (error, result, fields) => {
            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrado produto com o ID passado"
                })
            }
            else{
                conn.query('DELETE FROM produto WHERE idProduto = ?', [req.body.idProduto], (error, result, fields) => {
                    conn.release();
        
                    if(error){
                        return res.status(500).send({
                            error: error,
                            response: null
                        })
                    }
        
                    const response = {
                        mensagem: "Produto removido com sucesso",
                        request: {
                            tipo: 'DELETE',
                            descricao: "Deleta um produto",
                            url: "http://localhost:3300/produtos",
                            body: {
                                nome: 'String',
                                tipo: 'String',
                                qtdEstoque: 'Number'
                            }
                        }
                    }
        
                    return res.status(202).send(response)
                })
            }
        })

        
    })
}
