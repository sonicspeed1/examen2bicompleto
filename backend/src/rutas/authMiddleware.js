const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY || 'secretKey';

function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Acceso denegado. Token no proporcionado.');

  try {
    const decoded = jwt.verify(token, secretKey);
    req.userId = decoded._id; 
    next();
  } catch (error) {
    return res.status(401).send('Acceso denegado. Token inválido.');
  }
}

function verifyRole(role) {
  return (req, res, next) => {
    if (req.user.tipo !== role) {
      return res.status(403).send('Acceso denegado. No tienes permisos suficientes.');
    }
    next();
  };
}

module.exports = {
  verifyToken,
  verifyRole
};