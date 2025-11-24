// src/controllers/ProdutoController.js
const Produto = require('../models/Produto');
const Movimentacao = require('../models/Movimentacao'); 
const Lote = require('../models/Lote');
const { Sequelize } = require('sequelize'); 

// ------------------------------------
// READ: Lista de Produtos com Estoque Total Calculado
// ------------------------------------
exports.listarProdutos = async (req, res) => {
  try {
    const produtos = await Produto.findAll({
      attributes: [
        'id_produto',
        'nomeProduto',
        'tipoUnidade',
        [
            Sequelize.literal(
                'COALESCE(SUM(CASE WHEN movimentacoes.tipo_movimentacao = 1 THEN movimentacoes.qtd_movimentacao ELSE -movimentacoes.qtd_movimentacao END), 0)'
            ), 
            'estoqueTotal'
        ]
      ],
      include: [{
        model: Movimentacao,
        as: 'movimentacoes',
        attributes: [] 
      }],
      group: ['Produto.id_produto'],
    });
    
    res.render('index', { produtos });
  } catch (error) {
    console.error("Erro na listagem:", error);
    res.status(500).send({ message: 'Erro ao listar produtos', error: error.message });
  }
};

// ------------------------------------
// READ: Busca Produto por ID (inclui estoque)
// ------------------------------------
exports.buscarProdutoPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const produto = await Produto.findByPk(id);
        
        if (!produto) return res.status(404).send({ message: 'Produto não encontrado' });
        
        const result = await Produto.findByPk(id, {
            attributes: [
                'id_produto', 
                'nomeProduto', 
                'tipoUnidade',
                [Sequelize.literal(
                    'COALESCE(SUM(CASE WHEN movimentacoes.tipo_movimentacao = 1 THEN movimentacoes.qtd_movimentacao ELSE -movimentacoes.qtd_movimentacao END), 0)'
                ), 'estoqueTotal']
            ],
            include: [{ model: Movimentacao, as: 'movimentacoes', attributes: [] }],
            group: ['Produto.id_produto']
        });

        const responseData = {
            ...produto.get({ plain: true }), 
            estoqueTotal: result.dataValues.estoqueTotal 
        };

        res.status(200).send(responseData);
    } catch (error) {
        res.status(500).send({ message: 'Erro ao buscar produto', error: error.message });
    }
};

// ------------------------------------
// UPDATE: Adiciona ou Subtrai estoque (Nova Movimentação)
// ------------------------------------
exports.movimentarEstoque = async (req, res) => {
    const { 
        qtd_movimentacao, 
        tipo_movimentacao, 
        id_lote, // ID de um lote existente
        nova_marca, // Para criar um novo lote
        fornecedor, 
        data_validade,
        identificador,
        id_funcionario = 1
    } = req.body;
    
    let loteIdParaMovimentacao = id_lote;

    try {
        // --- 1. Lógica para ENTRADA com Criação de Lote ---
        if (tipo_movimentacao == 1) { 
            if (id_lote) {
                // Se for fornecido um lote existente, apenas o utilizamos.
                loteIdParaMovimentacao = id_lote;
            } else if (nova_marca && fornecedor && data_validade) {
                // Se for fornecida a Marca, Fornecedor e Validade, criamos um novo lote.
                const novoLote = await Lote.create({
                    idProduto: req.params.id,
                    marca: nova_marca,
                    fornecedor: fornecedor,
                    dataValidade: data_validade, 
                    identificador: identificador || null
                });
                loteIdParaMovimentacao = novoLote.id_lote;
            } else {
                 return res.status(400).send({ message: 'Para Entradas, é obrigatório fornecer um ID de lote existente ou todos os dados (Marca, Fornecedor, Validade) para criar um novo lote.' });
            }
        }
        
        // --- 2. Lógica para SAÍDA ---
        if (tipo_movimentacao == 0) {
             if (!id_lote) {
                 return res.status(400).send({ message: 'Para Saídas, é obrigatório fornecer o ID de um lote existente.' });
             }
             loteIdParaMovimentacao = id_lote; // Usa o lote fornecido na saída
        }

        // --- 3. Criar a Movimentação ---
        const novaMovimentacao = await Movimentacao.create({
            idProduto: req.params.id,
            idLote: loteIdParaMovimentacao, // Deve ser NOT NULL
            idFuncionario: id_funcionario,
            qtdMovimentacao: qtd_movimentacao,
            tipoMovimentacao: tipo_movimentacao 
        });

        res.status(201).send(novaMovimentacao);

    } catch (error) {
        console.error("Erro na movimentação de estoque:", error);
        res.status(400).send({ message: 'Erro ao movimentar estoque. Verifique se o lote existe.', error: error.message });
    }
};

// ------------------------------------
// Outras Funções do CRUD (Criar, Atualizar Produto, Deletar)
// ------------------------------------

exports.criarProduto = async (req, res) => {
  try {
    const novoProduto = await Produto.create(req.body);
    res.status(201).send(novoProduto);
  } catch (error) {
    res.status(400).send({ message: 'Erro ao criar produto', error: error.message });
  }
};

exports.atualizarProduto = async (req, res) => {
  try {
    const [updated] = await Produto.update(req.body, {
      where: { id_produto: req.params.id }
    });
    if (updated) {
      const produtoAtualizado = await Produto.findByPk(req.params.id);
      return res.status(200).send(produtoAtualizado);
    }
    throw new Error('Produto não encontrado');
  } catch (error) {
    res.status(404).send({ message: 'Erro ao atualizar produto', error: error.message });
  }
};

exports.deletarProduto = async (req, res) => {
  try {
    // Requer deleção em cascata se usar um ORM/Migrations. Aqui, deletamos as movimentações manualmente.
    await Movimentacao.destroy({ where: { id_produto: req.params.id } });
    await Lote.destroy({ where: { id_produto: req.params.id } }); // Deleta lotes
    
    const deleted = await Produto.destroy({
      where: { id_produto: req.params.id }
    });
    
    if (deleted) {
      return res.status(204).send(); 
    }
    throw new Error('Produto não encontrado');
  } catch (error) {
    res.status(500).send({ message: 'Erro ao deletar produto', error: error.message });
  }
};