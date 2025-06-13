const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');


const dbConfig = {
  host: '179.251.17.221',
  user: 'usuariodb',
  password: 'Userdb123&',
  database: 'ProjetoWeb'
};


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });


router.get('/', async (req, res) => {
  try {
    const connection = await mysql.createConnection(dbConfig);
  
    const [posts] = await connection.execute(`
      SELECT 
        p.*,
        u.username,
        u.foto_perfil
      FROM postagens p
      JOIN usuarios u ON p.id_usuario = u.id
      ORDER BY p.data_criacao DESC
    `);
    
    await connection.end();
    
    res.json(posts);
  } catch (error) {
    console.error('Erro ao buscar postagens:', error);
    res.status(500).json({ message: 'Erro ao buscar postagens' });
  }
});


router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    const { conteudo, tipo } = req.body;
    
    const userId = req.session.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    let conteudoFinal = conteudo;
    if (tipo === 'imagem' && req.file) {
      conteudoFinal = req.file.filename;
    }

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      'INSERT INTO postagens (id_usuario, conteudo, tipo) VALUES (?, ?, ?)',
      [userId, conteudoFinal, tipo]
    );
    await connection.end();

    res.status(201).json({
      id: result.insertId,
      message: 'Post criado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar post' });
  }
});

module.exports = router; 