

const express = require('express');
const cors = require('cors'); // Importa o CORS
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(cors()); // Habilita o CORS para todas as rotas

const tarefasFilePath = path.join(__dirname, 'tarefas.json');

const lerTarefas = () => JSON.parse(fs.readFileSync(tarefasFilePath, 'utf-8'));
const escreverTarefas = (dados) => fs.writeFileSync(tarefasFilePath, JSON.stringify(dados, null, 2));

// ROTA GET: Listar todas as tarefas
app.get('/tarefas', (req, res) => {
  res.status(200).json(lerTarefas());
});

// ROTA POST: Criar uma nova tarefa
app.post('/tarefas', (req, res) => {
  const tarefas = lerTarefas();
  const novaTarefa = {
    id: Date.now(),
    titulo: req.body.titulo,
    concluida: false
  };
  tarefas.push(novaTarefa);
  escreverTarefas(tarefas);
  res.status(201).json(novaTarefa);
});

// ROTA DELETE: Remover uma tarefa por ID
app.delete('/tarefas/:id', (req, res) => {
  let tarefas = lerTarefas();
  const idParaDeletar = parseInt(req.params.id);
  const tarefasRestantes = tarefas.filter(tarefa => tarefa.id !== idParaDeletar);
  escreverTarefas(tarefasRestantes);
  res.status(204).send();
});

// ROTA PATCH: Atualizar o status 'concluida' de uma tarefa
app.patch('/tarefas/:id', (req, res) => {
    let tarefas = lerTarefas();
    const idParaAtualizar = parseInt(req.params.id);
    const tarefa = tarefas.find(t => t.id === idParaAtualizar);

    if (tarefa) {
        tarefa.concluida = !tarefa.concluida; // Inverte o status (true -> false, false -> true)
        escreverTarefas(tarefas);
        res.status(200).json(tarefa);
    } else {
        res.status(404).json({ erro: "Tarefa não encontrada." });
    }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}. Acesse em http://localhost:3000/tarefas`);
});
