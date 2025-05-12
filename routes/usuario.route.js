import express from 'express';
const router = express.Router();
import connect from '../db.js';

// GET – Listar todos os usuários
router.get('/', async (req, res) => {
    const db = await connect();
    db.query('SELECT * FROM usuario')
        .then(([results]) => res.status(200).json(results))
        .catch(err => res.status(500).send(err));
});

// POST – Criar novo usuário
router.post('/', async (req, res) => {
    const db = await connect();
    const { username, email, password } = req.body;
    const query = `INSERT INTO usuario (username, email, password) VALUES ('${username}', '${email}', '${password}')`;
    db.query(query)
        .then(([result]) => {
            res.status(201).json({ id: result.insertId, username, email });
        })
        .catch(err => res.status(500).send(err));
});

// PUT – Atualizar usuário existente
router.put('/:id', async (req, res) => {
    const db = await connect();
    const { username, email, password } = req.body;
    const query = `UPDATE usuario SET username='${username}', email='${email}', password='${password}' WHERE id=${req.params.id}`;
    db.query(query)
        .then(() => res.status(200).send('Usuário atualizado com sucesso'))
        .catch(err => res.status(500).send(err));
});

// DELETE – Remover usuário
router.delete('/:id', async (req, res) => {
    const db = await connect();
    const query = `DELETE FROM usuario WHERE id=${req.params.id}`;
    db.query(query)
        .then(() => res.status(200).send('Usuário deletado com sucesso'))
        .catch(err => res.status(500).send(err));
});

// POST – Login de usuário (v1.0 simples, sem hashing)
router.post('/login', async (req, res) => {
  const db = await connect();
  const { username, password } = req.body;

  // Vulnerável por ser plain-text, mas atende seu objetivo inicial
  const query = `
    SELECT id, username, email
      FROM usuario
     WHERE username = '${username}'
       AND password = '${password}'
  `;

  db.query(query)
    .then(([results]) => {
      if (results.length === 1) {
        // Usuário encontrado: retorna dados (ou um token)
        res.status(200).json({ success: true, message: `Usuário ${username} logado com sucesso`, user: results[0] });
      } else {
        // Não autenticado
        res.status(401).json({ success: false, message: 'Credenciais inválidas' });
      }
    })
    .catch(err => res.status(500).json({ success: false, error: err.message }));
});


export default router;
