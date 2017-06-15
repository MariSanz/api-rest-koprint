var express         = require("express"),
    app             = express(),
    oauthServer     = require('express-oauth-server'), 
    bodyParser      = require("body-parser"),
    methodOverride  = require("method-override"),
    mongoose        = require('mongoose'),
    middleware = require('./middleware'),
    service = require('./service'),
    config = require('./config');


mongoose.connect('mongodb://localhost/koprint', function(err, res) {  
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

var router = express.Router();

router.route('/users')  
  .get(UserCtrl.findAllUsers)
  .post(UserCtrl.addUser)
  .put(UserCtrl.updateUser)
  .delete(UserCtrl.deleteUser);

router.route('/orders') 
  .post(OrderCtrl.addOrder);

app.all('/oauth/token', oauth.token());

app.use('/koprint', oauth.authenticate())
app.use('/koprint', router); 

//Conexion al servidor
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
  });


