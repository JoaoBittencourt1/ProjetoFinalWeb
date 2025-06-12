const isAuthenticated = (req, res, next) => {
    console.log('Session data:', req.session);
    console.log('User ID in session:', req.session.userId);
    
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Usuário não autenticado' });
    }
    next();
};

module.exports = isAuthenticated; 