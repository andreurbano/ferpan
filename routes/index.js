// 
module.exports = app => {

  // Rota chama o formulário de login
  
  app.get('/', function (req, res) {
      console.log('Passei aqui 01');
      res.render('index', { });
  });

/*
  app.get('/', function (req, res) {
    res.send('root');
  });
*/
  



};
