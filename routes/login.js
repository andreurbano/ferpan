// 
module.exports = app => {

    // Rota chama o formulário de login
    app.get('/login/', function (req, res) {
        res.render('login/form', { });
    });

};
