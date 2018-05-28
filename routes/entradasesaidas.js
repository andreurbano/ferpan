const EntradaSaidaDao = require('../infra/entradasaida-dao')
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

    // Rota Lista entradasesaidas
    app.get('/entradasesaidas', wrapAsync(async(req, res, next) => {
        const entradasesaidas = await new EntradaSaidaDao(req.connection).list();
        // Formata os dados para apresentação
        entradasesaidas.forEach(function(value){
            value.dt_emissao  = moment(value.dt_emissao).format('DD/MM/YYYY');
            value.nf_serie    = numeral(value.nf_serie).format('000');
            value.nf_num      = numeral(value.nf_num).format('0000000');
            value.qtde        = numeral(value.qtde).format('0,0.00');
            value.valor       = numeral(value.valor).format('0,0.00');
            value.saldo_qtde  = numeral(value.saldo_qtde).format('0,0.00');
            value.saldo_valor = numeral(value.saldo_valor).format('0,0.00');
            value.preco_medio = numeral(value.preco_medio).format('0,0.00');
        });

        res.format({
            html: () => res.render('entradasesaidas/lista', {entradasesaidas}), // Retorno em HTML
            json: () => res.json(entradasesaidas) // Retorna Json 
        });
                
    }));

    // Rota Listagem de Entradas e Saídas
    app.get('/entradasesaidas/lista/:idProduto,:dataMes', wrapAsync(async(req, res, next) => {

        console.log('Passo 2: Cód Produto = ' + req.params.idProduto);
        console.log('Passo 2: Dt. Mês = '     + req.params.dataMes);

        const dataIni = req.params.dataMes + '-01';
        const dataFim = req.params.dataMes + '-30';


        const entradasesaidas = await new EntradaSaidaDao(req.connection).listagem(req.params.idProduto, dataIni, dataFim);
        // Formata os dados para apresentação
        entradasesaidas.forEach(function(value){
            value.dt_emissao  = moment(value.dt_emissao).format('DD/MM/YYYY');
            value.nf_serie    = numeral(value.nf_serie).format('000');
            value.nf_num      = numeral(value.nf_num).format('0000000');
            value.qtde        = numeral(value.qtde).format('0,0');
            value.valor       = numeral(value.valor).format('0,0.00');
            value.saldo_qtde  = numeral(value.saldo_qtde).format('0,0');
            value.saldo_valor = numeral(value.saldo_valor).format('0,0.00');
            value.preco_medio = numeral(value.preco_medio).format('0,0.00');
        });

        res.format({
            html: () => res.render('entradasesaidas/listagem', {entradasesaidas}), // Retorno em HTML
            json: () => res.json(entradasesaidas) // Retorna Json 
        });
                
    }));



















    // Rota Chama o formulário
    app.get('/entradasesaidas/form', (req,res) => {
        res.render('entradasesaidas/form', {entradasaida:{}});
    });

    // Rota Adiciona entradasaida
    app.post('/entradasesaidas', (req, res, next) => {
        const erros = req.validationErrors();
        if(erros) return res.render('entradasesaidas/form', {erros, entradasaida:[]});

        // Informa ao usuário que foi salvo com sucesso
        const entradasaida = req.body; 
        new EntradaSaidaDao(req.connection)
            .add(entradasaida)
            .then( id => {
                entradasaida.id = id;
                app.get('io').emit('novoEntradaSaida', entradasaida);
                res.render('entradasesaidas/salvo');
            })
            .catch(next);
    });

    // Rota Remove entradasaida
    app.delete('/entradasesaidas/:id', (req, res, next) => {
        new EntradaSaidaDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/entradasesaidas');
            });
    });

    // Rota Edita entradasaida
    app.get('/entradasesaidas/form/:id', (req, res, next) => {
        new EntradaSaidaDao(req.connection)
            .buscaPorId(req.params.id, (err, entradasaida)=>{

                // Formata os dados para apresentação
                //entradasaida.dt_emissao = moment(entradasaida.dt_emissao).format('DD/MM/YYYY');
                entradasaida.dt_emissao = moment(entradasaida.dt_emissao).format('YYYY-MM-DD');
                entradasaida.nf_serie   = numeral(entradasaida.nf_serie).format('000');
                entradasaida.nf_num     = numeral(entradasaida.nf_num).format('0000000000');
                //entradasaida.qtde       = numeral(entradasaida.qtde).format('0,0.00');;
                //entradasaida.valor      = numeral(entradasaida.valor).format('0,0.00');;
                entradasaida.qtde       = numeral(entradasaida.qtde).format('0.00');;
                entradasaida.valor      = numeral(entradasaida.valor).format('0.00');;

                if(err) return next(err);
                res.render('entradasesaidas/form', {entradasaida});
            });
    });

    // Rota Altera entradasaida
    app.put('/entradasesaidas/:id', (req, res, next)=>{
        const entradasaida = pluck(req.body, 'dt_emissao', 'nf_serie', 'nf_num', 'id_fornecedor', 'id_produto', 'qtde', 'valor', 'tipo', 'id');
        new EntradaSaidaDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/entradasesaidas');
        });
    });
};
