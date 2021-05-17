const express = require("express");
const router = express.Router();
//Requerimos nuestro Schema User
const User = require("../models/User");
//Requerimos passport para la authentication
const passport = require("passport")

//ruta para mostrar el ingresar el usuario
router.get("/users/signin", (req, res) => {
  res.render("users/signin");
});

/*ruta para validar usuario
usaremos passport.authenticate, seguido de la palabra clave global 
luego de un objeto 
primero, en caso este autenticado, lo renderizamos a notes
segundo, en caso que no, lo renderizamos a que se vuelva a ingresar
tercerto, activamos los mensajes flash
*/
router.post("/users/signin", passport.authenticate('local',{
  successRedirect: '/notes',
  failureRedirect: '/users/signin',
  failureFlash: true
}))

//ruta para mostrar crear un usuario
router.get("/users/signup", (req, res) => {
  res.render("users/signup");
});

//ruta para validar el creado de usuario
router.post("/users/signup", async (req, res) => {
  //obtenemos las varaibles enviadas
  const { name, email, password, confirm_password } = req.body;
  //creamos un arreglo de errores
  const errors = [];
  //validamos si ingreso un nombre 
  if (name.length <= 0) {
    //en caso no enviamos agregamos un mensaje de error
    errors.push({ text: "Inserta un nombre" });
  }
  //comparamos las contraseña
  if (password != confirm_password) {
    //en caso sean distintas agregamos un mensaje de error
    errors.push({ text: "password no coincide" });
  }
  //confirmaos si agrego un contraseña mayor a 4 digitos
  if (password.length < 4) {
    //en caso no agregamos un mensaje de error
    errors.push({ text: "password mayor a 4" });
  }
  //validamos si tenemos erroes
  if (errors.length > 0) {
    //em caso tenegamos erroes 
    //renderizamos a que vuelva a crear un usuario 
    //y le enviamos todas las variables obtenidas junto con lso erroes 
    res.render("users/signup", {
      errors,
      name,
      email,
      password,
      confirm_password,
    });
  } else {
    //En caso no tengamos errores
    //buscamos si el email es repetido
    const emailUser = await User.findOne({ email: email });
    if (emailUser) {
      //em caso sea repetido emviamos un mensaje y lo renderizamos
      req.flash("error_msg", "Email repetido");
      res.redirect("/users/signup");
    } else {
      //em caso sea distinto 
      //creamos una instancia con las variables obtenidas 
      const newUser = new User({ name, email, password });
      //encryptamos la contraseña 
      newUser.password = await newUser.encryptPassword(password);
      //Guardamos el usuario
      await newUser.save();
      //enviamos un mensaje y renderizamos
      req.flash("success_msg", "You are registered.");
      res.redirect("/users/signin");
    }
  }
});

//ruta para mostrar el cerra sesion
router.get('/users/logout', (req, res) => {
  //funcion para quitar credenciales
  req.logout();
  res.redirect('/')
})


module.exports = router;
