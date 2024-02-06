const Photo = require('../../src/models/Photo');
const fs = require('fs').promises;
const path = require('path');

const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();
    return res.json(photos);
  } catch (error) {
    console.error('Error al obtener fotos:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findById(id);
    return res.json(photo);
  } catch (error) {
    console.error('Error al obtener la foto por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const createPhoto = async (req, res) => {
  try {
    const { title, description, price, quantity } = req.body;

    let imagePath = '';
    if (req.file) {
      imagePath = req.file.path;
    }

    const newPhoto = {
      title,
      description,
      imagePath,
      price,
      quantity,
      date: Date.now()
    };

    const photo = new Photo(newPhoto);
    await photo.save();

    return res.json({
      message: 'Foto subida correctamente',
      photo
    });
  } catch (error) {
    console.error('Error al subir la foto:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deletePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const photo = await Photo.findByIdAndRemove(id);

    if (photo) {
      await fs.unlink(path.resolve(photo.imagePath.toString()));
    }

    return res.json({
      message: 'Foto eliminada correctamente',
      photo
    });
  } catch (error) {
    console.error('Error al eliminar la foto por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updatePhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, quantity } = req.body;
    const updatedPhoto = await Photo.findByIdAndUpdate(id, {
      title,
      description,
      price,
      quantity
    }, { new: true });

    return res.json({
      message: 'Foto actualizada correctamente',
      updatedPhoto
    });
  } catch (error) {
    console.error('Error al actualizar la foto por ID:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  getPhotos,
  getPhoto,
  createPhoto,
  deletePhoto,
  updatePhoto
  // Otras funciones del controlador si las hay
};
