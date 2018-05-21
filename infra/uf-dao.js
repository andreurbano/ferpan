class UFDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista ufs
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, sigla, nome FROM ufs',(err, ufs)=>{;
                if(err) return reject(err);
                resolve(ufs); 
            }); 
        });
    };

    // Adiciona UF
    add(uf){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO ufs SET?', uf, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove UF
    remove(id, cb){
        this._connection.query('DELETE FROM ufs WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, sigla, nome FROM ufs WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }

    // Altera UF
    altera(uf, cb){
        this._connection.query('UPDATE ufs SET sigla=?,nome=? WHERE id=?',
        [uf.sigla, uf.nome, uf.id],cb);
    }

}

module.exports = UFDao;