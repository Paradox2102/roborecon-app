---
---
var ParadoxScout = ParadoxScout || {};

ParadoxScout.start = function(next) {
  // the 4 digit year functions as they competition key!
  ParadoxScout.CompetitionYear = new Date().getFullYear();
  ParadoxScout.DataService.getCurrentUser(personalize);
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
    ParadoxScout.DataService.upsertEventAndTeams(eventKey, event, teams, eventTeams, next);
  });
};


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
        location.href = '{{ site.url }}';
      }
      else {
        location.href = '{{ site.url }}/login';
      }
    },
    login_or_out_button : ko.computed(function(){
      return user ? 'Logout' : 'Login';
    })
  }

  ko.applyBindings(ViewModel);
};
