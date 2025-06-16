const express = require('express');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');

const app = express();
const FRONTEND_ORIGIN = 'http://localhost:3000';

// Configuração do banco de dados
const dbConfig = {
    host: '179.251.253.17',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb',
};

// Criar pool de conexões e usar como `db`
const db = mysql.createPool(dbConfig);

// Testar conexão com o banco
(async () => {
    try {
        const connection = await mysql.createConnection(dbConfig);
        await connection.ping();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
        await connection.end();
    } catch (err) {
        console.error('❌ Erro ao conectar com o banco de dados:', err);
    }
})();

// Middlewares de CORS e sessão
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true
}));

app.use(session({
    secret: 'seu_segredo_aqui',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

// Logs
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Session:', req.session);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

app.use('/uploads', express.static(uploadDir));

// Rotas

// Buscar todos os usuários cadastrados
app.get('/api/usuarios', async (req, res) => {
    try {
        const [usuarios] = await db.query('SELECT id, username, email, foto_perfil FROM usuarios');
        res.json(usuarios);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar usuários' });
    }
});

// Fazer conexão com outro usuário
app.post('/api/conexoes', async (req, res) => {
    const { id_usuario2 } = req.body;
    const id_usuario1 = req.session.userId;

    if (!id_usuario1 || !id_usuario2) {
        return res.status(400).json({ error: 'Usuário inválido' });
    }

    try {
        await db.query(
            'INSERT IGNORE INTO conexoes (id_usuario1, id_usuario2) VALUES (?, ?)',
            [id_usuario1, id_usuario2]
        );

        res.status(201).json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao criar conexão' });
    }
});

// Buscar conexões feitas pelo usuário logado
app.get('/api/conexoes', async (req, res) => {
    const id_usuario1 = req.session.userId;

    if (!id_usuario1) {
        return res.status(401).json({ error: 'Não autenticado' });
    }

    try {
        const [rows] = await db.query(
            'SELECT id_usuario2 FROM conexoes WHERE id_usuario1 = ?',
            [id_usuario1]
        );

        const idsConectados = rows.map(r => r.id_usuario2);
        res.json(idsConectados);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar conexões' });
    }
});

// Rotas importadas
const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const comentariosRoutes = require('./routes/comentarios');
const gruposRoutes = require('./routes/grupos');
const avaliacaoRoutes = require('./routes/avaliacoes');
const grupoPostsRouter = require('./routes/grupoPosts');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/grupos', gruposRoutes);
app.use('/api/avaliacoes', avaliacaoRoutes);
app.use('/api/grupo-posts', grupoPostsRouter);

// Teste da API
app.get('/', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

// Start do servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});