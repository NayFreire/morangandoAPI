exports.calculaValorSaida = (valorProduto, qtdProduto, qtdCorte) => {
    if(valorProduto == 0 || qtdProduto == 0){
        return res.status(400).send({
            mensagem: "Valores têm que ser maior que zero"
        })
    }

    if(qtdCorte > qtdProduto){
        return res.status(400).send({
            mensagem: "A quantidade de corte não pode ser maior do que a quantidade de produtos"
        })
    }

    let valor = valorProduto * (qtdProduto - qtdCorte) 

    return valor
}
