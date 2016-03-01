// will create app namespace *unless* it already exists because another .js
// file using the same namespace was loaded first
var ParadoxScout = ParadoxScout || {};

ParadoxScout.start = function(next) {
  // the 4 digit year functions as they competition key!
  ParadoxScout.CompetitionYear = new Date().getFullYear();

  // default event key
  ParadoxScout.CurrentEventKey = '2016scmb';

  // default minutes to check TBA for scoring updates
  ParadoxScout.ScoringUpdateIntervalInMinutes = 5;

  setInterval(function() {
    ParadoxScout.updateEventScores(null, function(){ console.log('done'); })
  }, ParadoxScout.ScoringUpdateIntervalInMinutes * 60000);

  // setup default notification options
  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-top-full-width",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "3000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  // if user is not authenticated, invalidate cache and route to /login as needed
  if(!ParadoxScout.DataService.isAuthenticated()) {
    AppUtility.invalidateCache();

    if (location.pathname.indexOf('/login') < 0) return location.href = siteUrl + '/login'
  }

  // update ui with current user info
  ParadoxScout.DataService.getCurrentUser(personalize);
};

// ----------------------------------------------------------------------
// REGISTRATION, LOGIN/LOGOUT, personalization methods
// ----------------------------------------------------------------------
ParadoxScout.loginWithOAuth = function(provider, next) {
  ParadoxScout.DataService.loginWithOAuth(provider, next);
};

ParadoxScout.logout = function(next) {
  ParadoxScout.DataService.logout();
  AppUtility.invalidateCache();
  next;
};

// ----------------------------------------------------------------------
// EVENT and TEAM methods
// ----------------------------------------------------------------------
ParadoxScout.buildEventsDropdown = function(el) {
  // fetch the 2016 FRC events on load
  ParadoxScout.ApiService.getEvents(ParadoxScout.CompetitionYear).done(function(data) {
    // sort by start_date desc
    data.sort(function(a, b) {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

    // build dd options
    var options = [];
    $.each(data, function(i, item) {
      options.push($("<option></option>").attr("value", item.key).text(item.name + ' - ' + item.start_date ).prop("outerHTML"));
      //eventsDD.append($("<option/>", { value: item.key, text: item.name + ' - ' + item.start_date }));
    });

    // add options to dd
    el.append(options.join(''));
  });
};

ParadoxScout.buildTeamsDropdown = function(el, eventKey, next) {
  eventKey = verifyEventKey(eventKey);

  // fetch the teams for the given event
  ParadoxScout.DataService.getTeams(eventKey, function(data) {
    // sort by team number
    data.sort(function(a, b) {
      return parseInt(a.team_number) - parseInt(b.team_number);
    });

    // build dd options
    var options = [];
    $.each(data, function(i, item) {
      options.push($("<option></option>").attr("value", item.team_key).text(item.team_name).prop("outerHTML"));
    });

    // add options to dd
    el.append(options.join(''));

    next();
  });
};

// update db with team details for all teams participating in specified event
ParadoxScout.updateEventAndTeams = function(eventKey, next) {
  eventKey = verifyEventKey(eventKey);

  // fetch both selected event data and the teams registered for it
  ParadoxScout.ApiService.getEventAndTeams(eventKey).done(function(eventData, teamsData) {
    // build event json
    var event = {
      competition_id: ParadoxScout.CompetitionYear,
      end_date: eventData[0].end_date,
      name: eventData[0].name,
      start_date: eventData[0].start_date,
      venue_address: eventData[0].venue_address,
    }

    // build teams & event-teams json
    var teams = {}, eventTeams = {};

    $.each(teamsData[0], function(i, item) {
      eventTeams[item.key] = true;

      teams[item.key] = {
        country_name: item.country_name,
        location: item.location,
        nickname: item.nickname,
        rookie_year: item.rookie_year,
        team_number: item.team_number,
        website: item.website,
      };
    });

    // console.log(event);
    // console.log(teams);
    // console.log(eventTeams);

    // update the db with event and team information
    ParadoxScout.DataService.updateEventAndTeams(eventKey, event, teams, eventTeams, next);
  });
};

// ----------------------------------------------------------------------
// MATCH & SCORING methods
// ----------------------------------------------------------------------
// combines event scores with user ratings
ParadoxScout.getEventScoutingData = function(eventKey, next) { 
  eventKey = verifyEventKey(eventKey);
  
  ParadoxScout.DataService.getEventScoutingData(eventKey, next);
};

ParadoxScout.getScoutingReports = function(eventKey, teamKey, eventListener, next) {
  eventKey = verifyEventKey(eventKey);

  var callback = null;
  if(eventListener === 'value'){
    callback = function(snap) {
      next(snap);
    };
  }
  else {
    callback = function(childSnap, prevChildKey) {
      next(childSnap, prevChildKey);
    };
  }
  

  ParadoxScout.DataService.onScoutingReportAdded(eventKey, teamKey, eventListener, callback, function(error) {
    AppUtility.showErrorMsg(error);
    next(null, null);
  });
};

ParadoxScout.onTeamScoreAdded = function(eventKey, teamKey, eventListener, next) {
  eventKey = verifyEventKey(eventKey);

  // callback signature varies from 'value' to 'child_added' | 'child_changed' | 'child_removed'
  var callback = null;
  if(eventListener === 'value'){
    callback = function(snap) {
      next(snap);
    };
  }
  else {
    callback = function(childSnap, prevChildKey) {
      next(childSnap, prevChildKey);
    };
  }
  
  // sets up the event listener to scoring changes
  ParadoxScout.DataService.onTeamScoreAdded(eventKey, teamKey, eventListener, callback, function(error) {
    AppUtility.showErrorMsg(error);
    next(null, null);
  });
};

// update db with all current match scoring data from TBA
ParadoxScout.updateEventScores = function(eventKey, next) {
  eventKey = verifyEventKey(eventKey);

  if(!ParadoxScout.DataService.isAuthenticated()) return;

  // ONLY call API and update db if last scoring update > 5 mins ago
  ParadoxScout.DataService.getEvent(eventKey, function(eventSnapshot) {
    var e = eventSnapshot.val();

    var today = new Date();
    var eventStart = new Date(e.start_date.replace(/-/g,"/"));
    var eventEnd = new Date(e.end_date.replace(/-/g,"/"));

    var scoresLastUpdatedAt = e.scores_updated_at ? new Date(e.scores_updated_at) : eventStart;
    var minutesSinceScoresUpdatedAt = Math.round((today.getTime() -scoresLastUpdatedAt.getTime()) / 60000); 

    if(today < eventStart || today > eventEnd.setDate(eventEnd.getDate() + 1) || (minutesSinceScoresUpdatedAt < ParadoxScout.ScoringUpdateIntervalInMinutes + 1) ) {
    // if(minutesSinceScoresUpdatedAt < ParadoxScout.ScoringUpdateIntervalInMinutes + 1) {
      next();
      return;
    }
    
    // fetch scores from TBA and update db
    ParadoxScout.ApiService.getAllMatchDetails(eventKey, next)
      .done(function(matchData) {
        // get current datetime
        var updatedAt = Firebase.ServerValue.TIMESTAMP; // moment().format('YYYY-MM-DD, h:mm:ss a'); //'2016-01-12 2:50pm';

        // get all the match scores by team; 1 entry per team + match
        var teamScores = [];

        $.each(matchData, function(i, match) {
          // if match isn't scored yet!
          if(!match.score_breakdown) return;

          // 2016 - combine obstacles names and crossings into ONE key
          match.score_breakdown.blue[match.score_breakdown.blue.position2] = parseInt(match.score_breakdown.blue.position2crossings) || 0;
          match.score_breakdown.blue[match.score_breakdown.blue.position3] = parseInt(match.score_breakdown.blue.position3crossings) || 0;
          match.score_breakdown.blue[match.score_breakdown.blue.position4] = parseInt(match.score_breakdown.blue.position4crossings) || 0;

          match.score_breakdown.red[match.score_breakdown.red.position2] = parseInt(match.score_breakdown.red.position2crossings) || 0;
          match.score_breakdown.red[match.score_breakdown.red.position3] = parseInt(match.score_breakdown.red.position3crossings) || 0;
          match.score_breakdown.red[match.score_breakdown.red.position4] = parseInt(match.score_breakdown.red.position4crossings) || 0;

          // add team/match data to array for each alliance
          $.each(match.alliances.blue.teams, function(i, team) {
            teamScores.push({ matchKey: match.key, match_time: match.time, teamKey: team, scores: match.score_breakdown.blue });
          });

          $.each(match.alliances.red.teams, function(i, team) {
            teamScores.push({ matchKey: match.key, match_time: match.time, teamKey: team, scores: match.score_breakdown.red });
          });
        });

        // format the team scoring json into a format suitable for our db
        var teamEventDetails = {};

        $.each(teamScores, function(i, score) {
          var matchScore = score.scores;
          matchScore.match_time = score.match_time;

          if(score.teamKey in teamEventDetails) {
            teamEventDetails[score.teamKey].scores[score.matchKey] = matchScore;
          }
          else {
            var firstMatch = {};
            firstMatch[score.matchKey] = matchScore
            teamEventDetails[score.teamKey] = { competition_id: ParadoxScout.CompetitionYear, updated_at: updatedAt, scores: firstMatch };
          }
        });

        // update db
        ParadoxScout.DataService.updateEventScores(eventKey, teamEventDetails, next);
      })
      .fail(function(error) {
        next(error)
      });
    });
};

// add user scouting report
ParadoxScout.addScoutingReport = function(data, next) {
  var eventKey = verifyEventKey(null);

  // get current user
  var user = ParadoxScout.DataService.getCurrentUser(function(u) {
    // add in scouting metadata
    data.event_id = eventKey;
    data.scored_at = Firebase.ServerValue.TIMESTAMP; // new Date().getTime() -> e.g., 1456101425447 -or- (new Date()).toString();
    data.scored_by = { user_key: u.key, name: u.name, email: u.email };

    // console.log(data);
    ParadoxScout.DataService.addScoutingReport(eventKey, data, next)
  });
};


// ----------------------------------------------------------------------
// UTILITY METHODS
// ----------------------------------------------------------------------
// return default eventKey if ek is null or undefined
var verifyEventKey = function(ek) {
  return (ek === undefined || ek === null) ? ParadoxScout.CurrentEventKey : ek;
}

// binds UI elements to user details
var personalize = function(user) {
  var ViewModel = {
    isLoggedIn: user ? true : false,
    name: ko.computed(function() {
      return user ? user.name : '';
    }),
    login_or_out : function() {
      if (user) {
        ParadoxScout.DataService.logout();
        location.href = siteUrl;
      }
      else {
        location.href = siteUrl + '/login';
      }
    },
    login_or_out_button : ko.computed(function(){
      return user ? 'Logout' : 'Login';
    })
  }

  ko.applyBindings(ViewModel);
};
