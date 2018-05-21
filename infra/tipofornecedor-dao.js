class TipoDeFornecedorDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista tiposdefornecedores
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, descricao FROM tiposdefornecedores',(err, tiposdefornecedores)=>{;
                if(err) return reject(err);
                resolve(tiposdefornecedores); 
            }); 
        });
    };

    // Adiciona TipoDeFornecedor
    add(tipodefornecedor){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO tiposdefornecedores SET?', tipodefornecedor, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove tipodefornecedor
    remove(id, cb){
        this._connection.query('DELETE FROM tiposdefornecedores WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, descricao FROM tiposdefornecedores WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }
    
    // Altera tipodefornecedor
    altera(tipodefornecedor, cb){
        this._connection.query('UPDATE tiposdefornecedores SET descricao=? WHERE id=?',
        [tipodefornecedor.descricao, tipodefornecedor.id],cb);
    }
}

module.exports = TipoDeFornecedorDao;