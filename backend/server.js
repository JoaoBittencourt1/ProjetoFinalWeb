const express = require('express');
const session = require('express-session');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const mysql = require('mysql2/promise');
const app = express();

const FRONTEND_ORIGIN = 'http://localhost:3000';


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


app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    console.log('Session:', req.session);
    next();
});


app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', FRONTEND_ORIGIN);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


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


const dbConfig = {
    host: '179.251.17.221',
    user: 'usuariodb',
    password: 'Userdb123&',
    database: 'ProjetoWeb',
};


const authRoutes = require('./routes/auth');
const postsRoutes = require('./routes/posts');
const comentariosRoutes = require('./routes/comentarios');

app.use('/api/auth', authRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/comentarios', comentariosRoutes);


app.get('/', (req, res) => {
    res.json({ message: 'API está funcionando!' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});