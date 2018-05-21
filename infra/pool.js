const mysql = require('mysql');
const pool = mysql.createPool({

    host: 'server-db.sistemaslivres.com.br',
    user: 'root',
    password: '63urbano41',
    database: 'ferpan',
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,

    /*
    host: 'localhost',
    user: 'root',
    password: '63urbano41',
    database: 'ferpan',
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    *


    /*
    host: 'siciprovedor.mysql.uhserver.com',
    user: 'sici',
    password: 'Si*Ci1',
    database: 'siciprovedor',
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,




    host: 'siciprovedor.mysql.uhserver.com',
    user: 'sici',
    password: 'Si*Ci1',
    database: 'siciprovedor',
    connectionLimit: 10,

    host: 'localhost',
    user: 'root',
    password: '63urbano41',
    database: 'casadocodigo',
    connectionLimit: 10,

    host: 'localhost',
    user: 'root',
    password: '63urbano41',
    database: 'siciprovedor',
    connectionLimit: 10,
    */
});

console.log('Pool Ativado.');
pool.on('release', () => console.log('Conexáo devolvida para o Pool.'));

// Fecha o Pool.
process.on('SIGINT', () => {

    pool.end(err => {
        if(err) return console.log(err);
        console.log('Pool Fechado.');
        process.exit(0);

    })
});

module.exports = pool;