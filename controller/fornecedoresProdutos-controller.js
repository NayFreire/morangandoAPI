const mysql = require('../mysql').pool

exports.getPodutosDeFornecedores = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM produto WHERE nome  like "%' + req.body.nomeProduto + '%"', (error, result, fields) => {
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrado produto com esse nome",
                    response: null
                })
            }
            else{
                const response = {
                    produtos: result.map(produto => {
                        return{
                            idProduto: produto.idProduto,
                            nome: produto.nome,
                            tipo: produto.tipo,
                            quantidade: produto.qtdEstoque
                        }
                    })
                }
                return res.status(200).send({response})

            }
        })
    })
}

exports.postProdutoDeFornecedor = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }
        
        conn.query('INSERT INTO fornecedor_tem_produto (colabFId, produtoId) VALUES (?, ?)', [req.body.idColab, req.body.idProduto], (error, result, fields) => {
            
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
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
                        AND idColab = ?`, [req.body.idColab], (error, result1, fields) => {
                            if(error){
                                return res.status(500).send({
                                    error: error,
                                    response: null
                                })
                            }

                            if(result1.length == 0){
                                return res.status(404).send({
                                    mensagem: "Fornecedor não foi encontrado"
                                })
                            }
                            else{
                                conn.query('SELECT * FROM produto WHERE idProduto = ?', [req.body.idProduto], (error, result2, fields) => {
                                    conn.release()
                                    if(error){
                                        return res.status(500).send({
                                            error: error,
                                            response: null
                                        })
                                    }

                                    if(result2.length == 0){
                                        return res.status(404).send({
                                            mensagem: "Produto não foi encontrado"
                                        })
                                    }
                                    else{
                                        const response = {
                                            mensagem: 'Fornecedor fornece um novo produto',
                                            idColab: req.body.idColab,
                                            nome: result1[0].nome,
                                            cidade: result1[0].cidade,
                                            bairro: result1[0].bairro,
                                            email: result1[0].email,
                                            telefone: result1[0].telefone,
                                            cpf: result1[0].cpf,
                                            produto: {
                                                idProduto: req.body.idProduto,
                                                nome: result2[0].nome,
                                                tipo: result2[0].tipo
                                            }
                                        }
                                        return res.status(201).send({response})
                                    }
                    
                                    
                                })
                            }

                            
                        })
            
        })
    })
}
