// EXPRESS serve para trabalhar nas rotas do do site

const express = require ('express'); // importação de módulo da pasta node-modules
const app = express(); // por convenção o nome é app, mas poderia ser outro nome
const port = 3303; // a porta normal seria 3000


// função para o servidor escutar alguma porta
app.listen (3303, (error) => {
    if(error) {
        console.log("Erro: servidor offline")
        return;
    }
    console.log("Sucesso: servidor online");
});

// função para get na raiz do site (requisição e resposta)
app.get('/', (req, res) => {
    res.send ('Olá, mundo!');
});