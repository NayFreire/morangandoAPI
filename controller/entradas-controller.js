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
        entrada.dataEntrada, 
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
                                url: 'http://localhost:3300/entradas/'
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
                    entrada.dataEntrada, 
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

        conn.query('INSERT INTO entrada (idProduto, qtdProduto, idFornecedor, dataEntrada) VALUES (?, ?, ?, ?)', [req.body.idProduto, req.body.qtdProduto, req.body.idFornecedor, req.body.dataEntrada], (error, result, fields) => {
            conn.release()
            if(error){
                return res.status(500).send({
                    error: error,
                    response: null
                })
            }

            const response = {
                mensagem: "Entrada cadastrada com sucesso",
                entradaCriada: {
                    idEntrada: result.insertId,
                    idProduto: req.body.idProduto,
                    qtdProduto: req.body.qtdProduto,
                    idFornecedor: req.body.idFornecedor,
                    dataEntrada: req.body.dataEntrada,
                    request: {
                        tipo: 'GET',
                        descricao: 'Retorna todas as entradas',
                        url: 'http://localhost:3300/entradas/'
                    }
                }
            }

            return res.status(200).send({response})
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
                        url: 'http://localhost:3300/entradas/'
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
                        url: "http://localhost:3300/entradas"
                    }
                }

                return res.status(200).send(response)
            })
        })
    })
}