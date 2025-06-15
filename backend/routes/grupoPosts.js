// backend/routes/grupoPosts.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Rota de grupoPosts funcionando!');
});

module.exports = router;