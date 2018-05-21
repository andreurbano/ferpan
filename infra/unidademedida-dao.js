class UnidadeDeMedidaDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista unidadesdemedidas
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, sigla, descricao FROM unidadesdemedidas',(err, unidadesdemedidas)=>{;
                if(err) return reject(err);
                resolve(unidadesdemedidas); 
            }); 
        });
    };

    // Adiciona UnidadeDeMedida
    add(unidadedemedida){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO unidadesdemedidas SET?', unidadedemedida, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove unidadedemedida
    remove(id, cb){
        this._connection.query('DELETE FROM unidadesdemedidas WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, sigla, descricao FROM unidadesdemedidas WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }
    
    // Altera unidadedemedida
    altera(unidadedemedida, cb){
        this._connection.query('UPDATE unidadesdemedidas SET sigla=?,descricao=? WHERE id=?',
        [unidadedemedida.sigla, unidadedemedida.descricao, unidadedemedida.id],cb);
    }
}

module.exports = UnidadeDeMedidaDao;