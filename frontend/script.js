// ARQUIVO: frontend/script.js

const apiUrl = 'http://localhost:3000/tarefas';

// Elementos da lista de tarefas
const lista = document.getElementById('lista-tarefas');
const input = document.getElementById('input-tarefa');
const btnAdicionar = document.getElementById('btn-adicionar');

// --- NOVOS ELEMENTOS PARA NAVEGAÇÃO ---
const linkInicio = document.getElementById('link-inicio');
const linkTarefas = document.getElementById('link-tarefas');
const abaInicio = document.getElementById('inicio');
const abaTarefas = document.getElementById('tarefas');

// --- FUNÇÃO NOVA PARA MOSTRAR ABAS ---
function mostrarAba(idDaAba) {
    // Esconde todas as abas
    abaInicio.classList.add('hidden');
    abaTarefas.classList.add('hidden');
    // Remove o 'active' de todos os links
    linkInicio.classList.remove('active');
    linkTarefas.classList.remove('active');

    // Mostra a aba e ativa o link correto
    if (idDaAba === 'inicio') {
        abaInicio.classList.remove('hidden');
        linkInicio.classList.add('active');
    } else if (idDaAba === 'tarefas') {
        abaTarefas.classList.remove('hidden');
        linkTarefas.classList.add('active');
    }
}


// FUNÇÃO PARA CARREGAR AS TAREFAS DA API
async function carregarTarefas() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const tarefas = await response.json();
        lista.innerHTML = '';

        tarefas.forEach(tarefa => {
            const item = document.createElement('li');
            item.className = tarefa.concluida ? 'concluida' : '';
            
            const textoTarefa = document.createElement('span');
            textoTarefa.textContent = tarefa.titulo;

            const divBotoes = document.createElement('div');
            divBotoes.className = 'botoes-tarefa';

            const btnConcluir = document.createElement('button');
            btnConcluir.textContent = tarefa.concluida ? 'Desfazer' : 'Concluir';
            btnConcluir.className = 'btn-concluir';
            btnConcluir.addEventListener('click', () => marcarComoConcluida(tarefa.id));

            const btnDeletar = document.createElement('button');
            btnDeletar.textContent = 'Deletar';
            btnDeletar.className = 'btn-deletar';
            btnDeletar.addEventListener('click', () => deletarTarefa(tarefa.id));

            divBotoes.appendChild(btnConcluir);
            divBotoes.appendChild(btnDeletar);
            item.appendChild(textoTarefa);
            item.appendChild(divBotoes);
            lista.appendChild(item);
        });
    } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        lista.innerHTML = '<li>Erro ao carregar tarefas. A API está a rodar?</li>';
    }
}

// FUNÇÃO PARA ADICIONAR UMA NOVA TAREFA
async function adicionarTarefa() {
    const tituloDaTarefa = input.value.trim();
    if (tituloDaTarefa === '') return;

    try {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ titulo: tituloDaTarefa })
        });
        
        input.value = '';
        carregarTarefas();
        
        // Após adicionar, muda automaticamente para a aba de tarefas
        mostrarAba('tarefas');

    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        alert("Não foi possível adicionar a tarefa.");
    }
}

// FUNÇÃO PARA DELETAR UMA TAREFA
async function deletarTarefa(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'DELETE' });
        carregarTarefas();
    } catch (error) {
        console.error("Erro ao deletar tarefa:", error);
        alert("Não foi possível deletar a tarefa.");
    }
}

// FUNÇÃO PARA MARCAR COMO CONCLUÍDA
async function marcarComoConcluida(id) {
    try {
        await fetch(`${apiUrl}/${id}`, { method: 'PATCH' });
        carregarTarefas();
    } catch (error) {
        console.error("Erro ao marcar tarefa:", error);
        alert("Não foi possível marcar a tarefa.");
    }
}

// EVENT LISTENERS
btnAdicionar.addEventListener('click', adicionarTarefa);
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        adicionarTarefa();
    }
});

// Adiciona os eventos de clique para a navegação das abas
linkInicio.addEventListener('click', () => mostrarAba('inicio'));
linkTarefas.addEventListener('click', () => mostrarAba('tarefas'));


// CARREGAMENTO INICIAL
carregarTarefas(); // Carrega as tarefas em segundo plano
mostrarAba('inicio'); // Mostra a aba de início por defeito