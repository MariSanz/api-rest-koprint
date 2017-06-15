var mongoose = require('mongoose');  
var Order  = mongoose.model('Order');

//POST - Insert a new TVShow in the DB
exports.addOrder = function(req, res) {  
    console.log('POST');
    console.log(req.body);


    var order = new Order({    	
	  codPedido:   	req.body.codPedido,
	  emailUser: 	req.body.emailUser,
	  imagenes:  	req.body.imagenes,
	  codTienda:  	req.body.codTienda,
	  fechaEntrega: req.body.fechaEntrega,  
	  total: 		req.body.total,
	  direccion : 			req.body.direccion
    });

    order.save(function(err, order) {
        if(err) return res.status(500).send( err.message);
   
    	res.status(200).jsonp(user);
    });
};