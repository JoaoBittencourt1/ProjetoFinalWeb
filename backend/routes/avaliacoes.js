const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

const dbConfig = {
    host: '177.149.92.88',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb'
};

router.post('/', async(req, res) => {
    const { tipo_alvo, id_alvo, valor } = req.body;
    const id_usuario = req.session?.userId;

    if (!id_usuario) {
        console.log('Usuário não autenticado.');
        return res.status(401).json({ error: 'Não autenticado' });
    }

    try {
        const conn = await mysql.createConnection(dbConfig);

        
        const [result] = await conn.execute(`
            INSERT INTO avaliacoes (id_usuario, tipo_alvo, id_alvo, valor)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
                valor = VALUES(valor),
                data_avaliacao = CURRENT_TIMESTAMP
        `, [id_usuario, tipo_alvo, id_alvo, valor]);

        await conn.end();

        console.log(`Avaliação salva: user=${id_usuario}, tipo=${tipo_alvo}, alvo=${id_alvo}, valor=${valor}`);
        res.status(200).json({ message: 'Avaliação registrada' });
    } catch (err) {
        console.error('Erro ao registrar avaliação:', err);
        res.status(500).json({ error: 'Erro interno ao salvar avaliação' });
    }
});

module.exports = router;