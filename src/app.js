// src/app.js
const express = require('express');
const sequelize = require('./config/database');
const produtoRoutes = require('./routers/routes');
const path = require('path');

const Produto = require('./models/Produto');
const Movimentacao = require('./models/Movimentacao');
const Lote = require('./models/Lote'); // Inclui Lote

// --- Definição das Associações ---
Produto.hasMany(Movimentacao, { foreignKey: 'id_produto', as: 'movimentacoes' });
Movimentacao.belongsTo(Produto, { foreignKey: 'id_produto', as: 'produto' });

Produto.hasMany(Lote, { foreignKey: 'id_produto', as: 'lotes' });
Lote.belongsTo(Produto, { foreignKey: 'id_produto', as: 'produto' });

Movimentacao.belongsTo(Lote, { foreignKey: 'id_lote', as: 'lote' }); 
// Lote.hasMany(Movimentacao, { foreignKey: 'id_lote', as: 'movimentacoes' }); // Opcional
// --- Fim das Associações ---

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.use(express.static(path.join(__dirname, '..', 'public'))); 
app.use('/', produtoRoutes);

async function initDB() {
  try {
    await sequelize.authenticate();
    console.log('🔗 Conexão com o banco de dados estabelecida com sucesso.');
    // Importante: Em um projeto real, use Migrations. Aqui, 'sync' cria as tabelas se não existirem.
    // await sequelize.sync(); 
    console.log('✅ Tabelas sincronizadas (ou já existentes).');
  } catch (error) {
    console.error('❌ Não foi possível conectar ao banco de dados:', error);
  }
}

initDB();
module.exports = app;