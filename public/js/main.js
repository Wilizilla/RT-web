// public/js/main.js

const mainModal = document.getElementById('mainModal');
const basicCrudForm = document.getElementById('basicCrudForm');
const movimentacaoSection = document.getElementById('movimentacaoSection');
const crudDeleteButton = document.getElementById('crudDeleteButton');
const crudSubmitButton = document.getElementById('crudSubmitButton');
const currentStockDisplay = document.getElementById('currentStockDisplay');

let currentProductId = null;

// --- ABRIR E FECHAR MODAL ---

function openModal(mode, id = null) {
    mainModal.style.display = 'block';
    basicCrudForm.reset();
    currentProductId = id;

    if (mode === 'add') {
        document.getElementById('mainModalTitle').textContent = 'Adicionar Novo Produto';
        crudSubmitButton.textContent = 'Criar Produto';
        basicCrudForm.style.display = 'block';
        movimentacaoSection.style.display = 'none';
        crudDeleteButton.style.display = 'none';
    } 
}

async function openEditModal(id) {
    currentProductId = id;
    document.getElementById('mainModalTitle').textContent = 'Gerenciar Produto';
    crudSubmitButton.textContent = 'Salvar Dados';
    basicCrudForm.style.display = 'block';
    movimentacaoSection.style.display = 'block';
    crudDeleteButton.style.display = 'inline-block';
    
    document.getElementById('movimentacaoForm').reset();
    mainModal.style.display = 'block';

    try {
        const res = await fetch(`/api/${id}`);
        if (!res.ok) throw new Error('Erro ao carregar dados');
        const data = await res.json();

        document.getElementById('crudProductId').value = data.id_produto;
        document.getElementById('crudNomeProduto').value = data.nomeProduto;
        document.getElementById('crudTipoUnidade').value = data.tipoUnidade;

        currentStockDisplay.textContent = `${data.estoqueTotal} ${data.tipoUnidade}`;
        document.getElementById('movimentoProductId').value = data.id_produto;

    } catch (error) {
        alert('Erro ao carregar dados do produto: ' + error.message);
        closeModal('mainModal');
    }
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == mainModal) {
        closeModal('mainModal');
    }
}

// --- CRUD BÁSICO (Nome, Unidade) ---

basicCrudForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const mode = currentProductId ? 'edit' : 'add';
    const id = currentProductId;
    const url = mode === 'add' ? '/api' : `/api/${id}`;
    const method = mode === 'add' ? 'POST' : 'PUT';
    
    const formData = {
        nomeProduto: document.getElementById('crudNomeProduto').value,
        tipoUnidade: document.getElementById('crudTipoUnidade').value
    };

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(`Produto ${mode === 'add' ? 'criado' : 'atualizado'} com sucesso!`);
            closeModal('mainModal');
            window.location.reload(); 
        } else {
            const errorData = await response.json();
            alert(`Falha na operação: ${errorData.message}`);
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
});

// --- MOVIMENTAÇÃO DE ESTOQUE ---

async function moveStock(tipoMovimentacao) { // 1 = Entrada, 0 = Saída
    const qtd = parseInt(document.getElementById('qtdMovimentacao').value);

    if (isNaN(qtd) || qtd <= 0) {
        alert('Por favor, insira uma quantidade válida.');
        return;
    }

    const idLoteExistente = document.getElementById('loteExistenteId').value;
    const novaMarca = document.getElementById('novaMarca').value;
    const fornecedor = document.getElementById('fornecedor').value;
    const dataValidade = document.getElementById('dataValidade').value;
    const identificador = document.getElementById('identificador').value;
    
    let formData = {
        qtd_movimentacao: qtd,
        tipo_movimentacao: tipoMovimentacao,
        id_funcionario: 1 
    };
    
    if (tipoMovimentacao === 1) { // ENTRADA
        if (idLoteExistente) {
            formData.id_lote = idLoteExistente;
        } else if (novaMarca && fornecedor && dataValidade) {
            formData.nova_marca = novaMarca;
            formData.fornecedor = fornecedor;
            formData.data_validade = dataValidade;
            if (identificador) formData.identificador = identificador;
        } else {
             alert('Para ENTRADA, é obrigatório fornecer um ID de Lote Existente OU todos os dados de um NOVO LOTE (Marca, Fornecedor, Validade).');
             return;
        }
    } else { // SAÍDA
        if (!idLoteExistente) {
             alert('Para SAÍDA, é obrigatório fornecer o ID de um lote existente.');
             return;
        }
        formData.id_lote = idLoteExistente;
    }

    try {
        const response = await fetch(`/api/movimento/${currentProductId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert(`Estoque movido: ${tipoMovimentacao ? 'Entrada' : 'Saída'} de ${qtd}.`);
            document.getElementById('movimentacaoForm').reset();
            openEditModal(currentProductId); 
            await updateTableStock(currentProductId); 
        } else {
            const errorData = await response.json();
            alert(`Falha na movimentação: ${errorData.message}. Verifique IDs e dados do lote.`);
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}

// --- ATUALIZAÇÃO DA TABELA E DELETAR ---

async function updateTableStock(id) {
    try {
        const res = await fetch(`/api/${id}`);
        if (!res.ok) throw new Error('Erro ao carregar dados');
        const data = await res.json();
        
        const stockElement = document.getElementById(`estoque-${id}`);
        if (stockElement) {
            stockElement.textContent = data.estoqueTotal;
        }

    } catch (error) {
        console.error('Falha ao atualizar estoque na tabela.');
    }
}

async function deleteProduct() {
    if (!confirm('ATENÇÃO: Deseja realmente EXCLUIR este produto? Todos os lotes e movimentações associadas serão excluídos.')) {
        return;
    }

    try {
        const response = await fetch(`/api/${currentProductId}`, {
            method: 'DELETE'
        });

        if (response.status === 204) {
            alert('Produto excluído com sucesso!');
            closeModal('mainModal');
            window.location.reload();
        } else {
            const errorData = await response.json();
            alert(`Falha ao excluir: ${errorData.message}`);
        }
    } catch (error) {
        alert('Erro de conexão com o servidor.');
    }
}