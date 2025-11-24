const express = require ('express');
const route = express.Router(); // configuração inicial 
//const TesteController = require ('../controllers/TesteController'); // não precisaria identificar a extensão do arquivo

//rotas banco de dados
//route.get ('/' , TesteController.indexTest); // rota para listar os produtos
//route.update ('/' , dataController.productUpdate);

const produtoController = require('../controllers/ProdutoController');

route.get('/', produtoController.listarProdutos);
route.post('/api', produtoController.criarProduto);         
route.get('/api/:id', produtoController.buscarProdutoPorId); 
route.put('/api/:id', produtoController.atualizarProduto);   
route.delete('/api/:id', produtoController.deletarProduto);  
route.post('/api/movimento/:id', produtoController.movimentarEstoque);

module.exports = route;