
var ParadoxScout = ParadoxScout || {};

ParadoxScout.ApiService = function() {
  // private attributes
  rootApiUrl = 'https://www.thebluealliance.com',
  eventsUrl = rootApiUrl + '/api/v2/events/{year}',
  eventUrl = rootApiUrl + '/api/v2/event/{event_key}',
  teamsUrl = rootApiUrl + '/api/v2/event/{event_key}/teams',

  // private methods
  getDataFromBlueAlliance = function(apiUrl) {
    return $.ajax({
      beforeSend: function(request) {
        request.setRequestHeader('X-TBA-App-Id', 'frc2102:scouting-system:v01');
      },
      url: apiUrl
    });
  },

  getEvents = function(year) {
    return getDataFromBlueAlliance(eventsUrl.replace('{year}', year));
  },

  getEvent = function(eventKey) {
    return getDataFromBlueAlliance(eventUrl.replace('{event_key}', eventKey));
  },

  getTeamsForEvent = function(eventKey) {
    return getDataFromBlueAlliance(teamsUrl.replace('{event_key}', eventKey));
  },

  getEventAndTeams = function(eventKey) {
    return $.when(getEvent(eventKey), getTeamsForEvent(eventKey))
  };

  // public api
  return {
    getEvents: getEvents,
    getEvent: getEvent,
    getTeamsForEvent: getTeamsForEvent,
    getEventAndTeams: getEventAndTeams
  };

}();
