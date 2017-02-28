---
---
'use strict';

// will create app namespace *unless* it already exists because another .js
// file using the same namespace was loaded first
var ParadoxScout = ParadoxScout || {};

ParadoxScout.DataService = (function() {
  // private attributes
  var dbRootUrl = "{{ site.scout.firebase.rooturl }}",
  // dbRef = new Firebase(dbRootUrl),   // init firebase db
  // Initialize Firebase
  config = {
    apiKey: "{{ site.scout.firebase.apikey }}",
    authDomain: "{{ site.scout.firebase.authdomain }}",
    databaseURL: "{{ site.scout.firebase.databaseurl }}",
    storageBucket: "{{ site.scout.firebase.storagebucket }}",
    messagingSenderId: "{{ site.scout.firebase.messagingsenderid }}"
  },
  dbRef = firebase.initializeApp(config).database().ref(),
  dbUsersRef = dbRef.child('users'), 

  // private methods
  // ----------------------------------------------------------------------
  // REGISTRATION, LOGIN/LOGOUT, personalization methods
  // ----------------------------------------------------------------------
  loginWithOAuth = function(provider_name, next) {
    // upsert user
    var user = null;
    var user_key = null;    
    var provider = null;

    // IMPORTANT - must request user e-mail differently for each oauth provider to
    // ensure it is sent
    if(provider_name === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('https://www.googleapis.com/auth/userinfo.email')
    }
    else if(provider_name === 'github')
    {
      provider = new firebase.auth.GithubAuthProvider();
      provider.addScope('user')
    }

    // dummy function() necessary as callback in order to specify oauth options
    firebase.auth().signInWithPopup(provider)
      // 1. capture authentication info and validate email is whitelisted
      .then(function(result) {
        user = result.user;
        if (user === null | user.email === null) {
          return new Error('No e-mail address specified!');
        }

        // clean the userKey and get auth object
        user_key = cleanUserKey(user.email);
        return dbRef.child('user_whitelist/' + user_key).once('value');
      })
      // 2. see if whitelisted user exists
      .then(function(u) {
        return dbUsersRef.child(user_key).once('value');
      })
      // 3. insert new users else update the given provider info for existing user
      .then(function(u) {
        // get user info
        var name = user.displayName || user.email;
        var email = user.email;
        var user_auth = {}; user_auth[provider_name] = user.uid;

        if (!u.exists()) {
          // 3a. add new user
          return dbUsersRef.child(user_key).set({ name: name, email: email, user_authentications: user_auth });
        }
        else {
          // 3b. update existing user (both profile and authentications)
          dbUsersRef.child(user_key).update({ name: name, email: email });
          dbUsersRef.child(user_key + '/user_authentications/' + provider_name).set(user.uid);
          return;
        }
      })
      // 4. set the auth information under the user_authentications node as well
      .then(function() {
        dbRef.child('user_authentications/' + user.uid).set({ user_id: user_key }, next);
      })
      .catch(function(error) {
        // destroy auth token
        logout();

        // if oauth pop-up was the problem, do a redirect ... else pass error to the callback
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
    firebase.auth().signOut();
  },

  isAuthenticated = function() {
    var user = firebase.auth().currentUser;
    return user !== null && user.email !== null;
  },

  getCurrentUser = function(next) {
    // get auth and provider data
    var user = firebase.auth().currentUser; //dbRef.getAuth();

    if (user && user.email) {
      // try getting from cache first
      next({ 
        key: cleanUserKey(user.email), 
        email: user.email, 
        name: user.displayName || user.email
        });
      }
    else {
      logout();
      next(null);
    }
  },

  // ----------------------------------------------------------------------
  // EVENT and TEAM methods
  // ----------------------------------------------------------------------
  getEvent = function(eventKey, next) {
    dbRef.child('/events/' + eventKey).once('value', next);
  },

  getTeams = function(eventKey, next) {
    var cacheKey = 'paradox-scout:' + eventKey + ':teams';

    // check cache first
    var cachedData = AppUtility.getCacheData(cacheKey); 
    if (cachedData) { 
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

      $.each (teams, function(teamKey, team) {
        if (teamKey in validTeams) {
          teamsData.push({ team_key: teamKey, team_number: team.team_number, team_name: team.team_number + ' - ' + team.nickname, team_website: team.website });
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

  getTeamScoringDetails = function(eventKey, teamKey) {
    return dbRef.child('/event_scores/' + eventKey).child(teamKey).once('value');
  },

  getTeamScoutingReports = function(eventKey, teamKey) {
    return dbRef.child('/event_scouting_reports/' + eventKey).orderByChild('team_id').equalTo(teamKey).once('value');
  },

  updateEventAndTeams = function(eventKey, eventData, teamsData, eventTeamsData, next) {
    dbRef.child('/events/' + eventKey).set(eventData)
      .then(function() {
        return dbRef.child('/teams').update(teamsData);
      })
      .then(function() {
        return dbRef.child('/event_teams/' + eventKey).set(eventTeamsData);
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
  getMatches = function(eventKey, next) {
    // check cache first
    var cacheKey = 'paradox-scout:' + eventKey + ':matches';

    var cachedData = AppUtility.getCacheData(cacheKey);
    if (cachedData) {
      next(cachedData);
      return;
    }

    dbRef.child('/event_matches/' + eventKey).orderByChild('time').once('value')
      .then(function(matchDataSnapshot) {
        var matches = [];

        // use forEach to ensure order by time
        matchDataSnapshot.forEach(function(matchSnapshot) {
          var match = matchSnapshot.val();
          var matchKey = matchSnapshot.key;
          
          matches.push({ 
            match_key: matchKey,  
            match_comp_level: match.comp_level,
            match_number: match.number,
            match_set_number: match.set_number,
            match_time: match.time,
            blue_alliance_0: match.alliances.blue.teams[0],
            blue_alliance_1: match.alliances.blue.teams[1],
            blue_alliance_2: match.alliances.blue.teams[2],
            blue_score: match.alliances.blue.score || 0,
            red_alliance_0: match.alliances.red.teams[0],
            red_alliance_1: match.alliances.red.teams[1],
            red_alliance_2: match.alliances.red.teams[2],
            red_score: match.alliances.red.score || 0,
          });
        });

        // cache and then return
        AppUtility.setCacheData(cacheKey, matches);
        next(matches);
      })
      // handle exceptions
      .catch(function(error) {
        next(null, error);
      });
  },

  getMatchIntelligence = function(eventKey, blueTeams, redTeams, next) {
    // wtg 4/22/16 - there is probably a better way via redesigning the FB db
    Promise.all([ 
      getTeamScoringDetails(eventKey, blueTeams[0]), getTeamScoutingReports(eventKey, blueTeams[0]),
      getTeamScoringDetails(eventKey, blueTeams[1]), getTeamScoutingReports(eventKey, blueTeams[1]),
      getTeamScoringDetails(eventKey, blueTeams[2]), getTeamScoutingReports(eventKey, blueTeams[2]), 
      getTeamScoringDetails(eventKey, redTeams[0]), getTeamScoutingReports(eventKey, redTeams[0]), 
      getTeamScoringDetails(eventKey, redTeams[1]), getTeamScoutingReports(eventKey, redTeams[1]), 
      getTeamScoringDetails(eventKey, redTeams[2]), getTeamScoutingReports(eventKey, redTeams[2])
    ])
    .then(function(snapshots) {
      var blueScoring0 = snapshots[0].val();
      var blueScouting0 = snapshots[1].val();

      var blueScoring1 = snapshots[2].val();
      var blueScouting1 = snapshots[3].val();

      var blueScoring2 = snapshots[4].val();
      var blueScouting2 = snapshots[5].val();

      var redScoring0 = snapshots[6].val();
      var redScouting0 = snapshots[7].val();

      var redScoring1 = snapshots[8].val();
      var redScouting1 = snapshots[9].val();

      var redScoring2 = snapshots[10].val();
      var redScouting2 = snapshots[11].val();

      next({
        blue0: { team_key: blueTeams[0], scores: blueScoring0, reports: blueScouting0 }, 
        blue1: { team_key: blueTeams[1], scores: blueScoring1, reports: blueScouting1 }, 
        blue2: { team_key: blueTeams[2], scores: blueScoring2, reports: blueScouting2 }, 
        red0: { team_key: redTeams[0], scores: redScoring0, reports: redScouting0 }, 
        red1: { team_key: redTeams[1], scores: redScoring1, reports: redScouting1 }, 
        red2: { team_key: redTeams[2], scores: redScoring2, reports: redScouting2 } 
      });
    });
  },

  getEventScoutingData = function(eventKey, next) {
    // check cache first
    var cacheKey = 'paradox-scout:' + eventKey + ':event-scouting-data';

    var cachedData = AppUtility.getCacheData(cacheKey);
    if (cachedData) {
      next(cachedData);
      return;
    }

    getTeams(eventKey, function(teamsData) {

      getEventScores(eventKey).then(function(teamData) {
        // build an object that contains one record per team
        var teams = {};

        $.each (teamData, function(teamKey, teamDetails) {
          // get list of matches
          var matches = teamDetails.scores;

          $.each (matches, function(matchKey, match) {

            if (teams.hasOwnProperty(teamKey)) {
              // if team exists in 'teams', sum existing scoring category values
              $.each (match, function(scoringCategoryKey, scoringCategoryValue) {
                // if looking at teamKey or matchTime, continue to next item
                if (scoringCategoryKey === 'team_key' || scoringCategoryKey === 'match_time') return true;

                if ($.isNumeric(scoringCategoryValue)) {
                  teams[teamKey][scoringCategoryKey] = (teams[teamKey][scoringCategoryKey] || 0) + match[scoringCategoryKey];
                }
                else if (scoringCategoryValue === 'true' || scoringCategoryValue === 'false') {
                  var currentVal = JSON.parse(teams[teamKey][scoringCategoryKey] );
                  var newVal = scoringCategoryValue === 'true' ? 1 : 0;

                  teams[teamKey][scoringCategoryKey] = currentVal + newVal;
                }
              });
            }
            else {
              // get team details
              var t = teamsData.find(function(record) {
                return record.team_key === teamKey;
              });

              // add default data
              teams[teamKey] = match;
              teams[teamKey].team_key = teamKey;
              teams[teamKey].team_number = parseInt(t ? t.team_number : teamKey.replace('frc',''));
              teams[teamKey].team_name = (t ? t.team_name : teamKey); 
              teams[teamKey].oprs = teamDetails.oprs;
              teams[teamKey].ccwms = teamDetails.ccwms;
              teams[teamKey].dprs = teamDetails.dprs;

              // add configurable ranking data
              tba_api_ranking_config.forEach(function(el) {
                teams[teamKey][el.id] = teamDetails[el.id] || 0;
              });
            }
          });
        });

        // convert teams object into an array for datatables
        var teamsArray = $.map(teams, function(item) { return item; });

        // cache and then return
        AppUtility.setCacheData(cacheKey, teamsArray);
        return next(teamsArray);
      })
      .catch(function(error) {
        next(null, error);
      });
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

  updateEventScoresAndMatchDetails = function(eventKey, scoringData, matchData, next) {
    // update all scoring data
    dbRef.child('/event_scores/' + eventKey).set(scoringData)
      // update all scheduled match data
      .then(function() {
        dbRef.child('/event_matches/' + eventKey).set(matchData);
      })
      // set last time scoring updated from TBA 
      .then(function() {
        dbRef.child('/events/' + eventKey + '/scores_updated_at').set(firebase.database.ServerValue.TIMESTAMP);
      })
      .then(next)
      .catch(function(error) { 
        console.log.bind(console);  
        next(error); 
      });
  },

  _teamScoresRef = null,
  onTeamScoreAdded = function(eventKey, teamKey, eventListener, next, onError) {
    // default event listener to 'child_added'
    if(!eventListener) eventListener = 'child_added';

    // if ref already exists, turn off any exising handlers for the specified event listener
    if(typeof _teamScoresRef === 'object' && _teamScoresRef !== null) _teamScoresRef.off(eventListener);

    // get all match scores for a team if specified, else get all team's match scores for the event
    if(teamKey) {
      _teamScoresRef = dbRef.child('/event_scores/' + eventKey).child(teamKey);
      return _teamScoresRef.on(eventListener, next, onError);
    }
    else {
      _teamScoresRef = dbRef.child('/event_scores/' + eventKey);
      return _teamScoresRef.orderByKey().on(eventListener, next, onError);
    }
  },

  _scoutingReportsRef = null,
  onScoutingReportAdded = function(eventKey, teamKey, eventListener, next, onError) {
    // default event listener to 'child_added'
    if (!eventListener) eventListener = 'child_added';

    // if ref already exists, turn off any exising handlers for the specified event listener
    if (typeof _scoutingReportsRef === 'object' && _scoutingReportsRef !== null) _scoutingReportsRef.off(eventListener);

    // update current ref
    _scoutingReportsRef = dbRef.child('/event_scouting_reports/' + eventKey);
    
    // get all reports for a team if specified, else get all reports for the event
    if (teamKey)
      return _scoutingReportsRef.orderByChild('team_id').equalTo(teamKey).on(eventListener, next, onError);
    else
      return _scoutingReportsRef.orderByKey().on(eventListener, next, onError);
  },


  // ----------------------------------------------------------------------
  // UTILITY METHODS
  // ----------------------------------------------------------------------
  cleanUserKey = function (email) {
    // firebase keys cannot include ., $, #, [, ], / characters
    return email.toLowerCase()
      .replace(/\./g, '%2E')
      .replace(/\$/g, '%24')
      .replace(/\#/g, '%23')
      .replace(/\[/g, '%5B')
      .replace(/\]/g, '%5D')
      .replace(/\//g, '%2F');
  };

  // public api
  return {
    loginWithOAuth: loginWithOAuth,
    logout: logout,
    isAuthenticated: isAuthenticated,
    getCurrentUser: getCurrentUser,

    getEvent: getEvent,
    getTeams: getTeams,
    getMatches: getMatches,
    getMatchIntelligence: getMatchIntelligence,
    updateEventAndTeams: updateEventAndTeams,

    onScoutingReportAdded: onScoutingReportAdded,
    onTeamScoreAdded: onTeamScoreAdded,
    getEventScoutingData: getEventScoutingData,
    updateEventScoresAndMatchDetails: updateEventScoresAndMatchDetails,
    addScoutingReport: addScoutingReport
  };

})();

