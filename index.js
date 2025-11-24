// server.js
const app = require('./src/app');

const PORT = 3303;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});

/*

// EXPRESS serve para trabalhar nas rotas do do site

const express = require ('express'); // importação de módulo da pasta node-modules
const app = express(); // por convenção o nome é app, mas poderia ser outro nome
const porta = 3303; // a porta normal seria 3000
const routes = require ('./src/routers/routes.js') // puxa as rotas
const path = require ('path'); // modulo para manipular caminhos de arquivos e diretórios em diferentes SOs
const globalMiddleware = require ('./src/middlewares/globalMiddleware.js') // configuração do middleware global

const app = require('./src/app');

// função para o servidor escutar alguma porta
app.listen (porta, (error) => {
    if(error) {
        console.log("Erro: servidor offline")
        return;
    }
    console.log("Sucesso: servidor online");
    console.log ('Acessar http://localhost:3303'); // normalmente é a porta 3000, mas já está em uso no meu servidor
});
*/

