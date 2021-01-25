const mysql = require('../mysql').pool;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.postFuncionario = (req, res, next) => {
    mysql.getConnection((err, conn) => {
        if(err){
            return res.status(500).send({
                error: error
            })
        }

        conn.query('SELECT * FROM funcionarios WHERE username = ?', [req.body.username], (error, result) => {
            console.log(result)
            console.log(error)
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