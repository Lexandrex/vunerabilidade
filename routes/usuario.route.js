import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import connect from '../db.js';

const router = express.Router();
const SECRET = process.env.JWT_SECRET;

// Middleware para proteger rotas
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });
    req.user = user;
    next();
  });
}

// GET – Listar todos os usuários (protegido)
router.get('/', authenticateToken, async (req, res) => {
  const db = await connect();
  try {
    const [results] = await db.execute('SELECT id, username, email FROM usuario');
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST – Registro de novo usuário
router.post('/register', async (req, res) => {
  const db = await connect();
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO usuario (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    );
    res.status(201).json({ id: result.insertId, username, email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST – Login com JWT
router.post('/login', async (req, res) => {
  const db = await connect();
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(
      'SELECT * FROM usuario WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const user = rows[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login bem-sucedido', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT – Atualizar usuário (protegido)
router.put('/:id', authenticateToken, async (req, res) => {
  const db = await connect();
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.execute(
      'UPDATE usuario SET username = ?, email = ?, password = ? WHERE id = ?',
      [username, email, hashedPassword, req.params.id]
    );
    res.status(200).json({ message: 'Usuário atualizado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE – Remover usuário (protegido)
router.delete('/:id', authenticateToken, async (req, res) => {
  const db = await connect();

  try {
    await db.execute('DELETE FROM usuario WHERE id = ?', [req.params.id]);
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
