// EXPRESS serve para trabalhar nas rotas do do site

const express = require ('express'); // importação de módulo da pasta node-modules
const app = express(); // por convenção o nome é app, mas poderia ser outro nome
const porta = 3303; // a porta normal seria 3000
const routes = require ('./routes.js') // puxa as rotas
const path = require ('path'); // modulo para manipular caminhos de arquivos e diretórios em diferentes SOs
const globalMiddleware = require ('./src/middlewares/globalMiddleware.js') // configuração do middleware global

app.use(express.urlencoded({extended: true})); // midware do express - Permite que o servidor leia dados de formulários que chegam por POST
app.set('views', path.resolve(__dirname, 'src','views')); //camiho das views usando path
app.set('view engine', 'ejs'); // configura uma engine para renderizar as views htmls 
app.use(express.static(path.resolve(__dirname, 'public'))); // configura o acesso a o css/ imagens e outros arquivos necessários para montar a página
app.use(globalMiddleware); // middleware aplicado deta forma acaba sendo usado em todas rotas.
app.use(routes); 

// função para o servidor escutar alguma porta
app.listen (porta, (error) => {
    if(error) {
        console.log("Erro: servidor offline")
        return;
    }
    console.log("Sucesso: servidor online");
    console.log ('Acessar http://localhost:3303'); // normalmente é a porta 3000, mas já está em uso no meu servidor
});


