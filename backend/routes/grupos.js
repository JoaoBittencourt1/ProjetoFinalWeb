const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '179.251.17.221',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb',
};

// Criar grupo
router.post('/criar', async(req, res) => {
    const { nome, descricao } = req.body;

    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    const id_usuario = req.session.userId;

    try {
        const conn = await mysql.createConnection(dbConfig);
        await conn.beginTransaction();

        const [grupoResult] = await conn.execute(
            'INSERT INTO grupos (nome, descricao) VALUES (?, ?)', [nome, descricao]
        );

        const id_grupo = grupoResult.insertId;

        await conn.execute(
            'INSERT INTO grupo_membros (id_usuario, id_grupo, funcao) VALUES (?, ?, ?)', [id_usuario, id_grupo, 'administrador']
        );

        await conn.commit();
        await conn.end();

        res.status(201).json({ message: 'Grupo criado com sucesso', id_grupo });
    } catch (error) {
        console.error('Erro ao criar grupo:', error);
        res.status(500).json({ message: 'Erro ao criar grupo' });
    }
});

// Entrar em grupo
router.post('/entrar', async(req, res) => {
    const { id_grupo } = req.body;

    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Não autenticado' });
    }

    const id_usuario = req.session.userId;

    if (!id_grupo) {
        return res.status(400).json({ error: 'ID do grupo é obrigatório.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        // Verifica se já está no grupo
        const [rows] = await connection.execute(
            'SELECT * FROM grupo_membros WHERE id_usuario = ? AND id_grupo = ?', [id_usuario, id_grupo]
        );

        if (rows.length > 0) {
            await connection.end();
            return res.status(409).json({ message: 'Você já está nesse grupo.' });
        }

        await connection.execute(
            'INSERT INTO grupo_membros (id_usuario, id_grupo, funcao) VALUES (?, ?, ?)', [id_usuario, id_grupo, 'membro']
        );

        await connection.end();
        res.status(200).json({ message: 'Entrou no grupo com sucesso!' });
    } catch (error) {
        console.error('Erro ao entrar no grupo:', error);
        res.status(500).json({ error: 'Erro ao entrar no grupo.' });
    }
});

// Listar grupos disponíveis
router.get('/listar', async(req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [grupos] = await connection.execute('SELECT * FROM grupos');
        await connection.end();
        res.status(200).json(grupos);
    } catch (error) {
        console.error('Erro ao listar grupos:', error);
        res.status(500).json({ error: 'Erro ao buscar grupos.' });
    }
});

module.exports = router;