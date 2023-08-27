const { Schema, model } = require('mongoose');
const userSchema = new Schema({
    nombre: String,
    apellidoP: String,
    apellidoM: String,
    email: String,
    password: String,
    fechaNacimiento: Date,
    sexo: String,
    tipoUsuario: String
},{
    timestamps: true
});
module.exports = model('Usuario', userSchema);