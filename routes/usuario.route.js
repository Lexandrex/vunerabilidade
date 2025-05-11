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

export default router;
