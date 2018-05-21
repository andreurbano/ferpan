const UsuarioDao = require('../infra/usuario-dao')
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

    // Lista usuarios
    app.get('/usuarios', wrapAsync(async(req, res, next) => {
        const usuarios = await new UsuarioDao(req.connection).list();

        res.format({
            html: () => res.render('usuarios/lista', {usuarios}), // Retorno em HTML
            json: () => res.json(usuarios) // Retorna Json 
        });
    }));

    // Rota Chama o formulário
    app.get('/usuarios/form', (req,res) => {
        res.render('usuarios/form', {usuario:{}});
    });

    // Rota Adiciona usuarios
    app.post('/usuarios', (req, res, next) => {
        console.log('chamei')
        // Critica valores dos campos
        req.assert('nome','Nome Obrigatório').notEmpty();
        req.assert('email','E-mail Obrigatório').notEmpty();
        req.assert('username','Username Obrigatório').notEmpty();
        req.assert('pass','Pass Obrigatório').notEmpty();

        const erros = req.validationErrors();
        if(erros) return res.render('usuarios/form', {erros, usuario:[]});

        // Informa ao usuário que foi salvo com sucesso
        const usuario = req.body; 
        new UsuarioDao(req.connection)
            .add(usuario)
            .then( id => {
                usuario.id = id;
                app.get('io').emit('novoUsuario', usuario);
                res.render('usuarios/salvo');
            })
            .catch(next);
    });

    // Rota Remove usuario
    app.delete('/usuarios/:id', (req, res, next) => {
        console.log('Remove01');
        new UsuarioDao(req.connection)
            .remove(req.params.id, err => {
                if(err) return next(err);
                res.redirect('/usuarios');
                console.log('Remove02');

            });
    });

    // Rota Edita usuario
    app.get('/usuarios/form/:id', (req, res, next) => {

        new UsuarioDao(req.connection)
            .buscaPorId(req.params.id, (err, usuario)=>{
                if(err) return next(err);
                res.render('usuarios/form', {usuario});
            });
    });

    // Rota Altera usuario
    app.put('/usuarios/:id', (req, res, next)=>{
        const usuario = pluck(req.body, 'consultoria_id', 'nome', 'email', 'username', 'pass', 'fistel', 'uf', 'municipio', 'linha', 'id_ultima_coleta', 'mes', 'ano', 'id');
        new UsuarioDao(req.connection)
        .altera(req.body, err=>{
            if(err) return next(err);
            res.redirect('/usuarios');
        });

    });

    // Rota edita usuario (Minha Conta)
    app.get('/usuarios/minhaconta/:id', (req, res, next) => {
        console.log('Edita Usuario 01');
        new UsuarioDao(req.connection)
            .buscaPorId(req.params.id, (err, usuario)=>{
                if(err) return next(err);
                res.render('usuarios/minhaconta', {usuario});
            });
    });

};
