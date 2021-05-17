const express = require("express");
//Concatenar palabras
/*Por ejemplo para que nuestro servidor sepa donde esta nuestros archivos
usamos path.join*/
const path = require("path");
//Para que nuestro servidor reconozca hbs en ves de html, hbs es como jsf
const exphbs = require("express-handlebars");
/*Para enviar peticiones PUT o DELETE*/
const methodOverride = require("method-override");
//Crear una session mas rapido al momento de autenticarte
const session = require("express-session");
//hbs para configurar ciertos errores al momento de pintar varibles en la vista
const Handlebars = require("handlebars");
//Guardar mensajes y mostrarlo a traves de variables globales para nuestras vistas
const flash = require("connect-flash");
//Seguridad para nuestras vistas, en otras palabras son permisos
const passport = require("passport");

// Import function exported by newly installed node modules.
//Funciona que junsto con Handlebars nos ayudara para resolver el error de variables globales
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

//Initialize
//iniciamos express para crear nuestro servidor
const app = express();
//Nos traemos nuestra conecion a mongo
require("./database");
//Traemos lo necesario para crear credenciales para un usuario se autentique
require("./config/passport");

// Settings
//configuramos el puerto de nuestro servidor
//process.env.PORT es el puerto por defecto de nuestra maquina
app.set("port", process.env.PORT || 3000);
//COnfiguramos para que nuestro servidor encuentre nuestra carperas views
//usamos path.join para concatenar
//__dirname es la caprta donde estamos ahora o hace referencia donde estamos ahora
app.set("views", path.join(__dirname, "views"));
/**Configuracion de hbs
 * enviamos la extencion para que la reconozca como una vista
 * Luego enviamos una configuracion de express-handlebars
 * primero: es la vista principal, en otras palabras el template
 * segundo: especificamos donde se encuentra esta vista principal, por defecto siempre esta en layout
 * ojo: usamos app.get('views') porque ya anteriormente hemos configurar donde se encuentra nuestra carpeta view
 * tercero: configurarmos los partials
 * ojo: los partials con componentes globales que podemos utilizar en cualquier parte de nuestra vista
 * cuarto: como sera la extencion de nuestars vistas .hbs
 * quinto: configuracion para aquellos errores al mostrar variables en nuestras vistas
 * en caso tengas solo copia
 * dependecia: @handlebars/allow-prototype-access y tambien handlebars
 */
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
//utilizamos nuesta configuracion engine y la unimos con views y por ultimo la extencion
app.set("view engine", ".hbs");

// Middlewares
//configuracion para los usuario (no me acuerdo para que es :"V")
app.use(express.urlencoded({ extended: false }));
//configuracion para los metodos PUT o DELETE, para usarlo en nuestro formulario tenmos que poner la palabra clase _method
app.use(methodOverride("_method"));
//Configuracion para la sesion, te pide un nombre secret, puede usar cualquier y lo demas es por defecto
app.use(
  session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true,
  })
);
//INiciamos para autenticar los usuarios
app.use(passport.initialize());
// y la sesion
app.use(passport.session());
//Iniciamos flash para los mensajes
app.use(flash());

//Global variables
//Variables de flash
//lo que enviamos = lo que recibimos de flash
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.warning_msg = req.flash("warning_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
});

// Routes
//Nuestras rutas que vamos a utilizar
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

// Static File
/**Usamos express.static para hacer referencia a carpetas que siempre todo proyecto tiene
 * por ejemplo public odne estara nuestros archivos css, imagenes y otros
 * tambien usamos path.join para configurar
 */
app.use(express.static(path.join(__dirname, "public")));

//Servir is listening
//Iniciamos nuestro servidor con el puerto ya configurado
//Siempre que querramos usar algo ya configurado, usamos app.get y nombre de la configuracion, por ejemplo port
app.listen(app.get("port"), () => {
  console.log("server on port", app.get("port"));
});
