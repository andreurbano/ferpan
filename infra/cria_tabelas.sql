/* Cria tabela usuarios e insere alguns registros */
CREATE TABLE usuarios (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  email VARCHAR(50) NOT NULL,
  username VARCHAR(50) NOT NULL,
  pass VARCHAR(12) NOT NULL
);
INSERT INTO usuarios(id, nome, email, username, pass) VALUES(0, 'Andre Urbano', 'ti@ferpan.com.br', 'andre', '123456');
INSERT INTO usuarios(id, nome, email, username, pass) VALUES(0, 'Andrea Cristina', 'andrea@ferpan.com.br', 'andrea', '123456');
INSERT INTO usuarios(id, nome, email, username, pass) VALUES(0, 'Rosana Ácacio', 'rosana@ferpan.com.br', 'rosana', '123456');
INSERT INTO usuarios(id, nome, email, username, pass) VALUES(0, 'José Gomes Coelho', 'jose@ferpan.com.br', 'jose', '123456');
INSERT INTO usuarios(id, nome, email, username, pass) VALUES(0, 'Leonardo Pereira', 'leonardo@ferpan.com.br', 'leonardo', '123456');
INSERT INTO usuarios(id, nome, email, username, pass) VALUES(0, 'Eduardo Coelho', 'eduardo@ferpan.com.br', 'eduardo', '123456');

/* Cria tabela Entradas e Saídas */
CREATE TABLE entradasesaidas (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  dt_emissao DATE NOT NULL,
  nf_serie INT(5) NOT NULL,
  nf_num INT(11) NOT NULL,
  id_fornecedor INT(11) NOT NULL,
  id_produto INT(11) NOT NULL,
  qtde DECIMAL(11,2) NOT NULL,+
  valor DECIMAL(11,2) NOT NULL,
  tipo INT(1) NOT NULL
);



/* Cria Store Procedure stExtratoEstoque*/ 
/*
DROP PROCEDURE ExtratoEstoque;

DELIMITER $$
CREATE PROCEDURE ExtratoEstoque(IN idProd INT)
BEGIN
	
  SET @saldo_qtde  := (SELECT p.saldo_ini_qtde FROM produtos p WHERE p.id = idProd);
  SET @saldo_valor := (SELECT p.saldo_ini_valor FROM produtos p WHERE p.id = idProd);
  SET @preco_medio := (SELECT p.saldo_ini_preco_medio FROM produtos p WHERE p.id = idProd);

  SELECT  e.id,
          e.dt_emissao, 
          e.nf_serie, 
          e.nf_num, 
          e.id_fornecedor,
          e.id_produto,
          e.qtde, 
          e.valor, 
          e.tipo, 
          f.razao_social AS fornecedor, 
          p.descricao AS produto, 
          IF(e.tipo = 1, "Entrada", "Saída") AS tipoentsai,
          @saldo_qtde := @saldo_qtde + IF(e.tipo = 1, e.qtde, e.qtde*-1) as saldo_qtde,
          @saldo_valor := @saldo_valor + IF(e.tipo = 1, e.valor, e.valor*-1) as saldo_valor,
          @preco_medio := ROUND((@saldo_valor / @saldo_qtde),2) as preco_medio
  FROM    entradasesaidas e LEFT JOIN fornecedores f ON (e.id_fornecedor = f.id ) 
                            LEFT JOIN produtos p ON (e.id_produto = p.id )
  WHERE    (e.id_produto = idProd)
  ORDER BY e.dt_emissao, e.id;

END $$
DELIMITER ;

CALL ExtratoEstoque(1);
*/


DROP PROCEDURE ExtratoEstoque;

DELIMITER $$
CREATE PROCEDURE ExtratoEstoque(IN idProd INT)
BEGIN
	
  SET @saldo_qtde  := (SELECT p.saldo_ini_qtde FROM produtos p WHERE p.id = idProd);
  SET @saldo_valor := (SELECT p.saldo_ini_valor FROM produtos p WHERE p.id = idProd);
  SET @preco_medio := (SELECT p.saldo_ini_preco_medio FROM produtos p WHERE p.id = idProd);

  SELECT  e.id,
          e.dt_emissao, 
          e.nf_serie, 
          e.nf_num, 
          e.id_fornecedor,
          e.id_produto,
          e.qtde,
          /*IF(e.tipo = 1, e.valor, e.valor*-1) as qtde,*/
          e.valor, 
          e.tipo, 
          f.razao_social AS fornecedor, 
          IF(e.tipo = 1, "Entrada", "Saída") AS tipoentsai,
          @saldo_qtde := @saldo_qtde + IF(e.tipo = 1, e.qtde, e.qtde*-1) as saldo_qtde,
          @saldo_valor := @saldo_valor + IF(e.tipo = 1, e.valor, e.valor*-1) as saldo_valor,
          @preco_medio := ROUND((@saldo_valor / @saldo_qtde),2) as preco_medio
  FROM    entradasesaidas e LEFT JOIN fornecedores f ON (e.id_fornecedor = f.id ) 
                            LEFT JOIN produtos p ON (e.id_produto = p.id )
  WHERE    (e.id_produto = idProd)
  ORDER BY e.dt_emissao, e.id;

END $$
DELIMITER ;

CALL ExtratoEstoque(1);






/*  efetuando a consulta */
$result = mysql_query("SELECT 
	data,
	historico,
	deb_cred,
	valor,
	@saldo := @saldo + IF(deb_cred='D',valor*-1,valor) as saldo
FROM tb_cad_caixa
ORDER BY  id");



/* Cria tabela fornecedores */
CREATE TABLE fornecedores (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  razao_social VARCHAR(50) NOT NULL,
  cnpj VARCHAR(50) NOT NULL,
  email VARCHAR(50),
  id_ramoatividade INT(11) NOT NULL,
  id_tipofornecedor INT(11) NOT NULL,
  end_logradouro VARCHAR(50) NOT NULL, 
  end_numero INT(11),
  end_complemento VARCHAR(50),
  end_cep VARCHAR(8) NOT NULL,
  end_uf VARCHAR(2) NOT NULL,
  end_municipio VARCHAR(50) NOT NULL
);
INSERT INTO fornecedores(id, razao_social, cnpj, email, id_ramoatividade, id_tipofornecedor, end_logradouro, end_numero, end_complemento, end_cep, end_uf, end_municipio) VALUES (0, 'Petróleo Brasileiro S.A', '33000167105558', 'contato@petrobras.com.br', 1, 1, 'Rod. Amaral Peixoto - Km 177', 11000, 'Imboassíca', '27973030', 'RJ', 'Macaé');
INSERT INTO fornecedores(id, razao_social, cnpj, email, id_ramoatividade, id_tipofornecedor, end_logradouro, end_numero, end_complemento, end_cep, end_uf, end_municipio) VALUES (0, 'Gerdau Aços Longos S.A', '07358761000169', 'contato@gerdau.com.br', 1, 1, 'Av João XXIII', 6777, 'Distrito Industrial de Santa Cruz', '23560900', 'RJ', 'Rio de Janeiro');

/* Cria tabela ramo de atividades dos fornecedores */
CREATE TABLE ramosdeatividades (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(50) NOT NULL
);
INSERT INTO ramosdeatividades(id, descricao) VALUES (0, 'Comérrcio');
INSERT INTO ramosdeatividades(id, descricao) VALUES (0, 'Indústria');
INSERT INTO ramosdeatividades(id, descricao) VALUES (0, 'Serviços');

/* Cria tabela tipos de fornecedores */
CREATE TABLE tiposdefornecedores (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(50) NOT NULL
);
INSERT INTO tiposdefornecedores(id, descricao) VALUES (0, 'Gerador');
INSERT INTO tiposdefornecedores(id, descricao) VALUES (0, 'Transportador');
INSERT INTO tiposdefornecedores(id, descricao) VALUES (0, 'Receptor');
INSERT INTO tiposdefornecedores(id, descricao) VALUES (0, 'Fornecedor');
INSERT INTO tiposdefornecedores(id, descricao) VALUES (0, 'Cliente');

/* Cria tabela produtos */
CREATE TABLE produtos (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(50) NOT NULL,
  id_tipoproduto INT(11) NOT NULL,
  id_unidademedida INT(11) NOT NULL,
  saldo_ini_dt DATE NOT NULL,
  saldo_ini_qtde DECIMAL(11,2) NOT NULL,
  saldo_ini_valor DECIMAL(11,2) NOT NULL,
  saldo_ini_preco_medio DECIMAL(11,2) NOT NULL,
  saldo_atu_dt DATE NOT NULL,
  saldo_atu_qtde DECIMAL(11,2) NOT NULL,
  saldo_atu_valor DECIMAL(11,2) NOT NULL,
  saldo_atu_preco_medio DECIMAL(11,2) NOT NULL
);

/*
SELECT p.descricao, p.saldo_atu_dt, p.saldo_atu_qtde, u.Sigla, p.saldo_atu_valor 
FROM   produtos p, unidadesdemedidas u
WHERE  (p.id_unidademedida = u.id);

SELECT p.descricao, p.id_tipoproduto, p.id_unidademedida, p.saldo_ini_dt, p.saldo_ini_qtde, p.saldo_ini_valor, p.saldo_atu_dt, p.saldo_atu_qtde, p.saldo_atu_valor FROM produtos p;
*/

INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sucata Ferrosa', 1, 1, '2018-03-29', 1744863, 1099263.69, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sucata Tubos de Ferro', 1, 1, '2018-03-29', 1593576, 892402.56, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sucata Cabos de Cobre', 1, 1, '2018-03-29', 29747, 18145.67, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Guindaste e Acessórios', 1, 1, '2018-03-29', 10810, 5080.70, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Materiais Diversos Lote 143', 1, 1, '2018-03-29', 10517, 9780.81, 0.00, '2018-04-30', 0.00, 0.00, 0.00);

INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Tarugo de Ferro Fundido', 1, 1, '2018-03-29', 15, 750.00, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Vigas/Cantoneiras/Estruturas', 1, 1, '2018-03-29', 8535, 7254.75, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Conexões/Flanges de Aço', 1, 1, '2018-03-29', 3348, 2176.20, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Rolos de Corda', 1, 1, '2018-03-29', 3060, 550.80, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Dobradiças', 1, 1, '2018-03-29', 3070, 3254.20, 0.00, '2018-04-30', 0.00, 0.00, 0.00);

INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Amarras de Nylon', 1, 1, '2018-03-29', 2695, 1293.60, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Eixo de Ferro', 1, 1, '2018-03-29', 800, 800, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sistemas de Cabeça de Poço Submarino', 1, 1, '2018-03-29', 39000, 18518.52, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Material de Calderaria Mecânica', 1, 1, '2018-03-29', 27570, 11855.10, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Itens p/ Gravel Pack', 1, 1, '2018-03-29', 6000, 3333.33, 0.00, '2018-04-30', 0.00, 0.00, 0.00);

INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Acessórios de Tubulação', 1, 1, '2018-03-29', 11000, 7901.24, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Separadores de Tubos', 1, 1, '2018-03-29', 84390, 25317.00, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Flutuadores p/ Linha Flexível', 1, 1, '2018-03-29', 2000, 2271.60, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Mandibula p/ Chave', 1, 1, '2018-03-29', 1430, 7943.65, 0.00, '2018-04-30', 0.00, 0.00, 0.00);

INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Funil Bajate', 1, 1, '2018-03-29', 18000, 3703.70, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Funil SCP', 1, 1, '2018-03-29', 32500, 9938.28, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Chapa de Aço', 1, 1, '2018-03-29', 10000, 21375.00, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sucata Amarras de Ferro', 1, 1, '2018-03-29', 185500, 85330.00, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sucata Alumínio', 1, 1, '2018-03-29', 451610, 1330172.09, 0.00, '2018-04-30', 0.00, 0.00, 0.00);
INSERT INTO produtos(id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio) VALUES (0, 'Sucata Bronze', 1, 1, '2018-03-29', 15380, 141957.40, 0.00, '2018-04-30', 0.00, 0.00, 0.00);

/* Cria tabela tipos de produtos */
CREATE TABLE tiposdeprodutos (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  descricao VARCHAR(50) NOT NULL
);
INSERT INTO tiposdeprodutos(id, descricao) VALUES (0, 'Contabiliza no Estoque');


/* Cria tabela Unidades de Medidas dos produtos */
CREATE TABLE unidadesdemedidas (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  sigla VARCHAR(5) NOT NULL,
  descricao VARCHAR(50) NOT NULL
);
INSERT INTO unidadesdemedidas(id, sigla, descricao) VALUES (0, 'Kg', 'Kilograma');



/* Cria tabela ufs */
CREATE TABLE ufs (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  sigla VARCHAR(2) NOT NULL,
  nome VARCHAR(50)
);
INSERT INTO ufs (id, sigla, nome) VALUES (0, "AC", "Acre");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "AL", "Alagoas");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "AM", "Amazonas");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "AP", "Amapá");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "BA", "Bahia");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "CE", "Ceará");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "DF", "Distrito Federal");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "ES", "Espírito Santo");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "GO", "Goiás");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "MA", "Maranhão");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "MG", "Minas Gerais");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "MS", "Mato Grosso do Sul");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "MT", "Mato Grosso");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "PA", "Pará");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "PB", "Paraíba");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "PE", "Pernambuco");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "PI", "Piauí");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "PR", "Paraná");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "RJ", "Rio de Janeiro");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "RN", "Rio Grande do Norte");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "RO", "Rondônia");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "RR", "Roraima");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "RS", "Rio Grande do Sul");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "SC", "Santa Catarina");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "SE", "Sergipe");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "SP", "São Paulo");
INSERT INTO ufs (id, sigla, nome) VALUES (0, "TO", "Tocantis");

/* Cria tabela municipios */
CREATE TABLE municipios (
  id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  uf VARCHAR(2) NOT NULL,
  nome VARCHAR(50) NOT NULL,
  codIBGE VARCHAR(8) NOT NULL
);
/* ACRE */
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'ACRELÂNDIA', '12-00013');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'ASSIS BRASIL', '12-00054');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'BRASILEIA', '12-00104');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'BUJARI', '12-00138');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'CAPIXABA', '12-00179');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'CRUZEIRO DO SUL', '12-00203');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'EPITACIOLÂNDIA', '12-00252');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'FEIJÓ', '12-00302');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'JORDÃO', '12-00328');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'MÂNCIO LIMA', '12-00336');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'MANOEL URBANO', '12-00344');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'MARECHAL THAUMATURGO', '12-00351');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'PLÁCIDO DE CASTRO', '12-00385');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'PORTO ACRE', '12-00807');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'PORTO WALTER', '12-00393');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'RIO BRANCO', '12-00401');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'RODRIGUES ALVES', '12-00427');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'SANTA ROSA DO PURUS', '12-00435');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'SENADOR GUIOMARD', '12-00450');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'SENA MADUREIRA', '12-00500');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'TARAUACÁ', '12-00609');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'AC', 'XAPURI', '12-00708');
/* RIO DE JANEIRO */
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ANGRA DOS REIS', '33-00100');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'APERIBE', '33-00159');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ARARUAMA', '33-00209');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'AREAL', '33-00225');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ARMACAO DOS BUZIOS', '33-00233');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ARRAIAL DO CABO', '33-00258');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'BARRA DO PIRAI', '33-00308');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'BARRA MANSA', '33-00407');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'BELFORD ROXO', '33-00456');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'BOM JARDIM', '33-00506');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'BOM JESUS DO ITABAPOANA', '33-00605');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CABO FRIO', '33-00704');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CACHOEIRAS DE MACACU', '33-00803');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CAMBUCI', '33-00902');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CARAPEBUS', '33-00936');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CAMPOS DOS GOYTACAZES', '33-01009');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'COMENDADOR LEVY GASPARIAN', '33-00951');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CANTAGALO', '33-01108');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CARDOSO MOREIRA', '33-01157');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CARMO', '33-01207');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CASIMIRO DE ABREU', '33-01306');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CONCEICAO DE MACABU', '33-01405');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'CORDEIRO', '33-01504');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'DUAS BARRAS', '33-01603');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'DUQUE DE CAXIAS', '33-01702');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ENGENHEIRO PAULO DE FRONTIN', '33-01801');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'GUAPIMIRIM', '33-01850');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'IGUABA GRANDE', '33-01876');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ITABORAI', '33-01900');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ITAGUAI', '33-02007');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ITALVA', '33-02056');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ITAOCARA', '33-02106');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ITAPERUNA', '33-02205');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'ITATIAIA', '33-02254');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'JAPERI', '33-02270');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'LAJE DO MURIAE', '33-02304');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MACAE', '33-02403');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MACUCO', '33-02452');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MAGE', '33-02502');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MANGARATIBA', '33-02601');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MARICA', '33-02700');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MENDES', '33-02809');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MESQUITA', '33-02858');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MIGUEL PEREIRA', '33-02908');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'MIRACEMA', '33-03005');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'NATIVIDADE', '33-03104');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'NILOPOLIS', '33-03203');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'NITEROI', '33-03302');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'NOVA FRIBURGO', '33-03401');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'NOVA IGUACU', '33-03500');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PARACAMBI', '33-03609');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PARAIBA DO SUL', '33-03708');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PARATI', '33-03807');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PATY DO ALFERES', '33-03856');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PETROPOLIS', '33-03906');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PINHEIRAL', '33-03955');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PIRAI', '33-04003');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PORCIUNCULA', '33-04102');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'PORTO REAL', '33-04110');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'QUATIS', '33-04128');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'QUEIMADOS', '33-04144');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'QUISSAMA', '33-04151');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'RESENDE', '33-04201');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'RIO BONITO', '33-04300');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'RIO CLARO', '33-04409');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'RIO DAS FLORES', '33-04508');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'RIO DAS OSTRAS', '33-04524');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'RIO DE JANEIRO', '33-04557');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SANTA MARIA MADALENA', '33-04607');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SANTO ANTONIO DE PADUA', '33-04706');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO FRANCISCO DE ITABAPOANA', '33-04755');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO FIDELIS', '33-04805');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO GONCALO', '33-04904');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO JOAO DA BARRA', '33-05000');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO JOAO DE MERITI', '33-05109');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO JOSE DE UBA', '33-05133');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO JOSE DO VALE DO RIO PRETO', '33-05158');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO PEDRO DA ALDEIA', '33-05208');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAO SEBASTIAO DO ALTO', '33-05307');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAPUCAIA', '33-05406');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SAQUAREMA', '33-05505');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SEROPEDICA', '33-05554');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SILVA JARDIM', '33-05604');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'SUMIDOURO', '33-05703');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'TANGUA', '33-05752');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'TERESOPOLIS', '33-05802');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'TRAJANO DE MORAIS', '33-05901');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'TRES RIOS', '33-06008');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'VALENCA', '33-06107');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'VARRE-SAI', '33-06156');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'VASSOURAS', '33-06206');
INSERT INTO municipios (id, uf, nome, codIBGE) VALUES (0, 'RJ', 'VOLTA REDONDA', '33-06305');
