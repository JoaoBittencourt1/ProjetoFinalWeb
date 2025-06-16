const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '179.251.253.17',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb',
};


function verificarAutenticacao(req, res, next) {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: 'Não autenticado' });
    }
    next();
}


router.post('/criar', verificarAutenticacao, async(req, res) => {
    const { nome, descricao } = req.body;
    const id_usuario = req.session.userId;
    try {
        const conn = await mysql.createConnection(dbConfig);
        const [gruposExistentes] = await conn.execute('SELECT id FROM grupos WHERE nome = ?', [nome]);
        if (gruposExistentes.length > 0) {
            await conn.end();
            return res.status(409).json({ message: 'Já existe um grupo com esse nome.' });
        }
        await conn.beginTransaction();
        const [grupoResult] = await conn.execute('INSERT INTO grupos (nome, descricao) VALUES (?, ?)', [nome, descricao]);
        const id_grupo = grupoResult.insertId;
        await conn.execute('INSERT INTO grupo_membros (id_usuario, id_grupo, funcao) VALUES (?, ?, ?)', [id_usuario, id_grupo, 'administrador']);
        await conn.commit();
        await conn.end();
        res.status(201).json({ message: 'Grupo criado com sucesso', id_grupo });
    } catch (error) {
        console.error('Erro ao criar grupo:', error);
        res.status(500).json({ message: 'Erro ao criar grupo' });
    }
});


router.post('/entrar', verificarAutenticacao, async(req, res) => {
    const { id_grupo } = req.body;
    const id_usuario = req.session.userId;

    if (!id_grupo) {
        return res.status(400).json({ error: 'ID do grupo é obrigatório.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM grupo_membros WHERE id_usuario = ? AND id_grupo = ?', [id_usuario, id_grupo]);
        if (rows.length > 0) {
            await connection.end();
            return res.status(409).json({ message: 'Você já participa desse grupo.' });
        }
        await connection.execute('INSERT INTO grupo_membros (id_usuario, id_grupo, funcao) VALUES (?, ?, ?)', [id_usuario, id_grupo, 'membro']);
        await connection.end();
        res.status(200).json({ message: 'Bem-vindo ao grupo!' });
    } catch (error) {
        console.error('Erro ao entrar no grupo:', error);
        res.status(500).json({ error: 'Erro ao participar do grupo.' });
    }
});


router.post('/sair', verificarAutenticacao, async(req, res) => {
    const { id_grupo } = req.body;
    const id_usuario = req.session.userId;

    if (!id_grupo) {
        return res.status(400).json({ error: 'ID do grupo é obrigatório.' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.execute('DELETE FROM grupo_membros WHERE id_usuario = ? AND id_grupo = ?', [id_usuario, id_grupo]);
        await connection.end();
        res.status(200).json({ message: 'Você saiu do grupo com sucesso.' });
    } catch (error) {
        console.error('Erro ao sair do grupo:', error);
        res.status(500).json({ error: 'Erro ao sair do grupo.' });
    }
});


router.get('/listar', async(req, res) => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [grupos] = await connection.execute('SELECT id, nome, descricao FROM grupos');
        await connection.end();
        res.status(200).json(grupos);
    } catch (error) {
        console.error('Erro ao listar grupos:', error);
        res.status(500).json({ error: 'Erro ao buscar grupos.' });
    }
});


router.get('/meus', verificarAutenticacao, async(req, res) => {
    const id_usuario = req.session.userId;
    try {
        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(`
            SELECT g.id, g.nome, g.descricao, gm.funcao
            FROM grupos g
            JOIN grupo_membros gm ON g.id = gm.id_grupo
            WHERE gm.id_usuario = ?
        `, [id_usuario]);
        await connection.end();
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erro ao buscar grupos do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar seus grupos.' });
    }
});


router.get('/grupo/:id_grupo', verificarAutenticacao, async(req, res) => {
    const id_grupo = req.params.id_grupo;

    try {
        const conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT id, nome, descricao FROM grupos WHERE id = ?', [id_grupo]);
        await conn.end();

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Grupo não encontrado.' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error('Erro ao buscar grupo por ID:', error);
        res.status(500).json({ message: 'Erro ao buscar grupo.' });
    }
});


module.exports = router;