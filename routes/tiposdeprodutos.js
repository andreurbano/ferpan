const TipoDeProdutoDao = require('../infra/tipoproduto-dao')
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

// 
module.exports = app => {

    // Rota Lista tiposdeprodutos
    app.get('/tiposdeprodutos', wrapAsync(async(req, res, next) => {
        const tiposdeprodutos = await new TipoDeProdutoDao(req.connection).list();

        res.format({
            html: () => res.render('tiposdeprodutos/lista', {tiposdeprodutos}), // Retorno em HTML
            json: () => res.json(tiposdeprodutos) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/tiposdeprodutos/form', (req,res) => {
        res.render('tiposdeprodutos/form', {tipodeproduto:{}});
    });

    // Rota Adiciona tipodeproduto
    app.post('/tiposdeprodutos', (req, res, next) => {
        //req.assert('nome','Nome Obrigatorio').notEmpty();
        const erros = req.validationErrors();
        if(erros) return res.render('tiposdeprodutos/form', {erros, tipodeproduto:[]});

        // Informa ao usuário que foi salvo com sucesso
        const tipodeproduto = req.body; 
        new TipoDeProdutoDao(req.connection)
            .add(tipodeproduto)
            .then( id => {
                tipodeproduto.id = id;
                app.get('io').emit('novoTipoDeProduto', tipodeproduto);
                res.render('tiposdeprodutos/salvo');
            })
            .catch(next);
    });

    // Rota Remove tipodeproduto
    app.delete('/tiposdeprodutos/:id', (req, res, next) => {
        new TipoDeProdutoDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/tiposdeprodutos');
            });
    });

    // Rota Edita tipodeproduto
    app.get('/tiposdeprodutos/form/:id', (req, res, next) => {
        new TipoDeProdutoDao(req.connection)
            .buscaPorId(req.params.id, (err, tipodeproduto)=>{
                if(err) return next(err);
                res.render('tiposdeprodutos/form', {tipodeproduto});
            });
    });

    // Rota Altera tipodeproduto
    app.put('/tiposdeprodutos/:id', (req, res, next)=>{
        const tipodeproduto = pluck(req.body, 'descricao', 'id');

        new TipoDeProdutoDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/tiposdeprodutos');
        });
    });
};
