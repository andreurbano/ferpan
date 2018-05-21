const TipoDeFornecedorDao = require('../infra/tipofornecedor-dao')
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

    // Rota Lista tiposdefornecedores
    app.get('/tiposdefornecedores', wrapAsync(async(req, res, next) => {
        const tiposdefornecedores = await new TipoDeFornecedorDao(req.connection).list();

        res.format({
            html: () => res.render('tiposdefornecedores/lista', {tiposdefornecedores}), // Retorno em HTML
            json: () => res.json(tiposdefornecedores) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/tiposdefornecedores/form', (req,res) => {
        res.render('tiposdefornecedores/form', {tipodefornecedor:{}});
    });

    // Rota Adiciona tipodefornecedor
    app.post('/tiposdefornecedores', (req, res, next) => {
        //req.assert('nome','Nome Obrigatorio').notEmpty();
        const erros = req.validationErrors();
        if(erros) return res.render('tiposdefornecedores/form', {erros, tipodefornecedor:[]});

        // Informa ao usuário que foi salvo com sucesso
        const tipodefornecedor = req.body; 
        new TipoDeFornecedorDao(req.connection)
            .add(tipodefornecedor)
            .then( id => {
                tipodefornecedor.id = id;
                app.get('io').emit('novoTipoDeFornecedor', tipodefornecedor);
                res.render('tiposdefornecedores/salvo');
            })
            .catch(next);
    });

    // Rota Remove tipodefornecedor
    app.delete('/tiposdefornecedores/:id', (req, res, next) => {
        new TipoDeFornecedorDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/tiposdefornecedores');
            });
    });

    // Rota Edita tipodefornecedor
    app.get('/tiposdefornecedores/form/:id', (req, res, next) => {
        new TipoDeFornecedorDao(req.connection)
            .buscaPorId(req.params.id, (err, tipodefornecedor)=>{
                if(err) return next(err);
                res.render('tiposdefornecedores/form', {tipodefornecedor});
            });
    });

    // Rota Altera tipodefornecedor
    app.put('/tiposdefornecedores/:id', (req, res, next)=>{
        const tipodefornecedor = pluck(req.body, 'descricao', 'id');

        new TipoDeFornecedorDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/tiposdefornecedores');
        });
    });
};
