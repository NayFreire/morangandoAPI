-- -----------------------------------------------------
-- Table `morangando`.`cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`cliente` (
    `colabClienteId` INT(11) NOT NULL,
    `cnpj` VARCHAR(45) NULL DEFAULT NULL,
    PRIMARY KEY (`colabClienteId`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4


-- -----------------------------------------------------
-- Table `morangando`.`colabs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`colabs` (
    `idColab` INT(11) NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NOT NULL,
    `cidade` VARCHAR(40) NULL DEFAULT NULL,
    `bairro` VARCHAR(40) NULL DEFAULT NULL,
    `email` VARCHAR(45) NULL DEFAULT NULL,
    `telefone` INT(11) NULL DEFAULT NULL,
    PRIMARY KEY (`idColab`))
ENGINE = MyISAM
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `morangando`.`entrada`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`entrada` (
    `idEntrada` INT(11) NOT NULL AUTO_INCREMENT,
    `idProduto` INT(11) NOT NULL,
    `qtdProduto` INT(11) NOT NULL,
    `idFornecedor` INT(11) NOT NULL,
    `dataEntrada` DATE NOT NULL,
    PRIMARY KEY (`idEntrada`),
    INDEX `idProduto` (`idProduto` ASC) ,
    INDEX `idFornecedor` (`idFornecedor` ASC) )
ENGINE = MyISAM
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `morangando`.`fornecedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`fornecedor` (
    `colabFornecedorId` INT(11) NOT NULL,
    `cpf` VARCHAR(20) NULL DEFAULT NULL,
    PRIMARY KEY (`colabFornecedorId`))
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `morangando`.`fornecedor_tem_produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`fornecedor_tem_produto` (
    `colabFId` INT(11) NOT NULL,
    `produtoId` INT(11) NOT NULL,
    PRIMARY KEY (`colabFId`, `produtoId`),
    INDEX `produtoId` (`produtoId` ASC) )
ENGINE = MyISAM
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `morangando`.`funcionarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`funcionarios` (
    `idFuncionarios` INT(11) NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(45) NULL DEFAULT NULL,
    `senha` VARCHAR(100) NULL DEFAULT NULL,
    `status` VARCHAR(20) NULL DEFAULT NULL,
    PRIMARY KEY (`idFuncionarios`))
ENGINE = MyISAM
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `morangando`.`produto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`produto` (
    `idProduto` INT(11) NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(50) NULL DEFAULT NULL,
    `tipo` VARCHAR(20) NULL DEFAULT NULL,
    `qtdEstoque` INT(11) NULL DEFAULT NULL,
    PRIMARY KEY (`idProduto`))
ENGINE = MyISAM
AUTO_INCREMENT = 33
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `morangando`.`saida`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `morangando`.`saida` (
    `idSaida` INT(11) NOT NULL AUTO_INCREMENT,
    `idProduto` INT(11) NOT NULL,
    `qtdProduto` INT(11) NOT NULL,
    `qtdCorte` INT(11) NOT NULL,
    `idCliente` INT(11) NOT NULL,
    `dataSaida` DATE NOT NULL,
    PRIMARY KEY (`idSaida`),
    INDEX `idProduto` (`idProduto` ASC) ,
    INDEX `idCliente` (`idCliente` ASC) )
ENGINE = MyISAM
AUTO_INCREMENT = 4
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;