var mongoose = require('mongoose');
var User  = mongoose.model('User');

exports.validateUniqueEmail = function validateUniqueEmail(valorEmail, cb) {
    console.log('Validando ' + valorEmail);
    User.findOne({ email: valorEmail }, function(err, user) {
      console.log('user: ' + user);
      cb(!user);
    });
  }
