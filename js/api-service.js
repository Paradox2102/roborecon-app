
var ParadoxScout = ParadoxScout || {};

ParadoxScout.ApiService = function() {
  // private attributes
  rootApiUrl = 'https://www.thebluealliance.com',
  eventsUrl = rootApiUrl + '/api/v2/events/{year}',
  eventUrl = rootApiUrl + '/api/v2/event/{event_key}',
  teamsUrl = rootApiUrl + '/api/v2/event/{event_key}/teams',
  matchesUrl = rootApiUrl + '/api/v2/event/{event_key}/matches',
  statsUrl = rootApiUrl + '/api/v2/event/{event_key}/stats',
  rankingsUrl = rootApiUrl + '/api/v2/event/{event_key}/rankings',

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
  },

  getAllMatchDetails = function(eventKey) {
    return $.when(
      getDataFromBlueAlliance(matchesUrl.replace('{event_key}', eventKey)), 
      getDataFromBlueAlliance(statsUrl.replace('{event_key}', eventKey)),
      getDataFromBlueAlliance(rankingsUrl.replace('{event_key}', eventKey))
    );
  };

  // public api
  return {
    getEvents: getEvents,
    getEvent: getEvent,
    getTeamsForEvent: getTeamsForEvent,
    getEventAndTeams: getEventAndTeams,
    getAllMatchDetails: getAllMatchDetails
  };

}();
