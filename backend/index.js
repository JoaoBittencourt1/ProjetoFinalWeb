// index.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;


app.use(cors({
    origin: 'http://localhost:3000',
}));


app.use(express.json());


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });


app.use('/uploads', express.static(uploadDir));


const dbConfig = {
    host: '177.121.253.34',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb',
};


app.post('/register', upload.single('foto'), async (req, res) => {
    const { username, email, dataNascimento } = req.body;
    const fotoNome = req.file ? req.file.filename : null;

    if (!username || !email || !dataNascimento) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'INSERT INTO usuarios (username, email, data_nascimento, foto_perfil) VALUES (?, ?, ?, ?)',
            [username, email, dataNascimento, fotoNome]
        );

        await connection.end();

        res.status(201).json({
            message: 'Usuário registrado com sucesso',
            userId: result.insertId,
            fotoUrl: fotoNome ? `http://localhost:${port}/uploads/${fotoNome}` : null
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Usuário ou email já cadastrado' });
        }
        console.error(error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});


app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
