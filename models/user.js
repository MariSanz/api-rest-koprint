
exports = module.exports = function(app, mongoose) {

  var mongoose = require('mongoose'),  
    validateUniqueEmail = require('./validators').validateUniqueEmail;
    Schema   = mongoose.Schema,
    bcrypt = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

  var UserSchema  = new Schema({   
    nombre:    { type: String },
    apellidos:     { type: Number },
    telefono:  { type: String },
    direccion:   { type: String },
    codigoPostal:  { type: Number },  
    email:  {
      type: String,
      required : true,
      index: { unique: true },
      validate: {
          isAsync: true,
          validator: validateUniqueEmail,
          message: 'El email no es unico'
        }
      },
    clave : { type: String , required : true}
  })

  UserSchema.pre('save', function(next) {
      var user = this;

      // only hash the password if it has been modified (or is new)
      if (!user.isModified('clave')) return next();

      // generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) return next(err);

          // hash the password using our new salt
          bcrypt.hash(user.clave, salt, function(err, hash) {
              if (err) return next(err);

              // override the cleartext password with the hashed one
              user.clave = hash;
              next();
          });
      });
  })

  UserSchema.methods.comparePassword = function(candidatePassword, cb) {
      bcrypt.compare(candidatePassword, this.clave, function(err, isMatch) {
          if (err) return cb(err);
          cb(null, isMatch);
    });
  };

    mongoose.model('User', UserSchema); 

};