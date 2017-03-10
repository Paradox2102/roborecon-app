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
  ParadoxScout.ScoringUpdateIntervalInMinutes = 1;

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

      // # of matches played thus far
      var matchesPlayed = v.scores.scores ? Object.keys(v.scores.scores).length: 0;

      // # of scouting reports for team
      var numScoutingReports = Object.keys(teamReports).length

      // get rating scores and counts (the number of times a team was rated for each rating category)
      var team_scouting_scores = {};
      $.each(teamReports, function(reportKey, report) {
        $.each(report, function (ratingKey, ratingVal) {
          var ratingCount = (team_scouting_scores.hasOwnProperty(ratingKey)) ? team_scouting_scores[ratingKey].count + 1 : 1;
          var ratingScore = (team_scouting_scores.hasOwnProperty(ratingKey)) ? team_scouting_scores[ratingKey].score + parseFloat(ratingVal) : parseFloat(ratingVal);

          team_scouting_scores[ratingKey] = { score: ratingScore, count: ratingCount };
        });
      });

      // include standard scoring/rating attributes
      summary[k] = {
        team_key: v.team_key,
        oprs: v.scores.oprs || 0,
        ccwms: v.scores.ccwms || 0,
        matches_played: matchesPlayed,
        total_points: matchScores.reduce(function(prevVal, match) { return prevVal + match.totalPoints; }, 0),
        teleop_points: matchScores.reduce(function(prevVal, match) { return prevVal + match.teleopPoints; }, 0),
        auto_points: matchScores.reduce(function(prevVal, match) { return prevVal + match.autoPoints; }, 0)
      };

      // build the attributes and values from the app_match_intel_config config
      var intel_attributes = app_match_intel_config.summary_panel.concat(app_match_intel_config.team_stats, app_match_intel_config.match_stats)
      intel_attributes.forEach(function(attr) {
        // don't add key if already defaulted
        if (attr.id in summary[k]) 
        {
          summary[k][attr.id] = +summary[k][attr.id].toFixed(attr.decimal_places || 2);
          return;
        }

        if (attr.calc_type && attr.calc_type === 'avg') {
          var num_scout_ratings_used = 0;
          var num_match_categories_used = 0;

          var tot_match_scores = 0.0;
          var scout_scores_avgs = [];

          attr.agg.forEach(function(field) {
            if (field.startsWith('rating_')) {
              num_scout_ratings_used += 1
              scout_scores_avgs.push(field in team_scouting_scores ? team_scouting_scores[field].score / team_scouting_scores[field].count : 0.0);
            }
            else {
              num_match_categories_used += 1
              tot_match_scores += matchScores.reduce(function(prevVal, match) { return prevVal + (field in match ? match[field] : 0.0); }, 0.0);
            }
          });

          var total_score_avgs = []
          if ( num_scout_ratings_used > 0 ) {
            var avgScore = scout_scores_avgs.reduce(function(prevVal, avg) { return prevVal + avg; }, 0.0);
            if ( attr.min || attr.max ) avgScore = avgScore / scout_scores_avgs.length;
            total_score_avgs.push(avgScore)
          }
          if (num_match_categories_used > 0) {
            total_score_avgs.push( tot_match_scores / matchesPlayed );
          }

          var final_avg = total_score_avgs.reduce(function(prevVal, avg) { return prevVal + avg; }, 0.0) / total_score_avgs.length;
          summary[k][attr.id] = +final_avg.toFixed(attr.decimal_places || 2);

          return;
        }

        if (attr.calc_type && attr.calc_type === 'accuracy') {
          var tot_made = 0.0
          var tot_missed = 0.0

          attr.made_ids.forEach(function(field) {
            if (field.startsWith('rating_')) {
              tot_made += field in team_scouting_scores ? team_scouting_scores[field].score : 0.0;
            }
            else {
              tot_made += matchScores.reduce(function(prevVal, match) { return prevVal + (field in match ? match[field] : 0.0); }, 0.0);
            }
          });

          attr.missed_ids.forEach(function(field) {
            if (field.startsWith('rating_')) {
              tot_missed += field in team_scouting_scores ? team_scouting_scores[field].score : 0.0;
            }
            else {
              tot_missed += matchScores.reduce(function(prevVal, match) { return prevVal + (field in match ? match[field] : 0.0); }, 0.0);
            }
          });

          var final_acc = (tot_made / (tot_made + tot_missed)) * 100.0 || 0.0;
          summary[k][attr.id] = { accuracy: +final_acc.toFixed(attr.decimal_places || 2), made_count: tot_made, missed_count: tot_missed };

          return;
        }
      });
    });

    var blueTeamAvgs = {};
    var redTeamAvgs = {};
    for (var k in summary) {
      $.each(summary[k], function(attr,val) {
        if (k.startsWith('blue')) blueTeamAvgs[attr] = (blueTeamAvgs[attr] || 0) + (val/3);
        if (k.startsWith('red')) redTeamAvgs[attr] = (redTeamAvgs[attr] || 0) + (val/3);
      });
    };
    
    //console.log(summary);
    next(summary, blueTeamAvgs, redTeamAvgs);
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
        var updatedAt = firebase.database.ServerValue.TIMESTAMP; // moment().format('YYYY-MM-DD, h:mm:ss a'); //'2016-01-12 2:50pm';

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
          
         
         var tba_subs = tba_api_scoring_config.filter(function(d) {
             return('sub' in d);
         });
        
         tba_subs.forEach(function(obj) {
            match.score_breakdown.blue[match.score_breakdown.blue[obj.id]] = parseInt(match.score_breakdown.blue[obj.sub]) || 0;
            match.score_breakdown.red[match.score_breakdown.red[obj.id]] = parseInt(match.score_breakdown.red[obj.sub]) || 0;
         });
         
         
         var tba_aggs = tba_api_scoring_config.filter(function(d) {
             return('agg' in d);
         });
         
         tba_aggs.forEach(function(obj){
                match.score_breakdown.blue[obj.id] = obj.agg.reduce(function (preVal, el) {
                  if (obj.dtype == 'bool') {
                    return preVal + (match.score_breakdown.blue[el] === true ? 1 : 0);
                  }
                  else {
                    return preVal + parseInt(match.score_breakdown.blue[el] || (obj.default_value || 0));
                  }
                }, 0);
                
                match.score_breakdown.red[obj.id] = obj.agg.reduce(function (preVal, el) {
                  if (obj.dtype == 'bool') {
                    return preVal + (match.score_breakdown.red[el] === true ? 1 : 0);
                  }
                  else {
                    return preVal + parseInt(match.score_breakdown.red[el] || (obj.default_value || 0));
                  }
                }, 0);
         }); 
          
          
          $.each (match.alliances.blue.teams, function(i, team) {
            delete match.score_breakdown.blue['']
            $.each(match.score_breakdown.blue, function(k,v) {
              if (typeof(v) === 'boolean') match.score_breakdown.blue[k] = +v
            });
            teamScores.push({ matchKey: match.key, match_time: match.time, teamKey: team, scores: match.score_breakdown.blue });
          });

          $.each (match.alliances.red.teams, function(i, team) {
            delete match.score_breakdown.red['']
            $.each(match.score_breakdown.red, function(k,v) {
              if (typeof(v) === 'boolean') match.score_breakdown.red[k] = +v
            });
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
              dprs: (statsData && statsData.dprs) ? statsData.dprs[score.teamKey.replace('frc','')] || 0: 0//,
              

            };
          }
        });

        $.each (rankingData, function(index, arr) { 
          if (index === 0 || arr.length < 1) return;

          var tk = 'frc' + arr[1];
          if (!tk in teamEventDetails) return;

          tba_api_ranking_config.forEach(function (el) {
            teamEventDetails[tk][el.id] = arr[el.arr_index];
          });
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
    data.scored_at = firebase.database.ServerValue.TIMESTAMP; // new Date().getTime() -> e.g., 1456101425447 -or- (new Date()).toString();
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
