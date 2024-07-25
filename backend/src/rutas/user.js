const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modelos/userSchema');
const { verifyToken } = require('./authMiddleware');

const secretKey = process.env.SECRET_KEY || 'secretKey';

function validarCorreo(correo) {
  const regex = /^[a-zA-Z0-9._%+-]+@ups.edu.ec$/;
  return regex.test(correo);
}


function validarContraseña(contraseña) {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
  return regex.test(contraseña);
}

router.post('/register', async (req, res) => {
  const { name, email, password, tipo } = req.body;

  if (!name || !email || !password || !tipo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  if (!validarCorreo(email)) {
    return res.status(400).json({ error: 'El correo debe tener un dominio ups.edu.ec' });
  }

  if (!validarContraseña(password)) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres, incluyendo letras y números' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, tipo });
    await newUser.save();

    const token = jwt.sign({ _id: newUser._id, tipo: newUser.tipo }, secretKey);

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send("Error en el servidor");
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const userFind = await User.findOne({ email });
    if (!userFind) return res.status(401).send("El correo no existe");

    const isPasswordValid = await bcrypt.compare(password, userFind.password);
    if (!isPasswordValid) return res.status(401).send("La contraseña es errónea");

    const token = jwt.sign({ _id: userFind._id, tipo: userFind.tipo }, secretKey);
    return res.status(200).json({ token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).send("Error en el servidor");
  }
});

router.get('/role', verifyToken, (req, res) => {
  const userId = req.userId; 
  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
   
      res.json({ tipo: user.tipo });
    })
    .catch(err => {

      console.error('Error al obtener el tipo de usuario:', err);
      res.status(500).json({ error: 'Error en el servidor' });
    });
});

router.get('/obtener_usuarios', verifyToken, async (req, res) => {
  try {
    const users = await User.find({}, 'name email tipo').lean(); 
    console.log('Usuarios obtenidos:', users); 
    res.status(200).json(users); 
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error en el servidor al obtener usuarios' });
  }
});

router.put('/cambiar-clave', verifyToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  
  if (!validarContraseña(newPassword)) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres, incluyendo letras y números' });
  }

  try {
    const userFind = await User.findById(req.userId);
    if (!userFind) return res.status(404).json({ error: "Usuario no encontrado" });

    const isPasswordValid = await bcrypt.compare(oldPassword, userFind.password);
    if (!isPasswordValid) return res.status(401).json({ error: "La contraseña antigua es errónea" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    userFind.password = hashedPassword;
    await userFind.save();

    res.status(200).json({ message: "Contraseña actualizada exitosamente" });
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    
    const userFind = await User.findById(id);
    if (!userFind) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/actualizar/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, email, tipo, newPassword } = req.body;

  if (!name && !email && !tipo && !newPassword) {
    return res.status(400).json({ error: 'Debe proporcionar al menos un campo para actualizar' });
  }

  if (email && !validarCorreo(email)) {
    return res.status(400).json({ error: 'El correo debe tener un dominio ups.edu.ec' });
  }

  if (newPassword && !validarContraseña(newPassword)) {
    return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres, incluyendo letras y números' });
  }

  try {
    const userFind = await User.findById(id);
    if (!userFind) return res.status(404).json({ error: 'Usuario no encontrado' });

    if (name) userFind.name = name;
    if (email) userFind.email = email;
    if (tipo) userFind.tipo = tipo;
    if (newPassword) {
      userFind.password = await bcrypt.hash(newPassword, 10);
    }

    await userFind.save();
    res.status(200).json({ message: 'Usuario actualizado exitosamente' });
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

module.exports = router;