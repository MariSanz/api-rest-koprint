var express         = require("express"),
    app             = express(),
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
var models     = require('./models/user')(app, mongoose);
var UserCtrl = require('./controllers/userCtrl');

var router = express.Router();

router.route('/users')  
  .get(UserCtrl.findAllUsers)
  .post(UserCtrl.addUser)
  .put(UserCtrl.updateUser)
  .delete(UserCtrl.deleteUser);

app.use('/koprint', router); 

//Conexion al servidor
app.listen(3000, function() {
    console.log("Node server running on http://localhost:3000");
  });


