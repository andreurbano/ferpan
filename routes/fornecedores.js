const FornecedorDao = require('../infra/fornecedor-dao')
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

    // Rota Lista fornecedores
    app.get('/fornecedores', wrapAsync(async(req, res, next) => {
        const fornecedores = await new FornecedorDao(req.connection).list();

        res.format({
            html: () => res.render('fornecedores/lista', {fornecedores}), // Retorno em HTML
            json: () => res.json(fornecedores) // Retorna Json 
        });
                
    }));

    // Rota Chama o formulário
    app.get('/fornecedores/form', (req,res) => {
        res.render('fornecedores/form', {fornecedor:{}});
    });

    // Rota Adiciona fornecedor
    app.post('/fornecedores', (req, res, next) => {
        //req.assert('nome','Nome Obrigatorio').notEmpty();
        
        const erros = req.validationErrors();
        if(erros) return res.render('fornecedores/form', {erros, fornecedor:[]});

        // Informa ao usuário que foi salvo com sucesso
        const fornecedor = req.body; 
        new FornecedorDao(req.connection)
            .add(fornecedor)
            .then( id => {
                fornecedor.id = id;
                app.get('io').emit('novoFornecedor', fornecedor);
                res.render('fornecedores/salvo');
            })
            .catch(next);
    });

    // Rota Remove fornecedor
    app.delete('/fornecedores/:id', (req, res, next) => {
        console.log(req.params.id);


        new FornecedorDao(req.connection)
            .remove(req.params.id, err => {

                if(err) return next(err);
                res.redirect('/fornecedores');
            });
    });

    // Rota Edita fornecedor
    app.get('/fornecedores/form/:id', (req, res, next) => {
        new FornecedorDao(req.connection)
            .buscaPorId(req.params.id, (err, fornecedor)=>{
                if(err) return next(err);
                res.render('fornecedores/form', {fornecedor});

            });
    });

    // Rota Altera fornecedor
    app.put('/fornecedores/:id', (req, res, next)=>{
        const fornecedor = pluck(req.body, 'razao_social', 'cnpj', 'email', 'id_ramoatividade', 'id_tipofornecedor', 'end_logradouro', 'end_numero', 'end_complemento', 'end_cep', 'end_uf', 'end_municipio', 'id');

        new FornecedorDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/fornecedores');
            
        });
    });

};
