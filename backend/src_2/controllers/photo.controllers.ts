import { Request, Response } from 'express';
import Photo from '../models/Photo';
import path from 'path';
import fs from 'fs-extra';



export async function getPhotos(req: Request, res: Response): Promise<Response> {

const photos = await Photo.find();
return res.json(photos);
};
export async function getPhoto(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const photo = await Photo.findById(id);
  return res.json(photo);
}

export async function createPhoto(req: Request, res: Response): Promise<Response> {

   const { title, description } = req.body;
   
   const newPhoto = {
     title: title,
      description: description,
      imagePath: req.file?.path
   }
   const photo = new Photo(newPhoto);
   await photo.save();
    return res.json({
      menssaje: 'foto subida',
      photo
    }) // solo para probar
};

export async function deletePhoto(req: Request, res: Response): Promise<Response> {

  const { id } = req.params;
  const photo = await Photo.findByIdAndRemove(id);

  if (photo) {
    await fs.unlink(path.resolve(photo.imagePath.toString()));

  }
  return res.json({
    menssaje: 'foto eliminada',
    photo
  }) // solo para probar

};

export async function updatePhoto(req: Request, res: Response): Promise<Response> {
  const { id } = req.params;
  const { title, description } = req.body;
  const updatePhoto = await Photo.findByIdAndUpdate(id, {
    title,
    description
  }, { new: true });
  return res.json({
    menssaje: 'foto actualizada',
    updatePhoto
  }) 
}