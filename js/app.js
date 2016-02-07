
var ParadoxScout = ParadoxScout || {};

ParadoxScout.start = function(next) {
  // the 4 digit year functions as they competition key!
  ParadoxScout.CompetitionYear = new Date().getFullYear();
  ParadoxScout.DataService.getCurrentUser(personalize);

  <!-- setup sticky navbar -->
  var menu = $('#main-menu');
  var origOffsetY = menu.offset().top;

   function scroll() {
     if ($(window).scrollTop() >= origOffsetY) {
       $('#main-menu').addClass('navbar-fixed-top');
       $('#main-body').addClass('menu-padding');
     }
     else {
       $('#main-menu').removeClass('navbar-fixed-top');
       $('#main-body').removeClass('menu-padding');
     }
   }
   document.onscroll = scroll;
};

// registraion, login/logout, personalization methods
ParadoxScout.loginWithOAuth = function(provider, next) {
  ParadoxScout.DataService.loginWithOAuth(provider, next);
}

// event and team methods
ParadoxScout.buildEventsDropdown = function(el) {
  // fetch the 2016 FRC events on load
  ParadoxScout.ApiService.getEvents(ParadoxScout.CompetitionYear)
    .done(function(data) {
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

ParadoxScout.addEventAndTeams = function(eventKey, next) {
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

    // build teams json
    var teams = {};
    var eventTeams = {};
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

    console.log(event);
    console.log(teams);
    console.log(eventTeams);

    // update the db with event and team information
    ParadoxScout.DataService.updateEventAndTeams(eventKey, event, teams, eventTeams, next);
  });
};

// match & scoring methods
ParadoxScout.updateTeamScores = function(eventKey, next) {
  //test
  eventKey = '2015casd';

  ParadoxScout.ApiService.getAllMatchDetails(eventKey, next)
    .done(function(matchData) {
      var updatedAt = moment().format('YYYY-MM-DD, h:mm:ss a'); //'2016-01-12 2:50pm';

      // get all the match scores by team; 1 entery per team + match
      var teamScores = [];

      $.each(matchData, function(i, match) {
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
        matchScore.match_time = new Date(1000 * score.match_time).toString();

        if(score.teamKey in teamEventDetails) {
          teamEventDetails[score.teamKey].scores[score.matchKey] = matchScore;
        }
        else {
          var firsMatch = {};
          firsMatch[score.matchKey] = matchScore
          teamEventDetails[score.teamKey] = { competition_id: ParadoxScout.CompetitionYear, updated_at: updatedAt, scores: firsMatch };
        }
      });

      // update db
      ParadoxScout.DataService.updateTeamScores(eventKey, teamEventDetails, next);
    })
    .fail(function(error) {
      next(error)
    });
}

// utility methods
var personalize = function(user) {
  var ViewModel = {
    isLoggedIn: user ? true : false,
    name: ko.computed(function() {
      return user ? user.name : '';
    }),
    login_or_out : function() {
      if (user) {
        ParadoxScout.DataService.logout();
        location.href = '/';
      }
      else {
        location.href = '/login';
      }
    },
    login_or_out_button : ko.computed(function(){
      return user ? 'Logout' : 'Login';
    })
  }

  ko.applyBindings(ViewModel);
};
