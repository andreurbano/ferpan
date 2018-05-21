const ProdutoDao = require('../infra/produto-dao')
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

    // Rota Lista produtos
    app.get('/produtos', wrapAsync(async(req, res, next) => {
        const produtos = await new ProdutoDao(req.connection).list();

        // Formata os dados para apresentação
        produtos.forEach(function(value){
            value.saldo_ini_dt          = moment(value.saldo_ini_dt).format('DD/MM/YYYY');
            value.saldo_ini_qtde        = numeral(value.saldo_ini_qtde).format('0,0.00');
            value.saldo_ini_valor       = numeral(value.saldo_ini_valor).format('0,0.00');
            value.saldo_ini_preco_medio = numeral(value.saldo_ini_preco_medio).format('0,0.00');
        });

        res.format({
            html: () => res.render('produtos/lista', {produtos}), // Retorno em HTML
            json: () => res.json(produtos) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/produtos/form', (req,res) => {
        res.render('produtos/form', {produto:{}});
    });

    // Rota Adiciona produto
    app.post('/produtos', (req, res, next) => {
        const erros = req.validationErrors();
        if(erros) return res.render('produtos/form', {erros, produto:[]});

        // Informa ao usuário que foi salvo com sucesso
        const produto = req.body; 
        new ProdutoDao(req.connection)
            .add(produto)
            .then( id => {
                produto.id = id;
                app.get('io').emit('novoProduto', produto);
                res.render('produtos/salvo');
            })
            .catch(next);
    });

    // Rota Remove produto
    app.delete('/produtos/:id', (req, res, next) => {
        new ProdutoDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/produtos');
            });
    });

    // Rota Edita produto
    app.get('/produtos/form/:id', (req, res, next) => {
        new ProdutoDao(req.connection)
            .buscaPorId(req.params.id, (err, produto)=>{

                // Formata os dados para apresentação
                produto.saldo_ini_dt          = moment(produto.saldo_ini_dt).format('YYYY-MM-DD');
                produto.saldo_ini_qtde        = numeral(produto.saldo_ini_qtde).format('0.00');;
                produto.saldo_ini_valor       = numeral(produto.saldo_ini_valor).format('0.00');;
                produto.saldo_ini_preco_medio = numeral(produto.saldo_ini_preco_medio).format('0.00');;

                if(err) return next(err);
                res.render('produtos/form', {produto});
            });
    });

    // Rota Altera produto
    app.put('/produtos/:id', (req, res, next)=>{
        const produto = pluck(req.body, 'descricao', 'id_tipoproduto', 'id_unidademedida', 'saldo_ini_dt', 'saldo_ini_qtde', 'saldo_ini_valor', 'saldo_ini_preco_medio', 'saldo_atu_dt', 'saldo_atu_qtde', 'saldo_atu_valor', 'saldo_atu_preco_medio', 'id');
        new ProdutoDao(req.connection)
        .altera(req.body, err=>{

            console.log(produto);
            produto.saldo_ini_qtde        = numeral(produto.saldo_ini_qtde).format('0.00');;
            produto.saldo_ini_valor       = numeral(produto.saldo_ini_valor).format('0.00');;
            produto.saldo_ini_preco_medio = numeral(produto.saldo_ini_preco_medio).format('0.00');;
            console.log(produto);

            if(err) return next(err);
            res.redirect('/produtos');
        });
    });
};
