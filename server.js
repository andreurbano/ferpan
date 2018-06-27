                              // Importa módulo - require
const app = require('./custon-express')
, http = require('http').Server(app)
, io = require('socket.io') (http)
, port = process.env.PORT || 3000;

app.set('io', io);

// start the server
http.listen(3000, () =>
  console.log('Servidor rodando em http://ferpan.com.br:' + port))



