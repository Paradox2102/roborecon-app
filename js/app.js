---
---
'use strict';

// will create app namespace *unless* it already exists because another .js
// file using the same namespace was loaded first
var ParadoxScout = ParadoxScout || {};

ParadoxScout.start = function(next) {
  // the 4 digit year functions as they competition key!
  ParadoxScout.CompetitionYear = new Date().getFullYear();

  // default event key
  ParadoxScout.CurrentEventKey = '{{ site.scout.currentevent }}'; 

  // default minutes to check TBA for scoring updates
  ParadoxScout.ScoringUpdateIntervalInMinutes = 5;

  // look for new scoring data every 5 mins
  setInterval(function() {
    ParadoxScout.updateEventScores(null, function(){ console.log('done'); });
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

  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
    } else {
      // No user is signed in.
      AppUtility.invalidateCache();
      if (location.pathname.indexOf('/login') < 0) return (location.href = siteUrl + '/login');
    }
    personalize(user);
  });
  // if user is not authenticated, invalidate cache and route to /login as needed
  // if (!ParadoxScout.DataService.isAuthenticated()) {
  //   AppUtility.invalidateCache();

  //   if (location.pathname.indexOf('/login') < 0) return (location.href = siteUrl + '/login');
  // }

  // update ui with current user info
  //ParadoxScout.DataService.getCurrentUser(personalize);
};

// ----------------------------------------------------------------------
// REGISTRATION, LOGIN/LOGOUT, personalization methods
// ----------------------------------------------------------------------
ParadoxScout.loginWithOAuth = function(provider, next) {
  ParadoxScout.DataService.logout();
  ParadoxScout.DataService.loginWithOAuth(provider, next);
};

ParadoxScout.logout = function(next) {
  ParadoxScout.DataService.logout();
  AppUtility.invalidateCache();
  next();
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
    $.each (data, function(i, item) {
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
    $.each (data, function(i, item) {
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
    };

    // build teams & event-teams json
    var teams = {}, eventTeams = {};

    $.each (teamsData[0], function(i, item) {
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
ParadoxScout.getMatches = function(eventKey, next) { 
  eventKey = verifyEventKey(eventKey);
  
  ParadoxScout.DataService.getMatches(eventKey, next);
};

ParadoxScout.getMatchIntelligence = function(eventKey, blueTeams, redTeams, next) {
  eventKey = verifyEventKey(eventKey);
  
  ParadoxScout.DataService.getMatchIntelligence(eventKey, blueTeams, redTeams, function(data) {
    //console.log(data);
    var summary = {};

    $.each(data, function(k,v) {
      // get arrays of individual match scores and scouting reports
      if(!v.scores) v.scores = {};  // in case no data for team
      
      var matchScores = $.map(v.scores.scores, function(item) { return item; });
      var teamReports = $.map(v.reports, function(item) { return item; });

      summary[k] = {
        team_key: v.team_key,
        oprs: v.scores.oprs || 0,
        ccwms: v.scores.ccwms || 0,
        matches_played: v.scores.scores ? Object.keys(v.scores.scores).length: 0,
        total_points: matchScores.reduce(function(prevVal, match) { return prevVal + match.totalPoints; }, 0),
        teleop_points: matchScores.reduce(function(prevVal, match) { return prevVal + match.teleopPoints; }, 0),
        auto_points: matchScores.reduce(function(prevVal, match) { return prevVal + match.autoPoints; }, 0),
        crossing_points: matchScores.reduce(function(prevVal, match) { return prevVal + (match.autoCrossingPoints + match.teleopCrossingPoints); }, 0),
        challenge_scale_points: matchScores.reduce(function(prevVal, match) { return prevVal + (match.teleopChallengePoints + match.teleopScalePoints); }, 0),
        high_goals_count: matchScores.reduce(function(prevVal, match) { return prevVal + (match.autoBouldersHigh + match.teleopBouldersHigh); }, 0),
        low_goals_count: matchScores.reduce(function(prevVal, match) { return prevVal + (match.autoBouldersLow + match.teleopBouldersLow); }, 0),
      };

      // iterate through each reports ratings in order to determine # of times each criteria was rated and overall score
      $.each(teamReports, function(reportKey, report) {
        $.each(report, function (ratingKey, ratingVal) {
          if (!ratingKey.startsWith('rating_obstacle') && !ratingKey.startsWith('rating_overall') && !ratingKey.startsWith('rating_scoring')) return;

          var ratingCount = (summary[k].hasOwnProperty(ratingKey)) ? summary[k][ratingKey].count + 1 : 1;

          var ratingScore = 0.0;
          if(ratingKey.endsWith("_auto")) {
            ratingScore = ratingCount;
          }
          else {
            ratingScore = (summary[k].hasOwnProperty(ratingKey)) ? summary[k][ratingKey].score + parseInt(ratingVal) : parseInt(ratingVal);
          }

          summary[k][ratingKey] = { score: ratingScore, count: ratingCount };
        });
      });
    });

    //console.log(summary);
    next(summary);
  });
};

// combines event scores with user ratings
ParadoxScout.getEventScoutingData = function(eventKey, next) { 
  eventKey = verifyEventKey(eventKey);
  
  ParadoxScout.DataService.getEventScoutingData(eventKey, next);
};

ParadoxScout.getScoutingReports = function(eventKey, teamKey, eventListener, next) {
  eventKey = verifyEventKey(eventKey);

  // callback signature varies from 'value' to 'child_added' | 'child_changed' | 'child_removed'
  var callback = null;
  if (eventListener === 'value'){
    callback = function(snap) {
      next(snap);
    };
  }
  else {
    callback = function(childSnap, prevChildKey) {
      next(childSnap, prevChildKey);
    };
  }
  
  // listen for scouting reports
  ParadoxScout.DataService.onScoutingReportAdded(eventKey, teamKey, eventListener, callback, function(error) {
    AppUtility.showErrorMsg(error);
    next(null, null);
  });
};

ParadoxScout.onTeamScoreAdded = function(eventKey, teamKey, eventListener, next) {
  eventKey = verifyEventKey(eventKey);

  // callback signature varies from 'value' to 'child_added' | 'child_changed' | 'child_removed'
  var callback = null;
  if (eventListener === 'value'){
    callback = function(snap) {
      next(snap);
    };
  }
  else {
    callback = function(childSnap, prevChildKey) {
      next(childSnap, prevChildKey);
    };
  }
  
  // listen for scoring changes
  ParadoxScout.DataService.onTeamScoreAdded(eventKey, teamKey, eventListener, callback, function(error) {
    AppUtility.showErrorMsg(error);
    next(null, null);
  });
};

// update db with all current match scoring data from TBA
ParadoxScout.updateEventScores = function(eventKey, next) {
  eventKey = verifyEventKey(eventKey);

  if (!ParadoxScout.DataService.isAuthenticated()) return;

  ParadoxScout.DataService.getEvent(eventKey, function(eventSnapshot) {
    var e = eventSnapshot.val();

    var today = new Date();
    var eventStart = new Date(e.start_date.replace(/-/g,"/"));
    var eventEnd = new Date(e.end_date.replace(/-/g,"/"));

    var scoresLastUpdatedAt = e.scores_updated_at ? new Date(e.scores_updated_at) : eventStart;
    var minutesSinceScoresUpdatedAt = Math.round((today.getTime() - scoresLastUpdatedAt.getTime()) / 60000); 

    // ONLY call API and update db if last scoring update > 5 mins ago AND event is happening!!!
    // if(minutesSinceScoresUpdatedAt < ParadoxScout.ScoringUpdateIntervalInMinutes + 1) {
    if (today < eventStart || 
        today > eventEnd.setDate(eventEnd.getDate() + 1) || 
        (minutesSinceScoresUpdatedAt < ParadoxScout.ScoringUpdateIntervalInMinutes + 1) ) {
    
      next();
      return;
    }
    
    // fetch scores from TBA and update db
    ParadoxScout.ApiService.getAllMatchDetails(eventKey, next)
      .done(function(matchDetails, statsDetails, rankingDetails) {
        var matchData = matchDetails[0];
        var statsData = statsDetails[0];
        var rankingData = rankingDetails[0];

        // get current datetime
        var updatedAt = Firebase.ServerValue.TIMESTAMP; // moment().format('YYYY-MM-DD, h:mm:ss a'); //'2016-01-12 2:50pm';

        // get all the match scores by team; 1 entry per team + match
        var teamScores = [];

        // high level match information here (e.g. alliances, alliance scores, etc...)
        var matches = {};

        $.each (matchData, function(i, match) {
          // add match alliance data
          matches[match.key] = {
            comp_level: match.comp_level,
            number: match.match_number,
            time: match.time,
            set_number: match.set_number,
            alliances: match.alliances
          };

          // if match isn't scored yet!
          if (!match.score_breakdown) return;

          // 2016 - combine obstacles names and crossings into ONE key
          
          
          match.score_breakdown.blue[match.score_breakdown.blue.position2] = parseInt(match.score_breakdown.blue.position2crossings) || 0;
          match.score_breakdown.blue[match.score_breakdown.blue.position3] = parseInt(match.score_breakdown.blue.position3crossings) || 0;
          match.score_breakdown.blue[match.score_breakdown.blue.position4] = parseInt(match.score_breakdown.blue.position4crossings) || 0;

          match.score_breakdown.red[match.score_breakdown.red.position2] = parseInt(match.score_breakdown.red.position2crossings) || 0;
          match.score_breakdown.red[match.score_breakdown.red.position3] = parseInt(match.score_breakdown.red.position3crossings) || 0;
          match.score_breakdown.red[match.score_breakdown.red.position4] = parseInt(match.score_breakdown.red.position4crossings) || 0;
          
         
          //for each d in tba_api_scoring_config:
          //if(sub in d)
          //    match.score_breakdown.blue[match.score_breakdown.blue[d.id]] = parseInt(match.score_breakdown.blue[d.sub]) || 0;
          //    match.score_breakdown.red[match.score_breakdown.red[d.id]] = parseInt(match.score_breakdown.red[d.sub]) || 0;
          //    add team/match data to array for each alliance
          
          
          $.each (match.alliances.blue.teams, function(i, team) {
            teamScores.push({ matchKey: match.key, match_time: match.time, teamKey: team, scores: match.score_breakdown.blue });
          });

          $.each (match.alliances.red.teams, function(i, team) {
            teamScores.push({ matchKey: match.key, match_time: match.time, teamKey: team, scores: match.score_breakdown.red });
          });
        });

        // format the team scoring json into a format suitable for our db
        var teamEventDetails = {};

        $.each (teamScores, function(i, score) {
          var matchScore = score.scores;
          matchScore.match_time = score.match_time;

          if (score.teamKey in teamEventDetails) {
            teamEventDetails[score.teamKey].scores[score.matchKey] = matchScore;
          }
          else {
            var firstMatch = {};
            firstMatch[score.matchKey] = matchScore;
            teamEventDetails[score.teamKey] = { 
              competition_id: ParadoxScout.CompetitionYear, 
              updated_at: updatedAt, 
              scores: firstMatch,
              oprs: (statsData && statsData.oprs) ? statsData.oprs[score.teamKey.replace('frc','')] || 0 : 0,
              ccwms: (statsData && statsData.ccwms) ? statsData.ccwms[score.teamKey.replace('frc','')] || 0 : 0,
              dprs: (statsData && statsData.dprs) ? statsData.dprs[score.teamKey.replace('frc','')] || 0: 0,
              ranking: 0,
              rankingScore: 0,
              rankingAuto: 0,
              rankingScaleChallenge: 0,
              rankingGoals: 0,
              rankingDef: 0,
              rankingPlayed: 0,
            };

            $.each (rankingData, function(index, arr) { 
              var k = score.teamKey.replace('frc','');
              if (arr[1] === k) {
                teamEventDetails[score.teamKey].ranking = arr[0];
                teamEventDetails[score.teamKey].rankingScore = arr[2];
                teamEventDetails[score.teamKey].rankingAuto = arr[3];
                teamEventDetails[score.teamKey].rankingScaleChallenge = arr[4];
                teamEventDetails[score.teamKey].rankingGoals = arr[5];
                teamEventDetails[score.teamKey].rankingDef = arr[6];
                teamEventDetails[score.teamKey].rankingPlayed = arr[8];
              }
              
            });
          }
        });

        // update db
        ParadoxScout.DataService.updateEventScoresAndMatchDetails(eventKey, teamEventDetails, matches, next);
      })
      .fail(function(error) {
        next(error);
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
    ParadoxScout.DataService.addScoutingReport(eventKey, data, next);
  });
};


// ----------------------------------------------------------------------
// UTILITY METHODS
// ----------------------------------------------------------------------
// return default eventKey if ek is null or undefined
var verifyEventKey = function(ek) {
  return (ek === undefined || ek === null) ? ParadoxScout.CurrentEventKey : ek;
};

// binds UI elements to user details
var personalize = function(user) {
  var ViewModel = {
    isLoggedIn: user ? true : false,
    name: ko.computed(function() {
      return user ? user.displayName : '';
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
  };


  ko.applyBindings(ViewModel);
};
