// src/models/Movimentacao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Movimentacao = sequelize.define('Movimentacao', {
  id_movimentacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_movimentacao'
  },
  idProduto: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_produto'
  },
  idLote: {
    type: DataTypes.INTEGER,
    allowNull: false, // <-- NOT NULL conforme seu SQL
    field: 'id_lote'
  },
  idFuncionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_funcionario'
  },
  qtdMovimentacao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'qtd_movimentacao'
  },
  tipoMovimentacao: {
    type: DataTypes.BOOLEAN, // 1: Entrada, 0: Saída
    allowNull: false,
    field: 'tipo_movimentacao'
  }
}, {
  tableName: 'tb_movimentacoes',
  timestamps: false
});

module.exports = Movimentacao;