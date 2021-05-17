const express = require("express");
const router = express.Router();
//Requerimos nuestro modelo note 
const Note = require("../models/Note");
//Nos traemos nuestra funcion para autenticar, asi protegemos nuestras notas de usuario no autenticados
const { isAuthenticated } = require("../helpers/auth")

//Cada que un usuario quiera obtener a traves de una peticion, vamos a primero usar nuestra funcion para autenticar y luego respondemos 

//ruta para mostrar la vista de agregar nota, lo renderizamos a la vista de notes/add.hbs, 
//no es necesario escribir el .hbs porque ya lo configuramos 
router.get("/notes/add", isAuthenticated, (req, res) => {
  res.render("notes/add");
});

//Ruta para crear una nota a traves del metodo post 
router.post("/notes/add", isAuthenticated ,async (req, res) => {
  //Guardamos lo enviamos 
  const { title, description } = req.body;
  //arreglo para los erroes
  const errors = [];
  //Validamos si nos enviaron datos
  //Podemo-s hacer esto para cada dato obtenido pero ahora solo lo haremos para el titulo 
  if (!title) {
    //En caso no obtengamos un titulo agregamos un error
    errors.push({ text: "Ingrese un titulo" });
  }
  if (!description) {
    //lo ismo para la descripcion
    errors.push({ text: "Ingrese una description" });
  }
  //Luego de las validaciones, comprobamos si tenemos o no errores que enviar 
  if (errors.length > 0) {
    //Como si tenemos, lo rederizamos a notes/add y enviamos los obtenido junto con los errores
    res.render("notes/add", {
      errors,
      title,
      description,
    });
  } else {
    //como todo esta bien, vamos a crear una instnacia de Note usando los datos obtenidos 
    const newNote = new Note({ title, description });
    //Luego concatenamos con el id del usaurio 
    //Recuerda que tenemos el user gracias a la credenciales 
    newNote.user = req.user.id
    //Guardamos el usuario, como esto demorara agregamos un await
    await newNote.save();
    //Enviamos mensajes a traves de flash y renderizamos a /notes
    req.flash("success_msg",'Nota agregada, bien hecho')
    res.redirect("/notes");
  }
});

//Ruta para mostrar todas las notas
router.get("/notes", isAuthenticated , async (req, res) => {
  //buscamos las notas por el id del usuario y luego las ordenamos de forma descendente
  const notes = await Note.find({user: req.user.id}).sort({ date: "desc" });
  //Luego lo renderizamos a la vista all-note y le enviamos notes 
  res.render("notes/all-notes", { notes });
});

//Mostramos la edicion de notas atraves de un id
//Para que reconozca como parametro en la ruta, no olvides agregar ':'
router.get("/notes/edit/:id", isAuthenticated , async (req, res) => {
  //hacemos una busqueda de la nota usando req.params.id, recuerda que ese es el parametros
  const note = await Note.findById(req.params.id);
  //rederizamos la vista de edit y le enviamos la nota obtenida 
  res.render("notes/edit", { note });
});

//ruta para modificar una nota
router.put("/notes/edit/:id", isAuthenticated , async (req, res) => {
  //Guardamos los datos obtenidos en variables
  const {title, description} = req.body;
  //hacemos una busqueda y luego actualizado, enviando como parametro el id de la nota y luego lo que modificara
  //Recuerda enviarlo como objeto lo que modificara
  await Note.findByIdAndUpdate(req.params.id,{title,description})
  //Emviamos un mensaje de advertencia que modifico datos y lo renderizamos a notes
  //Esta ves no nada ya que en la vista notes hace una busqueda de todos las notas
  req.flash('warning_msg','Actualizado correctamente')
  res.redirect('/notes')
})

//ruta para eliminar una nota
router.delete("/notes/delete/:id", isAuthenticated , async (req, res) => {
  //Buscamos y eliminamos la nota por su id 
  await Note.findByIdAndDelete(req.params.id)
  //Enviamos un mensaje de error ya que elimino una nota y lo renderizamos a notes 
  req.flash('error_msg','Eliminado conrrectamente')
  res.redirect('/notes')
})

module.exports = router;
