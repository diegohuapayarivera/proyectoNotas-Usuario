const mongoose = require("mongoose");
const { Schema } = mongoose;
//Usamos bcrypt para encriptar nuestras contraseña
const bcrypt = require("bcryptjs");

//Creamos una instancia de Schema y agreamos nuestros campos
const UserSchema = new Schema({
  name: { type: "string", require: true },
  email: { type: "string", require: true },
  password: { type: "string", require: true },
  date: { type: "Date", default: Date.now },
});

//Para crear metodos en nuestro schema, usamos luego del schema .methods seguido del nombre del metodo
//Creamos un metodo encryptPassword que recibe un contraseña
UserSchema.methods.encryptPassword = async (password) => {
  //usamos un funcion gerSalt que es las veces que se repetira el algoritmo de encriptar
  //Como puede tarde usamos async await
  const salt = await bcrypt.genSalt(10);
  //como ya tenemos el algoritmo encryptado 
  //Usamos hash para unir el algoritmo con la contraseña, como demora tambien le ponemos await 
  return await bcrypt.hash(password, salt);
};

//Creamos otra funcion para comparar la contraseña recibida y la que tenemos
//Para esta ocacion no usamoremos una funcion en flecha ya que usaremos la palabra reservada this
//Asiq ue usaremos la antigua forma de crear funciones anonimas
UserSchema.methods.matchPassword = async function (password) {
  //Ahora recuerda que estas funciones pertenen a la instancia que creamos
  //Asi que cada que creen una instancia con valores adentro
  //Esta funcion puede hacer referencia a ellos a traves de this 
  //Asi que ahora podemos comprar lo que ingresan como parametros con lo que tenemos nosotros
  //Como tambien demora agreamos await y async en la funcion
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
