// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

let users = []; // Simulando um banco de dados em memória

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rota para retornar todos os usuários
app.get('/users', (req, res) => {
  res.json(users);
});

// Rota para criar um novo usuário
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  const user = { id: Date.now(), name, email };
  users.push(user);
  res.status(201).json(user);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
