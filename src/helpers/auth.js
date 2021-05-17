//creamos un helpers como funcion
const helpers = {}

/**Le creamos una funcion donde tenemos
 * nuestro req, lo que recibimos 
 * res, nuestra respuesta 
 * y next para seguir con el codigo
 * 
 */
helpers.isAuthenticated = (req,res,next) => {
    //Usamos una funcion para autenticar que nos retorna true o false
    if (req.isAuthenticated()) {
        //En caso el autenticado sea correcto, seguimos con el codigo
        return next();
    }
    //en caso no, enviamos un mensaje y lo redireccionamos a iniciar sesion
    req.flash('error_msg', 'No estas autenticado')
    res.redirect('/users/signin')
}

module.exports = helpers