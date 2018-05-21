const UnidadeDeMedidaDao = require('../infra/unidademedida-dao')
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

    // Rota Lista unidadesdemedidas
    app.get('/unidadesdemedidas', wrapAsync(async(req, res, next) => {
        const unidadesdemedidas = await new UnidadeDeMedidaDao(req.connection).list();

        res.format({
            html: () => res.render('unidadesdemedidas/lista', {unidadesdemedidas}), // Retorno em HTML
            json: () => res.json(unidadesdemedidas) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/unidadesdemedidas/form', (req,res) => {
        res.render('unidadesdemedidas/form', {unidadedemedida:{}});
    });

    // Rota Adiciona unidadedemedida
    app.post('/unidadesdemedidas', (req, res, next) => {
        //req.assert('nome','Nome Obrigatorio').notEmpty();
        const erros = req.validationErrors();
        if(erros) return res.render('unidadesdemedidas/form', {erros, unidadedemedida:[]});

        // Informa ao usuário que foi salvo com sucesso
        const unidadedemedida = req.body; 
        new UnidadeDeMedidaDao(req.connection)
            .add(unidadedemedida)
            .then( id => {
                unidadedemedida.id = id;
                app.get('io').emit('novoUnidadeDeMedida', unidadedemedida);
                res.render('unidadesdemedidas/salvo');
            })
            .catch(next);
    });

    // Rota Remove unidadedemedida
    app.delete('/unidadesdemedidas/:id', (req, res, next) => {
        new UnidadeDeMedidaDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/unidadesdemedidas');
            });
    });

    // Rota Edita unidadedemedida
    app.get('/unidadesdemedidas/form/:id', (req, res, next) => {
        new UnidadeDeMedidaDao(req.connection)
            .buscaPorId(req.params.id, (err, unidadedemedida)=>{
                if(err) return next(err);
                res.render('unidadesdemedidas/form', {unidadedemedida});
            });
    });

    // Rota Altera unidadedemedida
    app.put('/unidadesdemedidas/:id', (req, res, next)=>{
        const unidadedemedida = pluck(req.body, 'sigla', 'descricao', 'id');

        new UnidadeDeMedidaDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/unidadesdemedidas');
        });
    });
};
