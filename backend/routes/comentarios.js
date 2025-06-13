// routes/comentarios.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '179.251.17.221',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb'
};

// Buscar comentários por ID do post
router.get('/:postId', async(req, res) => {
    try {
        const { postId } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT c.*, u.username, u.foto_perfil
            FROM comentarios c
            JOIN usuarios u ON c.id_usuario = u.id
            WHERE c.id_postagem = ?
            ORDER BY c.data_criacao ASC
        `, [postId]);
        await connection.end();
        res.json(rows);
    } catch (err) {
        console.error('Erro ao buscar comentários:', err);
        res.status(500).json({ error: 'Erro ao buscar comentários' });
    }
});

// Criar um novo comentário
router.post('/', async(req, res) => {
    try {
        const { id_postagem, conteudo } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO comentarios (id_usuario, id_postagem, conteudo) VALUES (?, ?, ?)', [userId, id_postagem, conteudo]
        );
        await connection.end();

        res.status(201).json({ message: 'Comentário criado com sucesso' });
    } catch (err) {
        console.error('Erro ao criar comentário:', err);
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
});

module.exports = router;