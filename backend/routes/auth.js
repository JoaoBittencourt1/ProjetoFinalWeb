const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');


const dbConfig = {
  host: '179.251.251.198',
  user: 'usuariodb',
  password: 'Userdb123&',
  database: 'ProjetoWeb'
};


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