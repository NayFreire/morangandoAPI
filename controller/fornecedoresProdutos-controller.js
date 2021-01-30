const mysql = require('../mysql').pool

exports.getPodutosDeFornecedores = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        if(req.body.nomeProduto){
            conn.query(`SELECT 
                        produto.idproduto, produto.nome as nomeProduto, produto.tipo,
                        colabs.nome, colabs.cidade, colabs.bairro, colabs.telefone 
                        FROM produto JOIN fornecedor_tem_produto 
                        ON produto.idproduto = fornecedor_tem_produto.produtoId
                        JOIN colabs
                        ON colabs.idColab = fornecedor_tem_produto.colabFId
                        WHERE produto.nome LIKE "%` + req.body.nomeProduto + `%"`, (error, result0, fields) => {
                // conn.release()
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
    
                if(result0.length == 0){
                    conn.query(`SELECT * FROM produto WHERE nome LIKE "%${req.body.nomeProduto}%"`, (error, resultProduto, fields) =>{
                        if(error){
                            return res.status(500).send({
                                error: error,
                                response: null
                            })
                        }

                        if(resultProduto.length == 0){
                            return res.status(404).send({
                                error: 'Não foi encontrado um produto com esse nome',
                                response: null
                            })
                        }

                        const response = {
                            produtos: resultProduto.map(produto =>{
                                return{
                                    idProduto: produto.idProduto,
                                    nome: fornecedor.nome,
                                    tipo: fornecedor.tipo,
                                    qtdEstoque: fornecedor.qtdEstoque,
                                    fornecedores: resultProduto.length
                                }
                            })
                        }

                        return res.status(200).send(response)
                    })

                    return res.status(404).send({
                        mensagem: "Não foi encontrado produto com esse nome",
                        response: null
                    })
                }
                else{
                    const response = {
                        produtos: {
                            idProduto: result0[0].idProduto,
                            nome: result0[0].nomeProduto,
                            tipo: result0[0].tipo,
                            quantidade: result0[0].qtdEstoque,
                            fornecedores: result0.map(fornecedor =>{
                                return{
                                    idFornecedor: fornecedor.idColab,
                                    nome: fornecedor.nome,
                                    cidade: fornecedor.cidade,
                                    bairro: fornecedor.bairro,
                                    telefone: fornecedor.telefone
                                }
                            })
                        }
                    }
                    return res.status(200).send({response})
    
                }
            })
        }
        else if(req.body.nomeFornecedor){
            conn.query(`SELECT * FROM colabs JOIN fornecedor 
            ON colabs.idColab = fornecedor.colabFornecedorId
            JOIN fornecedor_tem_produto
            ON colabs.idColab = fornecedor_tem_produto.colabFId 
            WHERE nome like "%${req.body.nomeProduto}%"`, (error, result2, fields => {
                conn.release()
                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                if(result2.length == 0){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado fornecedor com esse nome",
                        response: null
                    })
                }
                
                const response = {
                    fornecedor:{
                        idFornecedor: result2[0].idColab,
                        nome: result2[0].nome,
                        cidade: result2[0].cidade,
                        bairro: result2[0].bairro,
                        email: result2[0].email,
                        cpf: result2[0].cpf
                    }
                }

                return res.status(200).send({response})
            }))
        }
        // else if(req.body.nomeProduto && req.body.nomeFornecedor){
        //     conn.query(`SELECT 
        //                 produto.idproduto, produto.nome AS nomeProduto, produto.tipo,
        //                 colabs.nome, colabs.cidade, colabs.bairro, colabs.telefone 
        //                 FROM produto JOIN fornecedor_tem_produto 
        //                 ON produto.idproduto = fornecedor_tem_produto.produtoId
        //                 JOIN colabs
        //                 ON colabs.idColab = fornecedor_tem_produto.colabFId
        //                 WHERE produto.nome LIKE '%${req.body.nomeProduto}%' 
        //                 AND colabs.nome LIKE '%${req.body.nomeFornecedor}%'`, (error, results2, fields) => {
        //                     if(error){
        //                         return res.status(500).send({
        //                             error: error,
        //                             response: null
        //                         })
        //                     }

        //                     if(results2.length == 0){
        //                         return res.status(404).send({
        //                             mensagem: "Não foi encontrado fornecedor ou produto com esse nome",
        //                             response: null
        //                         })
        //                     }

        //                     const response = {
        //                         produtosFornecedores: results2.map( pf => {
        //                             return{
        //                                 idColab: 
        //                             }
        //                         }
        //                         )
        //                     }
        //                 }
        //     )
        // }
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
