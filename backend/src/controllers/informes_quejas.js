const Contacto = require('../models/Informes_quejas'); // Importa el modelo de contacto

// Controlador para crear un nuevo contacto (informe o queja)
exports.crearContacto = async (req, res) => {
  try {
    // Desestructuramos los datos del cuerpo de la solicitud
    const { nombre, apellidos, email, telefono, quejas, estado } = req.body;

    // Validación de datos
    if (!nombre || !apellidos || !email || !telefono) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    // Creamos un nuevo objeto Contacto con los datos proporcionados
    const contacto = new Contacto({
      nombre,
      apellidos,
      email,
      telefono,
      quejas,
      estado: estado || 'no_atendido'
    });

    // Guardamos el nuevo contacto en la base de datos
    const contactoGuardado = await contacto.save();

    // Respondemos con los datos guardados y un mensaje de éxito
    return res.status(201).json({
      message: 'Datos recibidos correctamente',
      contacto: contactoGuardado
    });
  } catch (error) {
    // Captura cualquier error y responde con un mensaje de error
    console.error('Error al guardar los datos de contacto:', error);
    return res.status(500).json({ message: 'Hubo un error al guardar los datos' });
  }
};

exports.obtenerContactos = async (req, res) => {
  try {
    const contactos = await Contacto.find();  // Obtener todos los registros de la base de datos

    // Verificamos si hay contactos
    if (!contactos || contactos.length === 0) {
      return res.status(404).json({ message: 'No se encontraron informes o quejas.' });
    }

    // Respondemos con los contactos obtenidos
    return res.status(200).json(contactos);
  } catch (error) {
    console.error('Error al obtener los datos de contacto:', error);
    return res.status(500).json({ message: 'Hubo un error al obtener los datos de contacto' });
  }
};

// Controlador para actualizar el estado de un informe
exports.actualizarEstado = async (req, res) => {
  const { estado } = req.body;  // El estado viene del cuerpo de la solicitud
  const informeId = req.params.id;  // El ID del informe viene de los parámetros de la URL

  // Verificamos que el estado sea uno de los valores válidos
  if (!['atendido', 'en_proceso', 'no_atendido'].includes(estado)) {
    return res.status(400).json({ message: 'Estado inválido' });
  }

  try {
    // Buscar el informe por ID y actualizar el estado
    const informeActualizado = await Contacto.findByIdAndUpdate(
      informeId,
      { estado },
      { new: true }  // Retorna el informe actualizado
    );

    if (!informeActualizado) {
      return res.status(404).json({ message: 'Informe no encontrado' });
    }

    // Respondemos con el informe actualizado
    return res.status(200).json({
      message: 'Estado del informe actualizado correctamente',
      informe: informeActualizado
    });
  } catch (error) {
    console.error('Error al actualizar el estado del informe:', error);
    return res.status(500).json({ message: 'Hubo un error al actualizar el estado del informe' });
  }
};


// Controlador para la ruta de prueba
exports.prueba = (req, res) => {
  res.send('Hola, soy prueba');
};
