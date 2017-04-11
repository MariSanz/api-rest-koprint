
var mongoose = require('mongoose'),
    User     = mongoose.model('User'),
    Schema   = mongoose.Schema;

mongoose.model('OAuthTokens', new Schema({
  accessToken: { type: String },
  accessTokenExpiresOn: { type: Date },
  clientId: { type: String }, // Id de la aplicación cliente (solo hay una)
  refreshToken: { type: String },
  refreshTokenExpiresOn: { type: Date },
  userId: { type: String }  // email del cliente
}));

var OAuthTokensModel = mongoose.model('OAuthTokens');

module.exports.getAccessToken = function(bearerToken, done) {
  console.log('in getAccessToken (bearerToken: ' + bearerToken + ')');

  var token;
  OAuthTokensModel.findOne({ accessToken: bearerToken })
    .then(_token => {
      token = _token;
      return User.findOne({ _id: token.userId })
    })
    .then(_user => {
      if (_user) {
        done(null, {
          accessToken: token.accessToken,
          user: _user
        });
      }
      else {
        done(null);
      }
    })
    .catch(err => done(err));
};

module.exports.getClient = function(clientId, clientSecret) {
  console.log('in getClient (clientId: ' + clientId + ', clientSecret: ' + clientSecret + ')');

  return {
      clientId: 'Cliente-Cordova',
      clientSecret: clientSecret,
      grants: [
        "password",
        "authorization_code",
        "refresh_token"
      ]
    };
};

module.exports.getRefreshToken = function(refreshToken) {
  console.log('in getRefreshToken (refreshToken: ' + refreshToken + ')');

  return OAuthTokensModel.findOne({ refreshToken: refreshToken });
};

module.exports.getUser = function(username, password, done) {
  console.log('in getUser (username: ' + username + ', password: ' + password + ')');

  //return User.findOne({ username: username, password: password });
  User.findOne({ email: username })
    .then(user => {
      if (user) {
        user.comparePassword(password, (err, coincide) => {
          if (err) {
            done(err);
          }
          else {
            if (coincide) {
              done(null, user);
            }
            else {
              done(null);
            }
          }
        });
      }
      else {
        done(null);
      }
    })
  .catch(err => {
    console.error(err);
    done(null);
  });
};

module.exports.saveToken = function(token, client, user, done) {
  console.log('in saveToken (token: ' + token + ')');

  var accessToken = new OAuthTokensModel({
    accessToken: token.accessToken,
    accessTokenExpiresOn: token.accessTokenExpiresOn,
    clientId: client.id,
    refreshToken: token.refreshToken,
    refreshTokenExpiresOn: token.refreshTokenExpiresOn,
    userId: user.id
  });

  accessToken.save()
    .then(() => {
      done(null, {
        user: user,
        client: client,
        scope: '',
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresOn,
        refreshTokenExpiresAt: token.accessTokenExpiresOn,
      })
    })
    .catch(err => done(err));
};