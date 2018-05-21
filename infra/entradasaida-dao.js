class EntradaSaidaDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista entradasesaidas
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT  e.id, e.dt_emissao, e.nf_serie, e.nf_num, e.id_fornecedor, e.id_produto, e.qtde, e.valor, e.tipo, f.razao_social AS fornecedor, p.descricao AS produto, IF(e.tipo = 1, "Entrada", "Saída") AS tipoentsai, @saldo_qtde := @saldo_qtde + IF(e.tipo = 1, e.qtde, e.qtde*-1) as saldo_qtde, @saldo_valor := @saldo_valor + IF(e.tipo = 1, e.valor, e.valor*-1) as saldo_valor,@preco_medio := ROUND((@saldo_valor / @saldo_qtde),2) as preco_medio FROM entradasesaidas e LEFT JOIN fornecedores f ON (e.id_fornecedor = f.id ) LEFT JOIN produtos p ON (e.id_produto = p.id )' , (err, entradasesaidas)=>{;
                if(err) return reject(err);
                resolve(entradasesaidas); 
            }); 
        });
    };

    // Lista entradasesaidas
    listagem(idProduto) {
        return new Promise((resolve, reject)=>{
            this._connection.query('CALL ExtratoEstoque(' + idProduto +')', (err, entradasesaidas)=>{;
                if(err) return reject(err);
                resolve(entradasesaidas[0]); 
            }); 
        });
    };

    // Adiciona entradasaida
    add(entradasaida){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO entradasesaidas SET?', entradasaida, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove entradasaida
    remove(id, cb){
        this._connection.query('DELETE FROM entradasesaidas WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, dt_emissao, nf_serie, nf_num, id_fornecedor, id_produto, qtde, valor, tipo FROM entradasesaidas WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }

    // Altera entradasaida
    altera(entradasaida, cb){
        this._connection.query('UPDATE entradasesaidas SET dt_emissao=?, nf_serie=?, nf_num=?, id_fornecedor=?, id_produto=?, qtde=?, valor=?, tipo=? WHERE id=?',
        [entradasaida.dt_emissao, entradasaida.nf_serie, entradasaida.nf_num, entradasaida.id_fornecedor, entradasaida.id_produto, entradasaida.qtde, entradasaida.valor, entradasaida.tipo, entradasaida.id],cb);
    }

}

module.exports = EntradaSaidaDao;