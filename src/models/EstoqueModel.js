// src/models/EstoqueModel.js

const pool = require('../config/db'); // Importa o pool de conexões

// O Model é um objeto que contém funções assíncronas para interação com o DB

const EstoqueModel = {
    /**
     * Calcula o estoque atual de todos os produtos.
     * Retorna uma lista de produtos com a quantidade total calculada.
     */
    calcularEstoque: async () => {
        // Consulta SQL complexa usando JOIN e SUM para calcular o estoque.
        // O estoque é a soma das movimentações de 'entrada' (tipo_movimentacao = 1)
        // menos a soma das movimentações de 'saída' (tipo_movimentacao = 0).
        const query = `
            SELECT
                p.id_produto,
                p.nome_produto,
                p.tipo_unidade,
                COALESCE(SUM(CASE WHEN m.tipo_movimentacao = 1 THEN m.qtd_movimentacao ELSE 0 END), 0) -
                COALESCE(SUM(CASE WHEN m.tipo_movimentacao = 0 THEN m.qtd_movimentacao ELSE 0 END), 0) AS quant_estoque
            FROM
                tb_produtos p
            LEFT JOIN
                tb_movimentacoes m ON p.id_produto = m.id_produto
            GROUP BY
                p.id_produto, p.nome_produto, p.tipo_unidade
            ORDER BY
                p.nome_produto;
        `;
        const [rows] = await pool.query(query);
        return rows;
    },

    /**
     * Busca um produto específico pelo ID.
     */
    buscarProdutoPorId: async (id_produto) => {
        const query = 'SELECT * FROM tb_produtos WHERE id_produto = ?';
        const [rows] = await pool.query(query, [id_produto]);
        return rows[0]; // Retorna o primeiro (e único) resultado
    },

    /**
     * Adiciona um novo produto e sua primeira movimentação de estoque (entrada).
     */
    adicionarProdutoComMovimentacao: async (nome, unidade, quantidade, idFuncionario) => {
        const connection = await pool.getConnection(); // Obtém uma conexão
        await connection.beginTransaction(); // Inicia uma transação para garantir atomicidade

        try {
            // 1. Inserir o novo produto
            const queryProduto = 'INSERT INTO tb_produtos (nome_produto, tipo_unidade) VALUES (?, ?)';
            const [resultProduto] = await connection.query(queryProduto, [nome, unidade]);
            const idProduto = resultProduto.insertId;

            // 2. Inserir a movimentação inicial (ENTRADA = 1)
            const queryMov = 'INSERT INTO tb_movimentacoes (id_produto, id_funcionario, qtd_movimentacao, tipo_movimentacao) VALUES (?, ?, ?, 1)';
            await connection.query(queryMov, [idProduto, idFuncionario, quantidade]);

            await connection.commit(); // Confirma as operações
            connection.release(); // Libera a conexão
            return idProduto;
        } catch (error) {
            await connection.rollback(); // Desfaz tudo em caso de erro
            connection.release();
            throw error;
        }
    },

    /**
     * Adiciona uma nova movimentação (entrada ou saída) para um produto existente.
     */
    adicionarMovimentacao: async (idProduto, idFuncionario, quantidade, tipoMovimentacao) => {
        // tipoMovimentacao: 1 para entrada, 0 para saída (booleano/tinyint)
        const query = 'INSERT INTO tb_movimentacoes (id_produto, id_funcionario, qtd_movimentacao, tipo_movimentacao) VALUES (?, ?, ?, ?)';
        const [result] = await pool.query(query, [idProduto, idFuncionario, quantidade, tipoMovimentacao]);
        return result.insertId;
    },
    
    /**
     * Exclui um produto e todas as suas movimentações associadas.
     * @param {number} id_produto - O ID do produto a ser excluído.
     */
    excluirProduto: async (id_produto) => {
        const connection = await pool.getConnection(); // Obtém uma conexão
        await connection.beginTransaction(); // Inicia transação para garantir atomicidade

        try {
            // 1. Excluir as movimentações primeiro (por causa da FK)
            const queryMov = 'DELETE FROM tb_movimentacoes WHERE id_produto = ?';
            await connection.query(queryMov, [id_produto]);
            
            // 2. Excluir o produto
            const queryProd = 'DELETE FROM tb_produtos WHERE id_produto = ?';
            const [result] = await connection.query(queryProd, [id_produto]);

            await connection.commit(); // Confirma as operações
            connection.release(); // Libera a conexão
            return result.affectedRows > 0; // Retorna true se um produto foi excluído
        } catch (error) {
            await connection.rollback(); // Desfaz tudo em caso de erro
            connection.release();
            throw error;
        }
    }
};

module.exports = EstoqueModel;