exports = module.exports = function(app, mongoose) {

  var mongoose = require('mongoose'),  
    Schema   = mongoose.Schema;

  var OrderSchema  = new Schema({   
    codPedido : {type: String, required : true, index: { unique: true } }, 
    emailUser:    { type: String, required : true },
    imagenes : [{
          data : String,
          size : String
     }],
    codTienda:      { type: String, required : true },
    fechaPedido:    { type: Date },
    fechaEntrega:   { type: Date },
    total:          { type : Number },
    direccion:      { type: String }   
  })

  OrderSchema.pre('save', function(next) {
      var order = this;

      order.fechaPedido = new Date();
      order.codPedido = order.codTienda+'1000';
      

      
  })

 

    mongoose.model('Order', OrderSchema); 

};