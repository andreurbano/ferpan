class RamoDeAtividadeDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista ramosdeatividades
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, descricao FROM ramosdeatividades',(err, ramosdeatividades)=>{;
                if(err) return reject(err);
                resolve(ramosdeatividades); 
            }); 
        });
    };

    // Adiciona ramosdeatividades
    add(ramosdeatividades){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO ramosdeatividades SET?', ramosdeatividades, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove ramosdeatividades
    remove(id, cb){
        this._connection.query('DELETE FROM ramosdeatividades WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, descricao FROM ramosdeatividades WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }

    // Altera ramosdeatividades
    altera(ramosdeatividades, cb){
        this._connection.query('UPDATE ramosdeatividades SET descricao=? WHERE id=?',
        [ramosdeatividades.descricao, ramosdeatividades.id],cb);
    }
}

module.exports = RamoDeAtividadeDao;