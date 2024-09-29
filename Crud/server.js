const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = 3000;
const path = require('path'); // Importando o módulo 'path'

// Conexão com o MongoDB Atlas
const mongoDBURI = 'mongodb+srv://fredsonoliveira:son7754metal@clusterbackend.hswu0.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBackEnd';
mongoose.connect(mongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB Atlas'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Modelagem do Agendamento
const agendamentoSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    data: { type: String, required: true },
    hora: { type: String, required: true }
});

const Agendamento = mongoose.model('Agendamento', agendamentoSchema);

app.use(bodyParser.json());

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname))); // Serve arquivos do diretório raiz

// Rota para servir o arquivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para criar um agendamento
app.post('/agendamentos', async (req, res) => {
    const { nome, data, hora } = req.body;
    const novoAgendamento = new Agendamento({ nome, data, hora });
    
    try {
        const savedAgendamento = await novoAgendamento.save();
        res.status(201).json(savedAgendamento);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao criar agendamento', error });
    }
});

// Rota para ler todos os agendamentos
app.get('/agendamentos', async (req, res) => {
    try {
        const agendamentos = await Agendamento.find();
        res.json(agendamentos);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamentos', error });
    }
});

// Rota para ler um agendamento específico
app.get('/agendamentos/:id', async (req, res) => {
    try {
        const agendamento = await Agendamento.findById(req.params.id);
        if (agendamento) {
            res.json(agendamento);
        } else {
            res.status(404).json({ message: 'Agendamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar agendamento', error });
    }
});

// Rota para atualizar um agendamento
app.put('/agendamentos/:id', async (req, res) => {
    try {
        const agendamento = await Agendamento.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (agendamento) {
            res.json(agendamento);
        } else {
            res.status(404).json({ message: 'Agendamento não encontrado' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Erro ao atualizar agendamento', error });
    }
});

// Rota para deletar um agendamento
app.delete('/agendamentos/:id', async (req, res) => {
    try {
        const agendamento = await Agendamento.findByIdAndDelete(req.params.id);
        if (agendamento) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Agendamento não encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao deletar agendamento', error });
    }
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});