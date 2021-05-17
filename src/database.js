//Requerimos moogoose para conectarnos
const mongoose = require("mongoose");

//FOrma usando promesas
/*mongoose
  .connect(
    "mongodb+srv://diegohr:notepad1245@cluster0.a3scv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then((db) => console.log("DB connect"))
  .catch((err) => console.error(err));
*/
//FOrma usando async await y recomendad
//Creamos una funcion de flecha
(async () => {
  try {
    //Creamos una coneccion usando moogose y lo guardamos en una constante db
    //la url que enviamos lo obtuvimos de nuestro cluster en mongodb atlas
    //Tambien agregamos algunos parametros para la funcionalidad de mongo
    const db = await mongoose.connect(
      "mongodb+srv://diegohr:notepad1245@cluster0.a3scv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      }
    );
    //Enviamos un mensaje por consola en caso funcione todo
    console.log("Mongodb is connected to", db.connection.host);
  } catch (error) {
    //en caso de error obtenemos el mensaje y lo enviamos por consola
    console.error(error);
  }
})();
