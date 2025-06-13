console.log('Arquivo de rotas de autenticação carregado');
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');
const path = require('path');

const dbConfig = {
  host: '179.251.17.221',
  user: 'usuariodb',
  password: 'Userdb123&',
  database: 'ProjetoWeb'
};

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Registration route
router.post('/register', upload.single('foto'), async (req, res) => {
  try {
    const { username, email, senha, dataNascimento } = req.body;
    const foto = req.file ? req.file.filename : null;

    // Validate required fields
    if (!username || !email || !senha || !dataNascimento) {
      return res.status(400).json({ error: 'Todos os campos obrigatórios devem ser preenchidos' });
    }

    const connection = await mysql.createConnection(dbConfig);

    // Check if email or username already exists
    const [existingUsers] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ? OR username = ?',
      [email, username]
    );

    if (existingUsers.length > 0) {
      await connection.end();
      return res.status(400).json({ error: 'Email ou nome de usuário já cadastrado' });
    }

    // Insert new user
    const [result] = await connection.execute(
      'INSERT INTO usuarios (username, email, senha, data_nascimento, foto_perfil) VALUES (?, ?, ?, ?, ?)',
      [username, email, senha, dataNascimento, foto]
    );

    await connection.end();

    // Send success response
    return res.status(201).json({ 
      success: true,
      message: 'Usuário cadastrado com sucesso' 
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    // Retorne erro como JSON
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Erro ao cadastrar usuário' 
    });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    

    const connection = await mysql.createConnection(dbConfig);
    

    const [rows] = await connection.execute(
      'SELECT * FROM usuarios WHERE email = ?',
      [email]
    );
    
    await connection.end();

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const user = rows[0];

 
    if (user.senha !== password) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

  

    req.session.userId = user.id;
    
    const { senha, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login realizado com sucesso',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro ao realizar login' });
  }
});


router.get('/check', (req, res) => {
  if (req.session.userId) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Erro ao fazer logout' });
    }
    res.json({ message: 'Logout realizado com sucesso' });
  });
});

module.exports = router; 