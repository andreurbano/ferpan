const UFDao = require('../infra/uf-dao')
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

    // Rota Lista ufs
    app.get('/ufs', wrapAsync(async(req, res, next) => {
        const ufs = await new UFDao(req.connection).list();

        res.format({
            html: () => res.render('ufs/lista', {ufs}), // Retorno em HTML
            json: () => res.json(ufs) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/ufs/form', (req,res) => {
        res.render('ufs/form', {uf:{}});
    });

    // Rota Adiciona uf
    app.post('/ufs', (req, res, next) => {
        req.assert('nome','Nome Obrigatorio').notEmpty();
        
        const erros = req.validationErrors();
        if(erros) return res.render('ufs/form', {erros, uf:[]});

        // Informa ao usuário que foi salvo com sucesso
        const uf = req.body; 
        new UFDao(req.connection)
            .add(uf)
            .then( id => {
                uf.id = id;
                app.get('io').emit('novoUF', uf);
                res.render('ufs/salvo');
            })
            .catch(next);
    });

    // Rota Remove uf
    app.delete('/ufs/:id', (req, res, next) => {
        console.log(req.params.id);


        new UFDao(req.connection)
            .remove(req.params.id, err => {

                if(err) return next(err);
                res.redirect('/ufs');
            });
    });

    // Rota Edita uf
    app.get('/ufs/form/:id', (req, res, next) => {
        new UFDao(req.connection)
            .buscaPorId(req.params.id, (err, uf)=>{
                if(err) return next(err);
                res.render('ufs/form', {uf});

            });
    });

    // Rota Altera uf
    app.put('/ufs/:id', (req, res, next)=>{
        const uf = pluck(req.body, 'sigla', 'nome', 'id');
    
        new UFDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/ufs');
            
        });
    });

};
