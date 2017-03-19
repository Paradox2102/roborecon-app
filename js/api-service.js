'use strict';
// will create app namespace *unless* it already exists because another .js
// file using the same namespace was loaded first
var ParadoxScout = ParadoxScout || {};

// made into IIFE since only need one module
ParadoxScout.ApiService = (function() {

  // private attributes
  var rootApiUrl = 'https://www.thebluealliance.com',
  appTeamKey = "{{site.scout.teamkey}}",
  eventsUrl = rootApiUrl + '/api/v2/events/{year}',
  eventUrl = rootApiUrl + '/api/v2/event/{event_key}',
  teamsUrl = rootApiUrl + '/api/v2/event/{event_key}/teams',
  matchesUrl = rootApiUrl + '/api/v2/event/{event_key}/matches',
  statsUrl = rootApiUrl + '/api/v2/event/{event_key}/stats',
  rankingsUrl = rootApiUrl + '/api/v2/event/{event_key}/rankings',

  teamEventsUrl = rootApiUrl + '/api/v2/team/{team_key}/events',
  teamEventMatchesUrl = rootApiUrl + '/api/v2/team/{team_key}/event/{event_key}/matches',

  // private methods 
  getDataFromBlueAlliance = function(apiUrl) {
    return $.ajax({
      beforeSend: function(request) {
        request.setRequestHeader('X-TBA-App-Id', `frc${appTeamKey}:scouting-system:v01`);
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
    return $.when(getEvent(eventKey), getTeamsForEvent(eventKey));
  },

  getAllMatchDetails = function(eventKey) {
    return $.when(
      getDataFromBlueAlliance(matchesUrl.replace('{event_key}', eventKey)), 
      getDataFromBlueAlliance(statsUrl.replace('{event_key}', eventKey)),
      getDataFromBlueAlliance(rankingsUrl.replace('{event_key}', eventKey))
    );
  },

  // championship only
  getEventsByTeam = function(teamKey) {
    return getDataFromBlueAlliance(teamEventsUrl.replace('{team_key}', teamKey));
  },

  getMatchResultsByTeam = function(eventKey, teamKey) {
    return getDataFromBlueAlliance(teamEventMatchesUrl.replace('{team_key}', teamKey).replace('{event_key}', eventKey));
  };

  // public api 
  return {
    getEvents: getEvents,
    getEvent: getEvent,
    getTeamsForEvent: getTeamsForEvent,
    getEventAndTeams: getEventAndTeams,
    getAllMatchDetails: getAllMatchDetails,
    getEventsByTeam: getEventsByTeam,
    getMatchResultsByTeam: getMatchResultsByTeam
  };

})();