const mysql = require('../mysql').pool

//RETORNA TODOS OS PAGAMENTOS
exports.getPagamentos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM pagFornecedor', (error, result1, fields) => {
            // conn.release()

            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result1.length == 0){
                return res.status(404).send({
                    mensagem: "Não há registro de pagamentos"
                })
            }

            conn.query('SELECT * FROM ENTRADA WHERE idEntrada = ?', [result1[0].idEntrada], (error, result2, fields) => {

                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                conn.query('SELECT nome, cidade, bairro FROM colabs JOIN fornecedor ON idColab = colabFornecedorId WHERE idColab = ?', [result2[0].idFornecedor], (error, result3, fields) => {
                    if(error){
                        return res.status(500).send({
                            error: error
                        })
                    }

                    conn.query('SELECT * FROM produto WHERE idproduto = ?', [result2[0].idProduto], (error, result4, fields) => {
                        conn.release()

                        if(error){
                            return res.status(500).send({
                                error: error
                            })
                        }

                        if(result4.length == 0){
                            return res.status(404).send({
                                mensagem: "Não foi encontrado produto com esse ID"
                            })
                        }

                        const response = {
                            quantidade: result1.length,
                            pagamentos : result1.map(pag => {
                                return{
                                    idPagamento: pag.idPagamento,
                                    entrada: {
                                        idEntrada: result2[0].idEntrada,
                                        fornecedor: {
                                            nome: result3[0].nome,
                                            cidade: result3[0].cidade,
                                            bairro: result3[0].bairro
                                        },
                                        produto: {
                                            idProduto: result4[0].idProduto,
                                            nome: result4[0].nome,
                                            tipo: result4[0].tipo
                                        },
                                        qtdProduto: result2[0].qtdProduto,
                                        dataEntrada: result2[0].dataEntrada
                                    },
                                    valor: pag.valor,
                                    dataPagamento: pag.dataPagamento,
                                    status: pag.statusPag,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna um pagamento',
                                        url: 'https://morangandoapi.herokuapp.com/produtos/' + pag.idPagamento
                                    }
                                }
                            })
                        }

                        return res.status(200).send(response)
                    })
                })
            })
        })
    })
}

//RETORNA UM PAGAMENTO
exports.getPagamento = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM pagFornecedor WHERE idPagamento = ?', [req.params.idPagamento], (error, result1, fields) => {

            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result1.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrado um pagamento com esse ID"
                })
            }
            else{
                conn.query('SELECT * FROM entrada WHERE idEntrada = ?', [result1[0].idEntrada], (error, result2, fields) => {

                    if(error){
                        return res.status(500).send({
                            error: error
                        })
                    }
    
                    conn.query('SELECT nome, cidade, bairro FROM colabs JOIN fornecedor ON idColab = colabFornecedorId WHERE idColab = ?', [result2[0].idFornecedor], (error, result3, fields) => {
                        if(error){
                            return res.status(500).send({
                                error: error
                            })
                        }
    
                        conn.query('SELECT * FROM produto WHERE idProduto = ?', [result1[0].idProduto], (error, result4, fields) => {
                            conn.release()
    
                            if(error){
                                return res.status(500).send({
                                    error: error
                                })
                            }
    
                            const response = {
                                pagamento: {
                                    idPagamento: pag.idPagamento,
                                    entrada: {
                                        idEntrada: result2[0].idEntrada,
                                        fornecedor: {
                                            nome: result3[0].nome,
                                            cidade: result3[0].cidade,
                                            bairro: result3[0].bairro
                                        },
                                        produto: {
                                            idProduto: result4[0].idproduto,
                                            nome: result4[0].nome,
                                            tipo: result4[0].tipo
                                        },
                                        qtdProduto: result2[0].qtdProduto,
                                        dataEntrada: result2[0].dataEntrada
                                    },
                                    valor: pag.valor,
                                    dataPagamento: pag.dataPagamento,
                                    status: pag.statusPag,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna um pagamento',
                                        url: 'https://morangandoapi.herokuapp.com/produtos/' + pag.idPagamento
                                    }
                                }
                            }
    
                            return res.status(200).send(response)
                        })
                    })
                })
            }

        })
    })
}

