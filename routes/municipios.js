const MunicipioDao = require('../infra/municipio-dao')
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

    // Rota Lista municipios
    app.get('/municipios', wrapAsync(async(req, res, next) => {
        const municipios = await new MunicipioDao(req.connection).list();

        res.format({
            html: () => res.render('municipios/lista', {municipios}), // Retorno em HTML
            json: () => res.json(municipios) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/municipios/form', (req,res) => {
        res.render('municipios/form', {municipio:{}});
    });

    // Rota Adiciona municipio
    app.post('/municipios', (req, res, next) => {
        req.assert('nome','Nome Obrigatorio').notEmpty();
        
        const erros = req.validationErrors();
        if(erros) return res.render('municipios/form', {erros, municipio:[]});

        // Informa ao usuário que foi salvo com sucesso
        const municipio = req.body; 
        new MunicipioDao(req.connection)
            .add(municipio)
            .then( id => {
                municipio.id = id;
                app.get('io').emit('novoMunicipio', municipio);
                res.render('municipios/salvo');
            })
            .catch(next);
    });

    // Rota Remove municipio
    app.delete('/municipios/:id', (req, res, next) => {
        console.log(req.params.id);


        new MunicipioDao(req.connection)
            .remove(req.params.id, err => {

                if(err) return next(err);
                res.redirect('/municipios');
            });
    });

    // Rota Edita municipio
    app.get('/municipios/form/:id', (req, res, next) => {
        new MunicipioDao(req.connection)
            .buscaPorId(req.params.id, (err, municipio)=>{
                if(err) return next(err);
                res.render('municipios/form', {municipio});

            });
    });

    // Rota Altera municipio
    app.put('/municipios/:id', (req, res, next)=>{
        const municipio = pluck(req.body, 'uf', 'nome', 'codIBGE', 'id');
    
        new MunicipioDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/municipios');
            
        });
    });

};
