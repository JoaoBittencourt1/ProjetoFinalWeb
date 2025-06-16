const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const dbConfig = {
    host: '177.149.92.88',
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


router.get('/', async(req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);

        const [posts] = await connection.execute(`
            SELECT 
                p.*, 
                u.username, 
                u.foto_perfil,
                IFNULL(likes.likes, 0) AS likes,
                IFNULL(dislikes.dislikes, 0) AS dislikes
            FROM postagens p
            JOIN usuarios u ON p.id_usuario = u.id
            LEFT JOIN (
                SELECT id_alvo, COUNT(*) AS likes 
                FROM avaliacoes 
                WHERE tipo_alvo = 'postagem' AND valor = 'positivo' 
                GROUP BY id_alvo
            ) AS likes ON likes.id_alvo = p.id
            LEFT JOIN (
                SELECT id_alvo, COUNT(*) AS dislikes 
                FROM avaliacoes 
                WHERE tipo_alvo = 'postagem' AND valor = 'negativo' 
                GROUP BY id_alvo
            ) AS dislikes ON dislikes.id_alvo = p.id
            WHERE p.id_grupo IS NULL
            ORDER BY p.data_criacao DESC
        `);

        await connection.end();
        res.json(posts);
    } catch (error) {
        console.error('Erro ao buscar postagens:', error);
        res.status(500).json({ message: 'Erro ao buscar postagens' });
    }
});


router.post('/', upload.single('imagem'), async(req, res) => {
    try {
        const { conteudo, tipo, id_grupo } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }

        let conteudoFinal = conteudo;
        if (tipo === 'imagem' && req.file) {
            conteudoFinal = req.file.filename;
        }

        const connection = await mysql.createConnection(dbConfig);

        const query = id_grupo ?
            'INSERT INTO postagens (id_usuario, conteudo, tipo, id_grupo) VALUES (?, ?, ?, ?)' :
            'INSERT INTO postagens (id_usuario, conteudo, tipo) VALUES (?, ?, ?)';

        const params = id_grupo ?
            [userId, conteudoFinal, tipo, id_grupo] :
            [userId, conteudoFinal, tipo];

        const [result] = await connection.execute(query, params);

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


router.get('/grupo/:id_grupo', async(req, res) => {
    const { id_grupo } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);

        const [rows] = await connection.execute(`
            SELECT 
                p.*, 
                u.username, 
                u.foto_perfil,
                IFNULL(likes.likes, 0) AS likes,
                IFNULL(dislikes.dislikes, 0) AS dislikes
            FROM postagens p
            JOIN usuarios u ON p.id_usuario = u.id
            LEFT JOIN (
                SELECT id_alvo, COUNT(*) AS likes 
                FROM avaliacoes 
                WHERE tipo_alvo = 'postagem' AND valor = 'positivo' 
                GROUP BY id_alvo
            ) AS likes ON likes.id_alvo = p.id
            LEFT JOIN (
                SELECT id_alvo, COUNT(*) AS dislikes 
                FROM avaliacoes 
                WHERE tipo_alvo = 'postagem' AND valor = 'negativo' 
                GROUP BY id_alvo
            ) AS dislikes ON dislikes.id_alvo = p.id
            WHERE p.id_grupo = ?
            ORDER BY p.data_criacao DESC
        `, [id_grupo]);

        await connection.end();
        res.json(rows);
    } catch (error) {
        console.error('Erro ao buscar posts por grupo:', error);
        res.status(500).json({ error: 'Erro ao buscar posts por grupo' });
    }
});


router.get('/grupo-mensagens/:grupoId', async(req, res) => {
    const { grupoId } = req.params;
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [mensagens] = await connection.execute(`
            SELECT gm.*, u.username, u.foto_perfil
            FROM grupo_mensagens gm
            JOIN usuarios u ON gm.id_usuario = u.id
            WHERE gm.id_grupo = ?
            ORDER BY gm.data_criacao DESC
        `, [grupoId]);

        await connection.end();
        res.json(mensagens);
    } catch (error) {
        console.error('Erro ao buscar mensagens do grupo:', error);
        res.status(500).json({ message: 'Erro ao buscar mensagens do grupo' });
    }
});


router.post('/grupo-mensagens', async(req, res) => {
    try {
        const { grupoId, conteudo } = req.body;
        const userId = req.session.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado' });
        }
        if (!grupoId || !conteudo) {
            return res.status(400).json({ error: 'Grupo e conteúdo são obrigatórios' });
        }

        const connection = await mysql.createConnection(dbConfig);
        const [result] = await connection.execute(
            'INSERT INTO grupo_mensagens (id_grupo, id_usuario, conteudo) VALUES (?, ?, ?)', [grupoId, userId, conteudo]
        );

        await connection.end();
        res.status(201).json({
            id: result.insertId,
            message: 'Mensagem criada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao criar mensagem do grupo:', error);
        res.status(500).json({ error: 'Erro ao criar mensagem do grupo' });
    }
});

module.exports = router;