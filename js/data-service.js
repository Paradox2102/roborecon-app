
var ParadoxScout = ParadoxScout || {};

ParadoxScout.DataService = function() {
  // private attributes
  dbRootUrl = 'https://brilliant-torch-6506.firebaseio.com/',
  dbRef = new Firebase(dbRootUrl),   // init firebase db
  dbUsersRef = dbRef.child('users'),

  // private methods
  // authentication/authorization methods
  loginWithOAuth = function(provider, next) {
      // upsert user
      var user_key = null;
      var authData = null;

      dbRef.authWithOAuthPopup(provider)
        // see if user exists
        .then(function(auth) {
          user_key = cleanUserKey(auth[provider].email);
          authData = auth;
          return dbUsersRef.child(user_key).once('value');
        })
        // insert new users else update the given provider info for existing user
        .then(function(u) {
          var user_auth = {};
          user_auth[authData.provider] = authData.uid;

          if (!u.exists()) {
            var newUser = { name: authData.github.displayName, email: authData.github.email, user_authentications: user_auth };
            return dbUsersRef.child(user_key).set(newUser);
          }
          else {
            return dbUsersRef.child(user_key + '/user_authentications').set(user_auth);
          }
        })
        // set the auth information under the user_authentications node as well
        .then(function() {
          dbRef.child('user_authentications/' + authData.uid).set({ user_id: user_key }, next);
        })
        .catch(function(error) {
          if (error.code === 'TRANSPORT_UNAVAILABLE') {
            // fallback to browser redirects, and pick up the session
            // automatically when we come back to the origin page
            dbRef.authWithOAuthRedirect(provider, function(error) {
              next(error);
            });
          }
          else {
            next(error);
          }
        });
  },

  logout = function() {
    dbRef.unauth();
  },

  // init firebase authenticatin events; useful in SPAs
  // dbRef.onAuth(function(authData) {});
  // dbRef.offAuth(function(authData) {});

  getCurrentUser = function(next) {
      // always do a server-side verification as a successful oauth login does not necessarily mean
      // the user is verified in the application
      var authData = dbRef.getAuth();
      var provider = authData == null ? null : authData.provider;

      if (authData) {
        var user_key = cleanUserKey(authData[provider].email);
        dbRef.child('users').child(user_key).once('value', function(user) {
            next(user.val());
        });
      }
      else {
        next(null);
      }
  },

  // event and teams methods
  upsertEventAndTeams = function(eventKey, eventData, teamsData, eventTeamsData, next) {
    dbRef.child('/events/' + eventKey).set(eventData)
      .then(function() {
        return dbRef.child('/teams').update(teamsData)
      })
      .then(function() {
        return dbRef.child('/event_teams/' + eventKey).set(eventTeamsData)
      })
      .then(next)
      .catch(function(error) {
        console.log.bind(console)
        next(error)
      });
  },


  // utility methods
  cleanUserKey = function (email) {
    return email.replace('.', '%2E');
  }

  // public api
  return {
    loginWithOAuth: loginWithOAuth,
    logout: logout,
    upsertEventAndTeams: upsertEventAndTeams,
    getCurrentUser: getCurrentUser
  };

}();
