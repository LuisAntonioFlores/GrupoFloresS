const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('../models/User');

// Controlador para registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  try {
    const { nombre, apellidoP, apellidoM, email, password, fechaNacimiento, sexo, tipoUsuario } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario con imagen
    const newUser = new UserModel({
      nombre,
      apellidoP,
      apellidoM,
      email,
      password: hashedPassword,
      fechaNacimiento,
      sexo,
      tipoUsuario,
      imagen: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newUser.save();

    // Generar token JWT
    const tokenPayload = {
      _id: newUser._id,
      nombre: newUser.nombre,
      apellidoPaterno: newUser.apellidoP,
      apellidoMaterno: newUser.apellidoM,
      tipoUsuario: newUser.tipoUsuario,
      sexo: newUser.sexo,
      imagen: newUser.imagen,
      fechaNacimiento: newUser.fechaNacimiento
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'llaveSecreta', { expiresIn: '20m' });

    // Enviar respuesta con token y detalles del usuario
    return res.status(200).json({
      token,
      nombre: newUser.nombre,
      apellidoPaterno: newUser.apellidoP,
      apellidoMaterno: newUser.apellidoM,
      tipoUsuario: newUser.tipoUsuario,
      _id: newUser._id,
      imagen: newUser.imagen,
      fechaNacimiento: newUser.fechaNacimiento
    });
  } catch (error) {
    console.error('Error al registrar un nuevo usuario:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

// Controlador para iniciar sesión
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) return res.status(401).send("El Correo no existe");

    // Comparar contraseñas
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).send('Contraseña incorrecta');

    // Generar token JWT
    const tokenPayload = {
      _id: user._id,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoP,
      apellidoMaterno: user.apellidoM,
      tipoUsuario: user.tipoUsuario,
      sexo: user.sexo,
      imagen: user.imagen,
      fechaNacimiento: user.fechaNacimiento
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET || 'llaveSecreta', { expiresIn: '20m' });

    // Enviar respuesta con token y detalles del usuario
    return res.status(200).json({
      token,
      nombre: user.nombre,
      apellidoPaterno: user.apellidoP,
      apellidoMaterno: user.apellidoM,
      sexo: user.sexo,
      tipoUsuario: user.tipoUsuario,
      _id: user._id,
      imagen: user.imagen,
      fechaNacimiento: user.fechaNacimiento
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).send('Error interno del servidor');
  }
};

// Controlador para obtener tareas
exports.getTasks = (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, tipoUsuario } = req.user;
  res.json({
    tasks: [
      // Aquí irían tus datos de tareas
    ],
  });
};

// Controlador para obtener tareas privadas
exports.getPrivateTasks = (req, res) => {
  const { nombre, apellidoPaterno, apellidoMaterno, tipoUsuario } = req.user;
  res.json({
    tasks: [
      // Aquí irían tus datos de tareas privadas
    ],
  });
};
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    // Enviar la URL de la imagen junto con otros datos
    return res.status(200).json({
      nombre: user.nombre,
      apellidoP: user.apellidoP,
      apellidoM: user.apellidoM,
      fechaNacimiento: user.fechaNacimiento,
      sexo: user.sexo,
      imagen: user.imagen ? `${req.protocol}://${req.get('host')}${user.imagen}` : null // Formato de URL completa
    });
  } catch (error) {
    console.error('Error al obtener perfil del usuario:', error);
    return res.status(500).send('Error interno del servidor');
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const { nombre, apellidoPaterno, apellidoMaterno, fechaNacimiento, sexo } = req.body;

    // Validación de datos obligatorios
    if (!nombre || !apellidoPaterno || !apellidoMaterno || !fechaNacimiento || !sexo) {
      return res.status(400).send('Faltan datos obligatorios.');
    }

    const userId = req.user._id;
    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    // Actualización de los datos del usuario
    user.nombre = nombre;
    user.apellidoP = apellidoPaterno;
    user.apellidoM = apellidoMaterno;
    user.fechaNacimiento = fechaNacimiento;
    user.sexo = sexo;

    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path;
      user.imagen = imagePath;
    }
    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con los datos actualizados
    return res.status(200).json({
      mensaje: 'Perfil actualizado correctamente',
      imagen: user.imagen,
      nombre: user.nombre,
      apellidoP: user.apellidoP,
      apellidoM: user.apellidoM,
      fechaNacimiento: user.fechaNacimiento,
      sexo: user.sexo
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return res.status(500).send('Error interno del servidor');
  }
};
