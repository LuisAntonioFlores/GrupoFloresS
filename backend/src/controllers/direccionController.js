const Direccion = require('../models/Direcciones');
const mongoose = require('mongoose');


// Controlador para crear una nueva dirección
exports.crearDireccion = async (req, res) => {
    // console.log(req.body);
  
    // Verificar si los campos necesarios están presentes
    const requiredFields = ['cliente_id', 'nombreUsuario', 'codigoPostal', 'estado', 'municipio', 'colonia', 'calle', 'numero', 'tipo', 'numeroContacto', 'descripcion'];
    for (let field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `El campo ${field} es obligatorio.` });
      }
    }
  
    try {
      const { cliente_id, nombreUsuario, codigoPostal, estado, municipio, alcaldia, colonia, calle, numero, numeroInterior, tipo, numeroContacto, descripcion } = req.body;
  
      // Validar que el estado, municipio y colonia sean válidos
      // (Aquí podrías consultar la base de datos o tener una lista de valores válidos)
  
      const nuevaDireccion = new Direccion({
        cliente_id,
        nombreUsuario,
        codigoPostal,
        estado,
        municipio,
        alcaldia,
        colonia,
        calle,
        numero,
        numeroInterior,
        tipo,
        numeroContacto,
        descripcion,
      });
  
      await nuevaDireccion.save();
      res.status(201).json(nuevaDireccion);
    } catch (error) {
      console.error('Error al guardar la dirección:', error);
      res.status(400).json({ message: error.message });
    }
  };
  
// Controlador para obtener todas las direcciones de un usuario
exports.obtenerDirecciones = async (req, res) => {
    try {
      // Se busca todas las direcciones que coincidan con el cliente_id proporcionado en los parámetros de la solicitud
      const direcciones = await Direccion.find({ cliente_id: req.params.cliente_id });
      
      // Si se encuentran direcciones, se envían como respuesta en formato JSON
      res.json(direcciones);
    } catch (error) {
      // Si ocurre un error durante la búsqueda, se envía un mensaje de error con código de estado 500
      res.status(500).json({ message: error.message });
    }
  };
  

// Controlador para obtener una dirección específica por ID
exports.obtenerDireccionPorId = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log('ID recibido en el backend:', id);
    // Validar el ID de MongoDB
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'ID de dirección no válido' });
    }

    const direccion = await Direccion.findById(id);
    // console.log('Dirección encontrada en la base de datos:', direccion); 
    if (!direccion) return res.status(404).json({ message: 'Dirección no encontrada' });

    res.json(direccion);
  } catch (error) {
    console.error('Error en obtenerDireccionPorId:',error); // Log del error
    res.status(500).json({ message: error.message });
  }
};

// Controlador para actualizar una dirección
exports.actualizarDireccion = async (req, res) => {
  try {
    const direccionActualizada = await Direccion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!direccionActualizada) return res.status(404).json({ message: 'Dirección no encontrada' });
    res.json(direccionActualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Controlador para eliminar una dirección
exports.eliminarDireccion = async (req, res) => {
  try {
    const direccionEliminada = await Direccion.findByIdAndDelete(req.params.id);
    if (!direccionEliminada) return res.status(404).json({ message: 'Dirección no encontrada' });
    res.json({ message: 'Dirección eliminada con éxito' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Controlador para obtener las direcciones de un usuario
exports.obtenerDireccionesPorCliente = async (req, res) => {
  try {
    // Obtener el cliente_id desde los parámetros de la solicitud
    const cliente_id = req.params.cliente_id;

    // Buscar las direcciones en la base de datos que coincidan con el cliente_id
    const direcciones = await Direccion.find({ cliente_id });

    // Verificar si se encontraron direcciones
    if (!direcciones || direcciones.length === 0) {
      return res.status(404).json({ message: 'No se encontraron direcciones para este usuario.' });
    }

    // Si se encuentran direcciones, devolverlas como respuesta en formato JSON
    res.json(direcciones);
  } catch (error) {
    // Manejo de errores
    console.error('Error al obtener las direcciones:', error);
    res.status(500).json({ message: 'Error en el servidor, no se pudieron obtener las direcciones.' });
  }
};

// Controlador de prueba
exports.prueba = (req, res) => {
  res.send('Hola, soy dirección prueba');
};
