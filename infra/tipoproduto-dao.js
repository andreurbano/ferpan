class TipoDeProdutoDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista tiposdeprodutos
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, descricao FROM tiposdeprodutos',(err, tiposdeprodutos)=>{;
                if(err) return reject(err);
                resolve(tiposdeprodutos); 
            }); 
        });
    };

    // Adiciona tipodeproduto
    add(tipodeproduto){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO tiposdeprodutos SET?', tipodeproduto, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove tipodeproduto
    remove(id, cb){
        this._connection.query('DELETE FROM tiposdeprodutos WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, descricao FROM tiposdeprodutos WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }

    // Altera tipodeproduto
    altera(tipodeproduto, cb){
        this._connection.query('UPDATE tiposdeprodutos SET descricao=? WHERE id=?',
        [tipodeproduto.descricao, tipodeproduto.id],cb);
    }
}

module.exports = TipoDeProdutoDao;