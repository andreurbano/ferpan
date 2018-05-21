class FornecedorDao{
    constructor(connection){
        this._connection = connection;
    };

    // Lista fornecedores
    list() {
        return new Promise((resolve, reject)=>{
            this._connection.query('SELECT id, razao_social, cnpj, email, id_ramoatividade, id_tipofornecedor, end_logradouro, end_numero, end_complemento, end_cep, end_uf, end_municipio FROM fornecedores ORDER BY razao_social',(err, fornecedores)=>{;
                if(err) return reject(err);
                resolve(fornecedores); 
            }); 
        });
    };

    // Adiciona fornecedor
    add(fornecedor){
        return new Promise((resolve, reject)=>{
            this._connection.query('INSERT INTO fornecedores SET?', fornecedor, (err, result) =>{
                if( err ) return reject( err );
                resolve( result.insertId );
            });
        });
    };

    // Remove fornecedor
    remove(id, cb){
        this._connection.query('DELETE FROM fornecedores WHERE id=?', [id], cb);
    }

    // Busca por id
    buscaPorId(id, cb){
        this._connection.query('SELECT id, razao_social, cnpj, email, id_ramoatividade, id_tipofornecedor, end_logradouro, end_numero, end_complemento, end_cep, end_uf, end_municipio FROM fornecedores WHERE id=?',[id], (err, data)=> cb(err,data[0]));
    }

    // Altera fornecedor
    altera(fornecedor, cb){
        this._connection.query('UPDATE fornecedores SET razao_social=?, cnpj=?, email=?, id_ramoatividade=?, id_tipofornecedor=?, end_logradouro=?, end_numero=?, end_complemento=?, end_cep=?, end_uf=?, end_municipio=? WHERE id=?',
        [fornecedor.razao_social, fornecedor.cnpj, fornecedor.email, fornecedor.id_ramoatividade, fornecedor.id_tipofornecedor, fornecedor.end_logradouro, fornecedor.end_numero, fornecedor.end_complemento, fornecedor.end_cep, fornecedor.end_uf, fornecedor.end_municipio, fornecedor.id],cb);
    }
}

module.exports = FornecedorDao;