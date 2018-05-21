class ProdutoDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista produtos
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT p.id, p.descricao, p.id_tipoproduto, p.id_unidademedida, p.saldo_ini_dt, p.saldo_ini_qtde, p.saldo_ini_valor, p.saldo_ini_preco_medio, p.saldo_atu_dt, p.saldo_atu_qtde, p.saldo_atu_valor, p.saldo_atu_preco_medio FROM produtos p ORDER BY p.descricao DESC',(err, produtos)=>{;
                if(err) return reject(err);
                resolve(produtos); 
            }); 
        });
    };

    // Lista Saldo dos Produtos
    listaSaldoProdutos() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT p.id, p.descricao, p.saldo_atu_dt, p.saldo_atu_qtde, u.Sigla, p.saldo_atu_valor FROM produtos p, unidadesdemedidas u WHERE (p.id_unidademedida = u.id) ORDER BY p.descricao DESC',(err, produtos)=>{;
                if(err) return reject(err);
                resolve(produtos); 
            }); 
        });
    };

    // Adiciona produto
    add(produto){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO produtos SET?', produto, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove produto
    remove(id, cb){
        this._connection.query('DELETE FROM produtos WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, descricao, id_tipoproduto, id_unidademedida, saldo_ini_dt, saldo_ini_qtde, saldo_ini_valor, saldo_ini_preco_medio, saldo_atu_dt, saldo_atu_qtde, saldo_atu_valor, saldo_atu_preco_medio FROM produtos WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }
    
    // Altera produto
    altera(produto, cb){
        console.log(produto.saldo_ini_valor);

        this._connection.query('UPDATE produtos SET descricao=?,id_tipoproduto=?, id_unidademedida=?, saldo_ini_dt=?, saldo_ini_qtde=?, saldo_ini_valor=?, saldo_ini_preco_medio=?, saldo_atu_dt=?, saldo_atu_qtde=?, saldo_atu_valor=?, saldo_atu_preco_medio=? WHERE id=?',
        [produto.descricao, produto.id_tipoproduto, produto.id_unidademedida, produto.saldo_ini_dt, produto.saldo_ini_qtde, produto.saldo_ini_valor, produto.saldo_ini_preco_medio, produto.saldo_atu_dt, produto.saldo_atu_qtde, produto.saldo_atu_valor, produto.saldo_atu_preco_medio, produto.id],cb);
    }
}

module.exports = ProdutoDao;