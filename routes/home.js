const UsuarioDao = require('../infra/usuario-dao');
const ProdutoDao = require('../infra/produto-dao');
//
const wrapAsync = fn =>
    (req, res,next) =>
        fn(req,res).catch(next);

//
const pluck = (object, ...keys) => {
    const newObject = {};
    keys.forEach(key => newObject[key] = object[key]);
    return newObject;
};

// Processa e formata valores do tipo data
var moment = require('moment');
moment().format('L');

// Processa e formata valores do tipo numeral
var numeral = require('numeral');
// 
module.exports = app => {


    // Rota chama formulário da página inicial - inicio.html
    // Lista saldos dos produtos
    app.get('/home/inicio', wrapAsync(async(req, res, next) => {
        var produtos = await new ProdutoDao(req.connection).listaSaldoProdutos();

        // Formata a data
        produtos.forEach(function(value){
            //console.log(value.saldo_atu_dt);
            value.saldo_atu_dt = moment(value.saldo_atu_dt).format('DD/MM/YYYY');
            //console.log(value.saldo_atu_dt);

            value.nf_serie = numeral(value.nf_serie).format('000');
            value.nf_num = numeral(value.nf_num).format('0000000000');
            value.qtde = numeral(value.qtde).format('0,0.00');;
            value.valor = numeral(value.valor).format('$0,0.00');;


        });

       
        // Retorna o dataset
        res.format({
            html: () => res.render('home/inicio', {produtos}), // Retorno em HTML
            json: () => res.json(produtos) // Retorna Json 
        });
                
    }));


    // Rota Chama o formulário verificando usuário e senha
    app.post('/home/', (req, res, next) => {
        var user_email = req.param('email');
        var user_pass  = req.param('pass');

        new UsuarioDao(req.connection)
        .buscaPorEmail(user_email, (err, usuario)=>{
            // Se o email foi localizado...
            if (usuario) {
                
                // Se a senha digita for igual a cadastrada...
                if(user_pass == usuario.pass ){

                    if(err) return next(err);
                    res.render('home/form', {usuario});
                    //res.render('home/inicio', {usuario});
                }
                // ...Senão, mostra mensagem que a senha não confere.
                else{
                    res.send('Senha não confere! Tente novamente!')
                    //res.render('/erro_email_senha_nao_confere');
                }

            }
            // ...Senão, mostra mensagem que não foi encontrado.
            else {
                res.send('Email não localizado! Verifique se digitou corretamente.')
            }

        });
    });

};