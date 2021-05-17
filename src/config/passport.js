//paasport es para los permisos de usuario
const passport = require("passport");
//Para validar localmente 
const LocalStrategy = require("passport-local").Strategy;
//User para comparar lo ingresado por lo que tenemos en nuestra db
const User = require("../models/User");

/**Usamos el localStrategy y le enviamos como objeto lo que queremos comparar cn nuestra base de datos 
 */
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    async (email, password, done) => {
      //Verificamos que el email existe
      const user = await User.findOne({ email: email });
      if (!user) {
        //EN caso no exista retornamos una funcion done
        //el primero es, si encontramos un error, enviamos null porque no encontramos 
        //el segundo es si encontramos al usuario, como no econtramos enviamos un flase
        //tercero es un mensaje, como no encontramos un usuario enviamos un mensaje para avisar al cliente
        return done(null, false, { message: "No se encontro un usuario" });
      } else {
        //En caso exista (haya encontrado un email valido)
        //Usamos nuestra funcion matchPassword para validar la contraseña
        //Esta funcion recibe una contraseña
        /*compara esa contraseña con la base de datos (ojo la contraseña ya esta encryptada, 
        asi que esta funcion cuando revice la contraseña del cliente tambien la encrypta)*/
        const match = await user.matchPassword(password);
        //Como la funciona nos retorna true o false
        //verificamos si coinciden
        if (match) {
          //Si en caso son iguales enviamos un done sin errores y esta ves con el usuario
          return done(null, user);
        } else {
          //En caso contrario enviamos un done sin errores, false porque no encontramos un usuario y un mensaje
          return done(null, false, { message: "Error en la contraseña" });
        }
      }
    }
  )
);

//Funcion para donde recibimos un usaurio y enviamos su id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

//FUncion donde recibimos un id y retornamos un usuario
passport.deserializeUser((id, done) => {
  //Buscamos el usuario por su id, en caso de error retornamos un erorr y en caso de encontar un usuario tambien lo retornamos
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
