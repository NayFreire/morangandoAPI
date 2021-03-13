const mysql = require('../mysql').pool
const calculoSaida = require('../math/valorSaida')
const valorSaida = require('../math/valorSaida')

exports.getSaidas = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query(`SELECT  
                    saida.idSaida, 
                    saida.qtdProduto, 
                    saida.qtdCorte,
                    saida.valorProduto,
                    saida.valorSaida,
                    DATE_FORMAT(saida.dataSaida, '%d/%m/%Y') AS dataSaida, 
                    colabs.idColab,
                    colabs.nome, 
                    produto.idProduto,
                    produto.nome AS nomeProduto, 
                    produto.tipo 
                    FROM saida INNER JOIN colabs 
                    ON saida.idCliente = colabs.idColab 
                    INNER JOIN produto 
                    ON saida.idProduto = produto.idProduto`, (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não há registro de saídas",
                })
            }
            else{
                const response = {
                    quantidadeRegistros : result.length,
                    saidas : result.map(saida => {
                        return{
                            idSaida: saida.idSaida,
                            idProduto: saida.idProduto,
                            qtdProduto: saida.qtdProduto,
                            qtdCorte: saida.qtdCorte,
                            valorProduto: saida.valorProduto,
                            valorSaida: saida.valorSaida,
                            cliente: {
                                idCliente: saida.idColab,
                                nome: saida.nome
                            },
                            produto:{
                                idProduto: saida.idProduto,
                                nome: saida.nomeProduto,
                                tipo: saida.tipo
                            },
                            dataSaida: saida.dataSaida,
                            request: {
                                tipo: 'GET',
                                descricao: 'Retorna uma saída específica',
                                url: 'https://morangandoapi.herokuapp.com/saidas/' + saida.idSaida
                            }
                        }

                    })
                }

                return res.status(200).send({response})
            }
            
        })
    })
}

exports.getSaida = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query(`SELECT 
                    saida.idSaida, 
                    saida.qtdProduto, 
                    saida.qtdCorte,
                    saida.valorProduto,
                    saida.valorSaida,
                    DATE_FORMAT(saida.dataSaida, '%d/%m/%Y') AS dataSaida, 
                    colabs.idColab,
                    colabs.nome, 
                    produto.idProduto,
                    produto.nome AS nomeProduto, 
                    produto.tipo 
                    FROM saida INNER JOIN colabs 
                    ON saida.idCliente = colabs.idColab 
                    INNER JOIN produto 
                    ON saida.idProduto = produto.idProduto
                    WHERE idSaida = ?`, [req.params.idSaida], (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrada saída com esse ID"
                })
            }
            else{
                const response = {
                    saida: {
                        idSaida: result[0].idSaida,
                        qtdProduto: result[0].qtdProduto,
                        qtdCorte: result[0].qtdCorte,
                        dataSaida: result[0].dataSaida,
                        valorProduto: result[0].valorProduto,
                        valorSaida: result[0].valorSaida,
                        fornecedor: {
                            idCliente: result[0].idColab,
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

exports.postSaida = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM produto WHERE idproduto = ? ', [req.body.idProduto], (error, resultProduto, fields) => {
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(resultProduto == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrado produto com esse ID"
                })
            }

            conn.query('SELECT * FROM cliente JOIN colabs ON idColab = colabClienteId WHERE colabClienteId = ?', [req.body.idCliente], (error, resultCliente, fields) => {
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                if(resultCliente.length == 0){
                    return res.status(404).send({
                        mensagem: "Não foi encontrado cliente com esse ID"
                    })
                }

                conn.query(`SELECT DATE_FORMAT(STR_TO_DATE(?, '%d/%m/%Y'), '%Y-%m-%d') AS dataSaida`, [req.body.dataSaida], (error, resultDate, fields) => {
                    if(error){
                        return res.status(500).send({
                            error: error
                        })
                    }

                    conn.query('INSERT INTO saida (idProduto, qtdProduto, qtdCorte, idCliente, dataSaida, valorSaida, valorProduto) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.idProduto, req.body.qtdProduto, req.body.qtdCorte, req.body.idCliente, resultDate[0].dataSaida, valorSaida.calculaValorSaida(req.body.valorProduto, req.body.qtdProduto, req.body.qtdCorte), req.body.valorProduto], (error, resultInsert, fields) => {
                        // conn.release()
                        if(error){
                            return res.status(500).send({
                                error: error,
                                response: null
                            })
                        }
            
                        let qtdProdutoEstoque = parseInt(resultProduto[0].qtdEstoque) - parseInt(req.body.qtdProduto)
        
                        if(qtdProdutoEstoque < 0){
                            return res.status(400).send({
                                mensagem: "A quantidade de produto que você deseja retirar nessa saída é maior do que a quantidade presente no estoque no momento"
                            })
                        }
    
                        //*CÁLCULO DO VALOR DA SAÍDA DE PRODUTO
    
                        let valorSaida = calculoSaida.calculaValorSaida(req.body.valorProduto, req.body.qtdProduto, req.body.qtdCorte)

                        console.log('*********' + valorSaida + '*********')
    
                        conn.query('UPDATE saida SET valorSaida = ? WHERE idSaida = ?', [valorSaida, resultInsert.insertId], (error, resultValorSaida, fields) => {
                            if(error){
                                return res.status(500).send({
                                    error: error
                                })
                            }
    
                            conn.query('UPDATE produto SET qtdEstoque = ? WHERE idproduto = ?', [qtdProdutoEstoque, req.body.idProduto], (error, result, fields) => {
                                if(error){
                                    return res.status(500).send({
                                        error: error
                                    })
                                }
            
                                const response = {
                                    mensagem: "Saída cadastrada com sucesso",
                                    saidaCriada: {
                                        idSaida: resultInsert.insertId,
                                        idProduto: req.body.idProduto,
                                        qtdProduto: req.body.qtdProduto,
                                        qtdCorte: req.body.qtdCorte,
                                        idFornecedor: req.body.idFornecedor,
                                        dataSaida: req.body.dataSaida,
                                        request: {
                                            tipo: 'GET',
                                            descricao: 'Retorna todas as saidas',
                                            url: 'https://morangandoapi.herokuapp.com/saidas/'
                                        }
                                    }
                                }
                    
                                return res.status(200).send({response})
                            })
                        })
                    })
                })

                
            })
        })
    })
}

exports.updateSaida = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM saida WHERE idSaida = ?', [req.params.idSaida], (error, result, fields) => {
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrada saída com esse ID"
                })
            }

            conn.query('UPDATE saida SET idProduto = ?, qtdProduto = ?, qtdCorte = ?, idCliente = ?, dataSaida = ? WHERE idSaida = ?', [req.body.idProduto, req.body.qtdProduto, req.body.qtdCorte, req.body.idCliente, req.body.dataSaida, req.body.idSaida], (error, result1, fields) => {
                conn.release()
                if(error){
                    return res.status(500).send({
                        error: error
                    })
                }

                const response = {
                    mensagem: "Atualização feita com sucesso",
                    idSaida: req.body.idSaida,
                    idProduto: req.body.idProduto,
                    qtdProduto: req.body.qtdProduto,
                    qtdCorte: req.body.qtdCorte,
                    dataSaida: req.body.dataSaida,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as saídas',
                        url: 'https://morangandoapi.herokuapp.com/saidas/'
                    }
                }

                return res.status(202).send({response})
            })
        })
    })
}

exports.deleteSaida = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM saida WHERE idSaida = ?', [req.body.idSaida], (error, result, fields) => {
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(result.length == 0){
                return res.status(404).send({
                    mensagem: "Não foi encontrada saída com esse ID"
                })
            }
            
            conn.query('DELETE FROM saida WHERE idSaida = ?', [req.body.idSaida], (error, result1, fields) => {
                conn.release()

                if(error){
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }

                const response = {
                    mensagem: "Saída removida com sucesso",
                    request: {
                        tipo: 'GET',
                        descricao: "Retorna todas as saídas cadastradas",
                        url: "https://morangandoapi.herokuapp.com/saidas"
                    }
                }

                return res.status(200).send(response)
            })
        })
    })
}