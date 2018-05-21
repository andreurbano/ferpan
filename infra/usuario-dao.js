class UsuarioDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista usuarios
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, nome, email, username, pass FROM usuarios',(err, usuarios)=>{;
                if(err) return reject(err);
                resolve(usuarios); 
            }); 
        });
    };

    // Adiciona usuario
    add(usuario){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO usuarios SET?', usuario, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
             });
        });
    };

    // Remove usuario
    remove(id, cb){
        this._connection.query('DELETE FROM usuarios WHERE id=?', [id], cb);
    }

    // Busca usuario por Id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, nome, email, username, pass FROM usuarios WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }

    // Busca usuario por Email
    buscaPorEmail(email, cb){
        this._connection.query('SELECT id, nome, email, username, pass FROM usuarios WHERE email=?',[email], (err, data)=> cb(err,data[0]));
    }
    
    // Altera usuario
    altera(usuario, cb){
        this._connection.query('UPDATE usuarios SET nome=?,email=?,username=?,pass=? WHERE id=?',
        [usuario.nome, usuario.email, usuario.username, usuario.pass, usuario.id], cb);
    }

}

module.exports = UsuarioDao;