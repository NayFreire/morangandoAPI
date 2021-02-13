const mysql = require('../mysql').pool

exports.getEntradas = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query(`SELECT 
                    entrada.idEntrada, 
                    entrada.qtdProduto, 
                    DATE_FORMAT(dataEntrada, "%d/%m/%Y") AS dataEntrada,
                    colabs.idColab, 
                    colabs.nome, 
                    produto.idProduto, 
                    produto.nome AS nomeProduto, 
                    produto.tipo 
                    FROM entrada INNER JOIN colabs 
                    ON entrada.idFornecedor = colabs.idColab 
                    INNER JOIN produto 
                    ON entrada.idProduto = produto.idProduto`, (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não há registro de entradas",
                })
            }
            else{
                const response = {
                    quantidadeRegistros : result.length,
                    entradas : result.map(entrada => {
                        return{
                            idEntrada: entrada.idEntrada,
                            quantidadeProduto: entrada.qtdProduto,
                            fornecedor: {
                                idFornecedor: entrada.idColab,
                                nome: entrada.nome
                            },
                            produto: {                         
                                idProduto: entrada.idProduto,
                                nome: entrada.nomeProduto,
                                tipo: entrada.tipo
                            },
                            dataEntrada: entrada.dataEntrada,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna todas as entradas',
                                url: 'https://morangandoapi.herokuapp.com/entradas/'
                            }
                        }

                    })
                }

                return res.status(200).send({response})
            }
            
        })
    })
}

exports.getEntrada = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query(`SELECT 
                    entrada.idEntrada, 
                    entrada.qtdProduto, 
                    DATE_FORMAT(dataEntrada, "%d/%m/%Y") AS dataEntrada,
                    colabs.idColab, 
                    colabs.nome, 
                    produto.idProduto, 
                    produto.nome AS nomeProduto, 
                    produto.tipo 
                    FROM entrada INNER JOIN colabs 
                    ON entrada.idFornecedor = colabs.idColab 
                    INNER JOIN produto 
                    ON entrada.idProduto = produto.idProduto
                    WHERE idEntrada = ?`, [req.params.idEntrada], (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrada entrada com esse ID"
                })
            }
            else{
                const response = {
                    entrada: {
                        idEntrada: result[0].idEntrada,
                        qtdProduto: result[0].qtdProduto,
                        dataEntrada: result[0].dataEntrada,
                        fornecedor: {
                            idFornecedor: result[0].idColab,
                            nome: result[0].nome
                        },
                        produto: {
                            idProduto: result[0].idProduto,
                            nome: result[0].nomeProduto,
                            tipo: result[0].tipo
                        }
                    }
                }

                return res.status(200).send({response})
            }
        })
    })
}

exports.postEntrada = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        let dataHoje = new Date()

        let day = dataHoje.getDate()
        let month = dataHoje.getMonth()
        let year = dataHoje.getFullYear()

        let mysqlDate = year + '-' + (month + 1) + '-' + day

        if(!req.body.dataEntrada){
            req.body.dataEntrada = mysqlDate
        }

        conn.query('INSERT INTO entrada (idProduto, qtdProduto, idFornecedor, dataEntrada) VALUES (?, ?, ?, ?)', [req.body.idProduto, req.body.qtdProduto, req.body.idFornecedor, req.body.dataEntrada], (error, resultEntrada, fields) => {
            // conn.release()
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            conn.query('SELECT ADDDATE(? , INTERVAL 7 DAY) AS dataPagamento', [req.body.dataEntrada], (error, resultDate, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                conn.query('INSERT INTO pagFornecedor (idEntrada, idFornecedor, valor, dataPagamento, statusPag) VALUES (?, ?, ?, ?, ?)', [resultEntrada.insertId, req.body.idFornecedor, 0, resultDate[0].dataPagamento, 'não pago'], (error, resultPag, fields) => {
                    // conn.release()
    
                    if(error){
                        return res.status(500).send({
                            error: error
                        })
                    }

                    conn.query('SELECT qtdEstoque FROM produto WHERE idproduto = ?', [req.body.idProduto], (error, resultProduto, fields) => {
                        if(error){
                            return res.status(500).send({
                                error: error
                            })
                        }

                        if(resultProduto.length == 0){
                            return res.status(404).send({
                                mensagem: "Não foi encontrado produto com esse ID"
                            })
                        }

                        let qtdProdutoEstoque = parseInt(resultProduto[0].qtdEstoque) + parseInt(req.body.qtdProduto)

                        conn.query('UPDATE produto SET qtdEstoque = ? WHERE idproduto = ?', [qtdProdutoEstoque, req.body.idProduto], (error, result, fields) => {
                            conn.release()

                            if(error){
                                return res.status(500).send({
                                    error: error
                                })
                            }

                            const response = {
                                mensagem: "Entrada cadastrada com sucesso",
                                entradaCriada: {
                                    idPagamento: resultPag.insertId,
                                    idEntrada: resultEntrada.insertId,
                                    idProduto: req.body.idProduto,
                                    qtdProduto: req.body.qtdProduto,
                                    idFornecedor: req.body.idFornecedor,
                                    dataEntrada: req.body.dataEntrada,
                                    request: {
                                        tipo: 'GET',
                                        descricao: 'Retorna todas as entradas',
                                        url: 'https://morangandoapi.herokuapp.com/entradas/'
                                    }
                                },
                                pagamentoCriado: {
                                    idPagamento: resultPag.insertId,
                                    idEntrada: resultEntrada.insertId,
                                    idFornecedor: req.body.idFornecedor
                                }
                            }
                
                            return res.status(200).send({response})
                        })
                    })
    
                    
                }) 
            })
        })
    })
}

exports.updateEntrada = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM entrada WHERE idEntrada = ?', [req.params.idEntrada], (error, result, fields) => {
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrada entrada com esse ID"
                })
            }

            conn.query('UPDATE entrada SET idProduto = ?, qtdProduto = ?, idFornecedor = ?, dataEntrada = ? WHERE idEntrada = ?', [req.body.idProduto, req.body.qtdProduto, req.body.idFornecedor, req.body.dataEntrada, req.body.idEntrada], (error, result1, fields) => {
                conn.release()
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                const response = {
                    mensagem: "Atualização feita com sucesso",
                    idEntrada: req.body.idEntrada,
                    idProduto: req.body.idProduto,
                    qtdProduto: req.body.qtdProduto,
                    dataEntrada: req.body.dataEntrada,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as entradas',
                        url: 'https://morangandoapi.herokuapp.com/entradas/'
                    }
                }

                return res.status(202).send({response})
            })
        })
    })
}

exports.deleteEntrada = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM entrada WHERE idEntrada = ?', [req.body.idEntrada], (error, result, fields) => {
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrada entrada com esse ID"
                })
            }
            
            conn.query('DELETE FROM entrada WHERE idEntrada = ?', [req.body.idEntrada], (error, result1, fields) => {
                conn.release()

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: "Entrada removida com sucesso",
                    request: {
                        tipo: 'GET',
                        descricao: "Retorna todas as entradas cadastradas",
                        url: "https://morangandoapi.herokuapp.com/entradas"
                    }
                }

                return res.status(200).send(response)
            })
        })
    })
}