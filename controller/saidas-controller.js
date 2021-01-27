const mysql = require('../mysql').pool

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
        saida.dataSaida, 
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
                            qtdProtudo: saida.qtdProduto,
                            qtdCorte: saida.qtdCorte,
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
                                url: 'http://localhost:3300/saidas/' + saida.idSaida
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
                    saida.dataSaida, 
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

        conn.query('INSERT INTO saida (idProduto, qtdProduto, qtdCorte, idCliente, dataSaida) VALUES (?, ?, ?, ?, ?)', [req.body.idProduto, req.body.qtdProduto, req.body.qtdCorte, req.body.idCliente, req.body.dataSaida], (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            const response = {
                mensagem: "Saída cadastrada com sucesso",
                saidaCriada: {
                    idSaida: result.insertId,
                    idProduto: req.body.idProduto,
                    qtdProduto: req.body.qtdProduto,
                    qtdCorte: req.body.qtdCorte,
                    idFornecedor: req.body.idFornecedor,
                    dataSaida: req.body.dataSaida,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as saidas',
                        url: 'http://localhost:3300/saidas/'
                    }
                }
            }

            return res.status(200).send({response})
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
                        url: 'http://localhost:3300/saidas/'
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
                        url: "http://localhost:3300/saidas"
                    }
                }

                return res.status(200).send(response)
            })
        })
    })
}