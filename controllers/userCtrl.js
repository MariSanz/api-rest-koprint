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

//GET - Return a User with specified email
exports.findByEmail = function(req, res) {  
    User.findByEmail(req.params.email, function(err, user) {
    if(err)  return res.status(500).send(err.message);

    console.log('GET /users/' + req.params.email);
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

    User.save(function(err, user) {
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

//PUT - Update a register already exists
exports.updateUser = function(req, res) {  
   
       var user = new User({        
          nombre:       req.body.nombre,
          apellidos:    req.body.apellidos,
          telefono:     req.body.telefono,
          direccion:    req.body.direccion,
          codigoPostal: req.body.codigoPostal,        
          clave :       req.body.clave
        });

       User.save(function(err, user) {
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

//DELETE - Delete a User with specified ID
exports.deleteUser = function(req, res) {  
    User.findByEmail(req.params.email, function(err, user) {
        user.remove(function(err) {
            if(err) return res.status(500).send(err.message);
        res.status(200).send();
        })
    });
};

exports.login = function(req, res) { 
     User.findByEmail(req.body.email, function(err, user) {
        if(err)  return res.status(500).send(err.message);

        if (!user) {
         res.json({ success: false, message: 'Authentication failed. User not found.' });
        } else if (user) {
            debugger;
            UserSchema.methods.comparePassword(req.body.clave, res);
        }

     });

};