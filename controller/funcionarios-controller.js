const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

exports.postFuncionario = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM funcionarios WHERE username = ?', [req.body.username], (error, result, fields) => {
            console.log(result)
            console.log('error: ' + error)
            if(error){
                return res.status(500).send({
                    error: error
                })
            }
            
            if(result.length > 0){
                
                return res.status(409).send({
                    mensagem: "Já existe um cadastro de funcionário com esse nome de usuário"
                })
            }
            else{
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt){
                        return res.status(500).send({
                            error: errBcrypt
                        })
                    }

                    conn.query('INSERT INTO funcionarios (username, senha, status) VALUES (?, ?, ?)', [req.body.username, hash, req.body.status], (error, result) => {
                        conn.release()

                        if(error){
                            return res.status(500).send({
                                error: error
                            })
                        }

                        const response = {
                            mensagem: "Funcionário cadastrado com sucesso",
                            funcionario: {
                                idFuncionario: result.insertId,
                                username: req.body.username,
                                status: req.body.status
                            }
                        }

                        return res.status(201).send(response)
                    })
                })
            }
        })
    })
}

exports.loginFuncionario = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM funcionarios WHERE username = ?', [req.body.username], (error, resultBusca, fields) => {
            conn.release();
            
            if(error){
                return res.status(500).send({
                    error: error
                })
            }

            if(resultBusca.length < 1){
                return res.status(401).send({
                    mensagem: "Falha na autenticação: erro no user name"
                })
            }

            bcrypt.compare(req.body.senha, resultBusca[0].senha, (err, result) => {
                if(err){
                    return res.status(401).send({
                        mensagem: "Falha na autenticação: erro"
                    })
                }
                // console.log(resultBusca)
                // console.log(result)
                // console.log(req.body.senha)
                if(result){
                    const token = jwt.sign({
                        idFuncionario: resultBusca[0].idFuncionarios,
                        username: resultBusca[0].username,
                        status: resultBusca[0].status
                    }, process.env.JWT_KEY, 
                    {
                        expiresIn: "1h"
                    })
                    return res.status(200).send({
                        mensagem: "Autenticado com sucesso",
                        username: resultBusca[0].username,
                        token: token
                    })
                }

                return res.status(401).send({
                    mensagem: "Falha na autenticação"
                })
            })
        })
    })
}