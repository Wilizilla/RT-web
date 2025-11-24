// src/models/Lote.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Lote = sequelize.define('Lote', {
  id_lote: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_lote'
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_produto' 
  },
  marca: { 
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'marca'
  },
  fornecedor: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'fornecedor'
  },
  dataValidade: {
    type: DataTypes.DATEONLY, 
    allowNull: false,
    field: 'data_validade'
  },
  identificador: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'identificador'
  }
}, {
  tableName: 'tb_lotes',
  timestamps: false
});

module.exports = Lote;