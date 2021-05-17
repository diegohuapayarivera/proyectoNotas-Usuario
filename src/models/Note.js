//Requerimos moongose
const mongoose = require("mongoose");
//Usamos una clase llamada Schema para crear Schema
const { Schema } = mongoose;

//Creamos una constante instanciando nuestro nuevo Schema y el enviamos los campos que va a tener nuestro Schema
//El campo user es para guardar su id del usuario que creo esa nota
const NoteSchema = new Schema({
  title: { type: "string", required: true },
  description: { type: "string", required: true },
  date: { type: "date", default: Date.now },
  user: { type: "string" },
});

//Exportamos nuestra instancia y le agregamos un nombre
module.exports = mongoose.model("Note", NoteSchema);
