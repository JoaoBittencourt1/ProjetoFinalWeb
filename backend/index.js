// index.js
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const authRoutes = require('./routes/auth');

const app = express();
const port = 3001;

// CORS para permitir conexão com o frontend
app.use(cors({
    origin: 'http://localhost:3000',
}));

// Para ler JSON em requisições
app.use(express.json());

// Cria diretório de upload se não existir
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer para salvar imagens com nome único
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Expor imagens via rota pública
app.use('/uploads', express.static(uploadDir));

// Configuração de acesso ao banco
const dbConfig = {
    host: '177.149.90.39',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb',
};

// Rota de cadastro de usuário
app.post('/register', upload.single('foto'), async (req, res) => {
    const { username, email, senha, dataNascimento } = req.body;
    const fotoNome = req.file ? req.file.filename : null;

    if (!username || !email || !senha || !dataNascimento) {
        return res.status(400).json({ error: 'Dados obrigatórios faltando' });
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        const [result] = await connection.execute(
            'INSERT INTO usuarios (username, email, senha, data_nascimento, foto_perfil) VALUES (?, ?, ?, ?, ?)',
            [username, email, senha, dataNascimento, fotoNome]
        );

        await connection.end();

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            userId: result.insertId
        });
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        res.status(500).json({ error: 'Erro ao cadastrar usuário' });
    }
});

// Rotas de autenticação (ex: login)
app.use('/api/auth', authRoutes);

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
