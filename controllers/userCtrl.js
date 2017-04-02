var mongoose = require('mongoose');  
var User  = mongoose.model('User');

//GET - Return all tvshows in the DB
exports.findAllUsers = function(req, res) {  
    User.find(function(err, users) {
    if(err) res.send(500, err.message);

    console.log('GET /users')
        res.status(200).jsonp(users);
    });
};

//GET - Return a User with specified ID
exports.findById = function(req, res) {  
    TVShow.findById(req.params.id, function(err, tvshow) {
    if(err) return res.send(500. err.message);

    console.log('GET /tvshow/' + req.params.id);
        res.status(200).jsonp(tvshow);
    });
};

//POST - Insert a new TVShow in the DB
exports.addUser = function(req, res) {  
    console.log('POST');
    console.log(req.body);

    var user = new User({    	
	  nombre:   	req.body.nombre,
	  apellidos: 	req.body.apellidos,
	  telefono:  	req.body.telefono,
	  direccion:  	req.body.direccion,
	  codigoPostal: req.body.codigoPostal,  
	  email: 		req.body.email,
	  clave : 		req.body.clave
    });

    user.save(function(err, user) {
        if(err) return res.status(500).send( err.message);

        User.findOne({ email: user.email }, function(err, user) {
        	if(err) return res.status(500).send( err.message);

	        // test a matching password
	        user.comparePassword(user.clave, function(err, isMatch) {
	            if(err) return res.status(500).send( err.message);            
	        });    
        
        });
        res.status(200).jsonp(user);
    });
};