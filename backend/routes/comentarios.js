const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '179.251.253.17',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb'
};


router.get('/:postId', async(req, res) => {
    try {
        const { postId } = req.params;
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute(`
            SELECT 
                c.*, 
                u.username, 
                u.foto_perfil,
                IFNULL(likes.likes, 0) AS likes,
                IFNULL(dislikes.dislikes, 0) AS dislikes
            FROM comentarios c
            JOIN usuarios u ON c.id_usuario = u.id
            LEFT JOIN (
                SELECT id_alvo, COUNT(*) AS likes 
                FROM avaliacoes 
                WHERE tipo_alvo = 'comentario' AND valor = 'positivo' 
                GROUP BY id_alvo
            ) AS likes ON likes.id_alvo = c.id
            LEFT JOIN (
                SELECT id_alvo, COUNT(*) AS dislikes 
                FROM avaliacoes 
                WHERE tipo_alvo = 'comentario' AND valor = 'negativo' 
                GROUP BY id_alvo
            ) AS dislikes ON dislikes.id_alvo = c.id
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


router.post('/', async(req, res) => {
    try {
        const { id_postagem, conteudo, id_comentario_pai = null } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        const connection = await mysql.createConnection(dbConfig);
        await connection.execute(
            'INSERT INTO comentarios (id_usuario, id_postagem, id_comentario_pai, conteudo) VALUES (?, ?, ?, ?)', [userId, id_postagem, id_comentario_pai, conteudo]
        );
        await connection.end();

        res.status(201).json({ message: 'Comentário criado com sucesso' });
    } catch (err) {
        console.error('Erro ao criar comentário:', err);
        res.status(500).json({ error: 'Erro ao criar comentário' });
    }
});

module.exports = router;