// src/models/Produto.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Produto = sequelize.define('Produto', {
  id_produto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_produto' 
  },
  nomeProduto: {
    type: DataTypes.STRING(300),
    allowNull: false,
    field: 'nome_produto'
  },
  tipoUnidade: {
    type: DataTypes.STRING(300),
    allowNull: false,
    field: 'tipo_unidade'
  },
  criado: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'criado'
  }
}, {
  tableName: 'tb_produtos',
  timestamps: false 
});

module.exports = Produto;