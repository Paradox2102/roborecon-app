
var ParadoxScout = ParadoxScout || {};

ParadoxScout.DataService = function() {
  // private attributes
  dbRootUrl = 'https://brilliant-torch-6506.firebaseio.com/',
  dbRef = new Firebase(dbRootUrl),   // init firebase db
  dbUsersRef = dbRef.child('users'),

  // private methods
  // ----------------------------------------------------------------------
  // REGISTRATION, LOGIN/LOGOUT, personalization methods
  // ----------------------------------------------------------------------
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
          var newUser = { 
            name: authData[authData.provider].displayName || authData[authData.provider].email, 
            email: authData[authData.provider].email, 
            user_authentications: user_auth 
          };
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

  isAuthenticated = function() {
    return dbRef.getAuth() != null;
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
      // try getting from cache first-child
      if(authData.provider == 'github' || authData.provider == 'google') {
        next({ key: cleanUserKey(authData[authData.provider].email), email: authData[authData.provider].email, name: authData[authData.provider].displayName });
      }
      else {
        var user_key = cleanUserKey(authData[provider].email);
        dbRef.child('users').child(user_key).once('value', function(userSnapshot) {
          var user = userSnapshot.val();
          user.key = userSnapshot.key();
          next(user);
        });
      };
    }
    else {
      next(null);
    }
  },

  // ----------------------------------------------------------------------
  // EVENT and TEAM methods
  // ----------------------------------------------------------------------
  getTeams = function(eventKey, next) {
    var cacheKey = 'paradox-scout:' + eventKey + ':teams';

    // check cache first
    var cachedData = AppUtility.getCacheData(cacheKey);
    if(cachedData) {
      next(cachedData);
      return;
    }

    var teamsData = [];

    // based on the current schema, this method requires two calls: 
    //  1) to get all the team keys for the given
    //  2) to get all the team information of every team in database in order to build a dropdown with their full name.
    // Two options of doing this are presented below ...

    // option 1:  use Promise.all() to wait for both async operations to finish
    var eventTeamsData = dbRef.child('/event_teams/' + eventKey).once('value');
    var allTeamsData = dbRef.child('/teams').once('value');

    Promise.all([eventTeamsData, allTeamsData]).then(function(snapshots) {
   
      var validTeams = snapshots[0].val();
      var teams = snapshots[1].val();

      $.each(teams, function(teamKey, team) {
        if (teamKey in validTeams) {
          teamsData.push({ team_key: teamKey, team_number: team.team_number, team_name: team.team_number + ' - ' + team.nickname });
        }
      });

      AppUtility.setCacheData(cacheKey, teamsData);
      return next(teamsData);
    });

    /*
    // option 2:  perform async() options one after another, waiting to the last callback to determine which teams' data gets returned
    
    dbRef.child('/event_teams/' + eventKey).once('value', function(eventTeamsSnapshot) {
      // fetch valid teams for the event
      var validTeams = eventTeamsSnapshot.val();

      // fetch all teams in db
      dbRef.child('/teams').once('value', function(teamsSnapshot) {
        // iterate teams and add to data [] if a team in the selected event
        $.each(teamsSnapshot.val(), function(teamKey, team) {
          if (teamKey in validTeams) {
            teamsData.push({ team_key: teamKey, team_number: team.team_number, team_name: team.team_number + ' - ' + team.nickname });
          }
        });

        AppUtility.setCacheData(cacheKey, teamsData);
        return next(teamsData);
      });
    });

    */
  },

  updateEventAndTeams = function(eventKey, eventData, teamsData, eventTeamsData, next) {
    dbRef.child('/events/' + eventKey).set(eventData)
      .then(function() {
        return dbRef.child('/teams').update(teamsData)
      })
      .then(function() {
        return dbRef.child('/event_teams/' + eventKey).set(eventTeamsData)
      })
      .then(next)
      .catch(function(error) {
        console.log.bind(console);
        next(error);
      });
  },

  // ----------------------------------------------------------------------
  // MATCH & SCORING methods
  // ----------------------------------------------------------------------
  getEventScoutingData = function(eventKey, next) {
    // check cache first
    var cacheKey = 'paradox-scout:' + eventKey + ':event-scouting-data';

    var cachedData = AppUtility.getCacheData(cacheKey);
    if(cachedData) {
      next(cachedData);
      return;
    }

    getEventScores(eventKey).then(function(teamData) {
      // build an object that contains one record per team
      var teams = {};

      $.each(teamData, function(teamKey, teamDetails) {
        // get list of matches
        var matches = teamDetails.scores;

        $.each(matches, function(matchKey, match) {

          if(teams.hasOwnProperty(teamKey)) {
            // if team exists in 'teams', sum existing scoring category values
            $.each(match, function(scoringCategoryKey, scoringCategoryValue) {
              // if looking at teamKey or matchTime, continue to next item
              if(scoringCategoryKey == 'team_key' || scoringCategoryKey == 'match_time') return true;

              if ($.isNumeric(scoringCategoryValue)) {
                teams[teamKey][scoringCategoryKey] += match[scoringCategoryKey];
              }
              else if (scoringCategoryValue === 'true' || scoringCategoryValue === 'false') {
                var currentVal = JSON.parse(teams[teamKey][scoringCategoryKey]);
                var newVal = scoringCategoryValue === 'true' ? 1 : 0;

                teams[teamKey][scoringCategoryKey] = currentVal + newVal;
              }
            });
          }
          else {
            teams[teamKey] = match;
            teams[teamKey].team_key = teamKey;
          }
        });
      });

      // conver teams object into an array for datatables
      var teamsArray = $.map(teams, function(item) { return item; });

      // cache and then return
      AppUtility.setCacheData(cacheKey, teamsArray);
      return next(teamsArray);
    })
    .catch(function(error) {
      next(null, error);
    });
  },

  getEventScores = function(eventKey) {
    // fetch match scores provided via TBA from FB
    return new Promise(function(resolve, reject) {
      dbRef.child('/event_scores/' + eventKey).once('value').then(function(scoresSnapshot) {
        resolve(scoresSnapshot.val());
      })
      .catch(function(error) {
        reject(error);
      });
    });
  },

  addScoutingReport = function(eventKey, data, next) {
    dbRef.child('/event_scouting_reports/' + eventKey).push(data)
    .then(next())
    .catch(function(error) {
      console.log.bind(console);
      next(error);
    });
  },

  updateEventScores = function(eventKey, scoringData, next) {
    dbRef.child('/event_scores/' + eventKey).set(scoringData)
      .then(next)
      .catch(function(error) {
        console.log.bind(console);
        next(error);
      });
  },

  _teamScoresRef = null,
  onTeamScoreAdded = function(eventKey, teamKey, eventListener, next, onError) {
    // default event listener to 'child_added'
    if(!eventListener) eventListener = 'child_added'

    // if ref already exists, turn off any exising handlers for the specified event listener
    if(typeof _teamScoresRef === 'object' && _teamScoresRef != null) _teamScoresRef.off(eventListener);

    // get all match scores for a team if specified, else get all team's match scores for the event
    if(teamKey) {
      _teamScoresRef = dbRef.child('/event_scores/' + eventKey).child(teamKey + '/scores');
      return _teamScoresRef.orderByChild('match_time').on(eventListener, next, onError);
    }
    else {
      _teamScoresRef = dbRef.child('/event_scores/' + eventKey);
      return _teamScoresRef.orderByKey().on(eventListener, next, onError);
    }
  },

  _scoutingReportsRef = null,
  onScoutingReportAdded = function(eventKey, teamKey, eventListener, next, onError) {
    // default event listener to 'child_added'
    if(!eventListener) eventListener = 'child_added'

    // if ref already exists, turn off any exising handlers for the specified event listener
    if(typeof _scoutingReportsRef === 'object' && _scoutingReportsRef != null) _scoutingReportsRef.off(eventListener);

    // update current ref
    _scoutingReportsRef = dbRef.child('/event_scouting_reports/' + eventKey);
    
    // get all reports for a team if specified, else get all reports for the event
    if(teamKey)
      return _scoutingReportsRef.orderByChild('team_id').equalTo(teamKey).on(eventListener, next, onError);
    else
      return _scoutingReportsRef.orderByKey().on(eventListener, next, onError);
  },


  // ----------------------------------------------------------------------
  // UTILITY METHODS
  // ----------------------------------------------------------------------
  cleanUserKey = function (email) {
    return email.replace('.', '%2E');
  };

  // public api
  return {
    loginWithOAuth: loginWithOAuth,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getCurrentUser: getCurrentUser,

    getTeams: getTeams,
    updateEventAndTeams: updateEventAndTeams,

    onScoutingReportAdded: onScoutingReportAdded,
    onTeamScoreAdded: onTeamScoreAdded,
    getEventScoutingData: getEventScoutingData,
    updateEventScores: updateEventScores,
    addScoutingReport: addScoutingReport
  };

}();
