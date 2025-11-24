const express = require ('express');
const route = express.Router(); // configuração inicial 
const TesteController = require ('../controllers/TesteController'); // não precisaria identificar a extensão do arquivo



//rotas banco de dados
route.get ('/' , TesteController.indexTest); // rota para listar os produtos
//route.update ('/' , dataController.productUpdate);

module.exports = route;