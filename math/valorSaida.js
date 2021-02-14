exports.calculaValorSaida = (valorProduto, qtdProduto, qtdCorte) => {
    if(valorProduto == 0 || qtdProduto == 0){
        return res.status(400).send({
            mensagem: "Valores têm que ser maior que zero"
        })
    }

    if(!qtdCorte){
        qtdCorte = 0
    }

    let valor = valorProduto * (qtdProduto - qtdCorte) 

    return valor
}
