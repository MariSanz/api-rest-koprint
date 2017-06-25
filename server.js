var express         = require("express"),
    app             = express(),
    oauthServer     = require('express-oauth-server'), 
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    middleware = require('./middleware'),
    service = require('./service'),
    config = require('./config');


mongoose.connect('mongodb://admin:admin123@ds139072.mlab.com:39072/koprint/koprint', function(err, res) {  
  if(err) {
    console.log('ERROR: connecting to Database. ' + err);
  }
 });
app.set('superSecret', config.secret); // secret variable

// Middlewares
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var userModel     = require('./models/user')(app, mongoose);
var orderModel     = require('./models/order')(app, mongoose);
var UserCtrl = require('./controllers/userCtrl');
var OrderCtrl = require('./controllers/orderCtrl');

var oauth = new oauthServer({
 //accessTokenLifetime: 0,
  model: require('./models/oauthmodel')
});

var routerAnonimo = express.Router();
var router = express.Router();

routerAnonimo.route('/users')
  .post(UserCtrl.addUser);

//primero hay que autenticar y luego indicar las rutas, importa el orden
router.use(oauth.authenticate());

router.route('/users')  
  .get(UserCtrl.findAllUsers)
  .put(UserCtrl.updateUser)
  .delete(UserCtrl.deleteUser);

router.route('/orders') 
  .post(OrderCtrl.addOrder);

app.all('/oauth/token', oauth.token());

//diferenciar rutas que se autentican y las que no
app.use('/koprint', routerAnonimo);
app.use('/koprint', router); 

//Conexion al servidor
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
  });


