const express = require("express")
, app = express()
, ejs = require('ejs')
, connectionMiddleware = require('./infra/connection-middleware')
, pool = require('./infra/pool')
, bodyParser = require('body-parser')
, expressValidator = require('express-validator')
, methodOverride = require('method-override')
, cors = require('cors');

 // Náo tem na apostila. trabalhar com a extensáo .html ao inves da extensáo .ejs
app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

// Middlewares da aplicacao - Executana ordem 
app.use(cors());
// Dica de segurança troca a tecnologia usada
app.use((req, res, next) => {
    res.set('X-Powered-By', 'PHP/7.1.7');
    next();
})
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(connectionMiddleware(pool));
app.use(expressValidator());
app.use(methodOverride('_method'));

// Rotas
require('./routes/index') (app);
require('./routes/login') (app);
require('./routes/home') (app);
require('./routes/usuarios') (app);
require('./routes/municipios') (app);
require('./routes/ufs') (app);
require('./routes/fornecedores') (app);
require('./routes/produtos') (app);
require('./routes/entradasesaidas') (app);
require('./routes/unidadesdemedidas') (app);
require('./routes/tiposdeprodutos') (app);
require('./routes/tiposdefornecedores') (app);
require('./routes/ramosdeatividades') (app);

// Middleware pagina nao encontrada - 404
app.use('*', (req, res) => res.status(404).render('erros/404'));

//Middleware erro - 500
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).render('erros/500');
});
    
// Exporta o modulo para outro modulo
module.exports = app;