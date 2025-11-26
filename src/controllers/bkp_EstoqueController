// src/controllers/EstoqueController.js

const EstoqueModel = require('../models/EstoqueModel'); // Importa o Model

const EstoqueController = {
    /**
     * Renderiza a página principal com a lista de estoque.
     * Rota: GET /
     */
    listarEstoque: async (req, res) => {
        try {
            // 1. Chama o Model para calcular o estoque atualizado
            const produtos = await EstoqueModel.calcularEstoque();
            
            // 2. Renderiza a view (index.ejs) passando os dados
            res.render('index', { produtos: produtos });
        } catch (error) {
            console.error('Erro ao listar estoque:', error);
            // Em caso de erro, retorna um erro 500
            res.status(500).send('Erro interno do servidor ao carregar estoque.');
        }
    },

    /**
     * Adiciona um novo produto ao estoque (e a movimentação inicial).
     * Rota: POST /produtos
     */
    adicionarProduto: async (req, res) => {
        // Extrai os dados do corpo da requisição POST
        const { nome, unidade, quantidade } = req.body;
        // Pelo seu banco de dados, o funcionário padrão é o de ID 1 (Julius Rock)
        const idFuncionarioPadrao = 1; 

        // Validação simples
        if (!nome || !unidade || !quantidade || isNaN(parseInt(quantidade))) {
            return res.status(400).json({ success: false, message: 'Dados incompletos ou inválidos.' });
        }
        
        try {
            // Chama o Model para realizar a transação de adição
            const idNovoProduto = await EstoqueModel.adicionarProdutoComMovimentacao(
                nome, 
                unidade, 
                parseInt(quantidade), 
                idFuncionarioPadrao
            );

            // Resposta JSON para o AJAX no frontend
            res.status(201).json({ success: true, message: 'Produto adicionado com sucesso!', id: idNovoProduto });
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
            res.status(500).json({ success: false, message: 'Erro ao adicionar produto no banco de dados.' });
        }
    },
    
    /**
     * Adiciona uma movimentação de entrada ou saída para um produto existente.
     * Rota: POST /movimentacoes
     */
    movimentarEstoque: async (req, res) => {
        // Extrai dados da requisição
        const { id_produto, quantidade, tipo_movimentacao } = req.body; // tipo_movimentacao: 'entrada' ou 'saida'
        const idFuncionarioPadrao = 1; // Padrão ID 1

        const tipoMov = (tipo_movimentacao === 'entrada') ? 1 : 0; // Converte string para 1 (entrada) ou 0 (saída)

        // Validação
        if (!id_produto || !quantidade || isNaN(parseInt(quantidade))) {
             return res.status(400).json({ success: false, message: 'Dados de movimentação incompletos ou inválidos.' });
        }

        try {
            // Chama o Model para adicionar a movimentação
            const idMovimentacao = await EstoqueModel.adicionarMovimentacao(
                parseInt(id_produto), 
                idFuncionarioPadrao, 
                parseInt(quantidade), 
                tipoMov
            );
            
            // Resposta para o AJAX
            res.json({ success: true, message: 'Movimentação registrada com sucesso!', id: idMovimentacao });
        } catch (error) {
            console.error('Erro ao registrar movimentação:', error);
            res.status(500).json({ success: false, message: 'Erro ao registrar movimentação.' });
        }
    },

    /**
     * Exclui um produto e suas movimentações.
     * Rota: DELETE /produtos/:id
     */
    excluirProduto: async (req, res) => {
        const idProduto = req.params.id; // Pega o ID da URL

        try {
            const sucesso = await EstoqueModel.excluirProduto(idProduto);
            
            if (sucesso) {
                // Resposta para o AJAX
                res.json({ success: true, message: `Produto ID ${idProduto} excluído com sucesso.` });
            } else {
                res.status(404).json({ success: false, message: `Produto ID ${idProduto} não encontrado.` });
            }
        } catch (error) {
            console.error('Erro ao excluir produto:', error);
            res.status(500).json({ success: false, message: 'Erro ao excluir o produto.' });
        }
    }
};

module.exports = EstoqueController;