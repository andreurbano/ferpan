class MunicipioDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista municipios
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, uf, nome, codIBGE FROM municipios',(err, municipios)=>{;
                if(err) return reject(err);
                resolve(municipios); 
            }); 
        });
    };

    // Adiciona municipio
    add(municipio){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO municipios SET?', municipio, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove municipio
    remove(id, cb){
        this._connection.query('DELETE FROM municipios WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, uf, nome, codIBGE FROM municipios WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }
    
    // Altera municipio
    altera(municipio, cb){
        this._connection.query('UPDATE municipios SET uf=?,nome=?,codIBGE=? WHERE id=?',
        [municipio.uf, municipio.nome, municipio.codIBGE, municipio.id],cb);

    }

}

module.exports = MunicipioDao;