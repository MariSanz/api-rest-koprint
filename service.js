var jwt = require('jwt-simple');  
var moment = require('moment');  
var config = require('./config');

exports.createToken = function(user) {  
  var payload = {
    sub: user._id,
    iat: moment().unix(), //tiempo actual
    exp: moment().add(14, "days").unix(), //agregamos el tiempo de expiracion
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
};