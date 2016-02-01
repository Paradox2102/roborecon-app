
ParadoxScout = {};

ParadoxScout.start = function(next) {
  // the 4 digit year functions as they competition key!
  ParadoxScout.CompetitionYear = new Date().getFullYear();

  // init firebase db
  ParadoxScout.dbRootUrl = 'https://brilliant-torch-6506.firebaseio.com/'
  ParadoxScout.dbRef = new Firebase(ParadoxScout.dbRootUrl);
  ParadoxScout.dbUsersRef = ParadoxScout.dbRef.child('users');

  // bluealliance api
  ParadoxScout.rootApiUrl = 'https://www.thebluealliance.com';
  ParadoxScout.eventsUrl = ParadoxScout.rootApiUrl + '/api/v2/events/' + ParadoxScout.CompetitionYear;
  ParadoxScout.eventUrl = ParadoxScout.rootApiUrl + '/api/v2/event/{event_key}';
  ParadoxScout.teamsUrl = ParadoxScout.rootApiUrl + '/api/v2/event/{event_key}/teams';

  loadCurrentUser(personalize);

  // init firebase authenticatin events; useful in SPAs
  ParadoxScout.dbRef.onAuth(function(authData) {});
  ParadoxScout.dbRef.offAuth(function(authData) {});
};

/*** registraion, login/logout, personalization ***/

// oauth login
ParadoxScout.loginWithOAuth = function(provider, next) {
  ParadoxScout.dbRef.authWithOAuthPopup(provider, function(error, authData) {
    if (error) {
      if (error.code === 'TRANSPORT_UNAVAILABLE') {
        // fallback to browser redirects, and pick up the session
        // automatically when we come back to the origin page
        ParadoxScout.dbRef.authWithOAuthRedirect(provider, function(error) {
          next(error);
        });
      }
    }
    else if (authData) {
      // upsert user
      var user_key = authData[provider].email.replace('.', '%2E');

      ParadoxScout.dbUsersRef.child(user_key).once('value', function(u) {
        var user_auth = {};
        user_auth[authData.provider] = authData.uid;

        if (!u.exists()) {
          var newUser = { name: authData.github.displayName, email: authData.github.email, user_authentications: user_auth };
          ParadoxScout.dbUsersRef.child(user_key).set(newUser)
            .then(function() {
              ParadoxScout.dbRef.child('user_authentications/' + authData.uid).set({ user_id: user_key })
            })
            .catch(function(error) {
              next(error)
            })
            .then(next);
        }
        else {
          ParadoxScout.dbUsersRef.child(user_key + '/user_authentications').set(user_auth, next)
            .then(function() {
              ParadoxScout.dbRef.child('user_authentications/' + authData.uid).set({ user_id: user_key })
            })
            .catch(function(error) {
              next(error)
            })
            .then(next);
        }
      }, function(error) {
        next(error);
      });
    }
  });
};

ParadoxScout.buildEventsDropdown = function(el) {
  // fetch the 2016 FRC events on load
  $.ajax({
    beforeSend: function(request) {
      request.setRequestHeader('X-TBA-App-Id', 'frc2102:scouting-system:v01');
    },
    url: ParadoxScout.eventsUrl
  }).done(function(data) {
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
  var getEvent = $.ajax({
                    beforeSend: function(request) {
                      request.setRequestHeader('X-TBA-App-Id', 'frc2102:scouting-system:v01');
                    },
                    url: ParadoxScout.eventUrl.replace('{event_key}', eventKey)
                  }),
      getTeams = $.ajax({
                    beforeSend: function(request) {
                      request.setRequestHeader('X-TBA-App-Id', 'frc2102:scouting-system:v01');
                    },
                    url: ParadoxScout.teamsUrl.replace('{event_key}', eventKey)
                  });

  $.when(getEvent, getTeams).done(function(eventData, teamsData) {
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

    ParadoxScout.dbRef.child('/events/' + eventKey).set(event)
      .then(function() {
        ParadoxScout.dbRef.child('/teams').update(teams)
      })
      .then(function() {
        ParadoxScout.dbRef.child('/event_teams/' + eventKey).set(eventTeams)
      })
      .catch(function(error) {
        next(error)
      })
      .then(next);
  });
};

// utility methods
var loadCurrentUser = function(next) {
    // always do a server-side verification as a successful oauth login does not necessarily mean
    // the user is verified in the application
    var authData = ParadoxScout.dbRef.getAuth();

    if (authData) {
      var user_key = authData[authData.provider].email.replace('.', '%2E');
      ParadoxScout.dbRef.child('users').child(user_key).once('value', function(user) {
          next(user.val());
      });
    }
    else {
      next(null);
    }
};

var personalize = function(user) {
  var ViewModel = {
    isLoggedIn: user ? true : false,
    name: ko.computed(function() {
      return user ? user.name : '';
    }),
    login_or_out : function() {
      if (user) {
        ParadoxScout.dbRef.unauth();
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
