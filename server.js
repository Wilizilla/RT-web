// server.js

// Importa o módulo Express
const express = require('express');
// Importa o Controller que contém a lógica das rotas
const EstoqueController = require('./src/controllers/EstoqueController');
// Importa o path para ajudar a resolver caminhos de arquivos
const path = require('path');

// Inicializa a aplicação Express
const app = express();
const PORT = process.env.PORT || 3303;

// Configuração do EJS como motor de templates
app.set('view engine', 'ejs');
// Define o diretório onde as views (.ejs) estão localizadas
app.set('views', path.join(__dirname, 'src', 'views'));

// Middleware para servir arquivos estáticos (CSS, JS do frontend, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para processar dados de formulário (url-encoded)
app.use(express.urlencoded({ extended: true }));
// Middleware para processar dados enviados em formato JSON (usado para AJAX/fetch)
app.use(express.json());

// --- Rotas da Aplicação ---

// Rota principal: GET /
// Exibe a lista de produtos em estoque
app.get('/', EstoqueController.listarEstoque);

// Rota para adicionar um novo produto (criação e primeira movimentação)
// POST /produtos
app.post('/produtos', EstoqueController.adicionarProduto);

// Rota para realizar uma movimentação (entrada/saída) em um produto existente
// POST /movimentacoes
app.post('/movimentacoes', EstoqueController.movimentarEstoque);

// Rota para excluir um produto
// DELETE /produtos/:id
app.delete('/produtos/:id', EstoqueController.excluirProduto);


// Inicia o servidor e escuta na porta definida
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});