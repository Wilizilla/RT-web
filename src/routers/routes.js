const express = require ('express');
const route = express.Router(); // configuração inicial 
const dataController = require ('../controllers/dataController'); // não precisaria identificar a extensão do arquivo

//rotas banco de dados
route.get ('/' , dataController.productSearch); // rota para listar os produtos
//route.update ('/' , dataController.productUpdate);

module.exports = route;