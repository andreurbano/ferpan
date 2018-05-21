const RamoDeAtividadeDao = require('../infra/ramoatividade-dao')
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

    // Rota Lista ramosdeatividades
    app.get('/ramosdeatividades', wrapAsync(async(req, res, next) => {
        const ramosdeatividades = await new RamoDeAtividadeDao(req.connection).list();

        res.format({
            html: () => res.render('ramosdeatividades/lista', {ramosdeatividades}), // Retorno em HTML
            json: () => res.json(ramosdeatividades) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/ramosdeatividades/form', (req,res) => {
        res.render('ramosdeatividades/form', {ramodeatividade:{}});
    });

    // Rota Adiciona ramodeatividade
    app.post('/ramosdeatividades', (req, res, next) => {
        //req.assert('nome','Nome Obrigatorio').notEmpty();
        const erros = req.validationErrors();
        if(erros) return res.render('ramosdeatividades/form', {erros, ramodeatividade:[]});

        // Informa ao usuário que foi salvo com sucesso
        const ramodeatividade = req.body; 
        new RamoDeAtividadeDao(req.connection)
            .add(ramodeatividade)
            .then( id => {
                ramodeatividade.id = id;
                app.get('io').emit('novoRamoDeAtividade', ramodeatividade);
                res.render('ramosdeatividades/salvo');
            })
            .catch(next);
    });

    // Rota Remove ramodeatividade
    app.delete('/ramosdeatividades/:id', (req, res, next) => {
        new RamoDeAtividadeDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/ramosdeatividades');
            });
    });

    // Rota Edita ramodeatividade
    app.get('/ramosdeatividades/form/:id', (req, res, next) => {
        new RamoDeAtividadeDao(req.connection)
            .buscaPorId(req.params.id, (err, ramodeatividade)=>{
                if(err) return next(err);
                res.render('ramosdeatividades/form', {ramodeatividade});
            });
    });

    // Rota Altera ramodeatividade
    app.put('/ramosdeatividades/:id', (req, res, next)=>{
        const ramodeatividade = pluck(req.body, 'descricao', 'id');

        new RamoDeAtividadeDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/ramosdeatividades');
        });
    });
};
