
var AppUtility = AppUtility || {};

AppUtility = function() {
  // private attributes
  cacheForMinutes = 5;

  // private methods
  getCacheData = function(cacheKey, minutes) {
    var cachedData = localStorage.getItem(cacheKey);
    // cache is good for 5 mins
    if(cachedData) {
      var obj = JSON.parse(cachedData);
      var mins = minutes === undefined ? cacheForMinutes : minutes;

      return ((new Date().getTime() - obj.created_at) / 60000) < mins ? obj.data : null;
    }
    return null;
  },

  setCacheData = function(cacheKey, data) {
    var obj = { created_at: new Date().getTime(), data: data };
    localStorage.setItem(cacheKey, JSON.stringify(obj));
  },

  invalidateCache = function() {
    // remove localStorage 
    $.each(localStorage, function(key, value) {
      if(key.startsWith('paradox-scout')) localStorage.removeItem(key);
    });

    // remove cookies
    var cookies = document.cookie.split(";");
    for(var i=0; i < cookies.length; i++) {
        var equals = cookies[i].indexOf("=");
        var name = equals > -1 ? cookies[i].substr(0, equals) : cookies[i];
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  },


  showErrorMsg = function(title, text) {
    toastr["error"](text, title, { timeOut: '5000' });
  },

  showSuccessMsg = function(title, text, next) {
    toastr["success"](text, title, { onShown: next } );
  },


  getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
      sURLVariables = sPageURL.split('&'),
      sParameterName,
      i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  };

  // public api
  return {
    getCacheData: getCacheData,
    setCacheData: setCacheData,
    invalidateCache: invalidateCache,

    showErrorMsg: showErrorMsg,
    showSuccessMsg: showSuccessMsg,

    getUrlParameter: getUrlParameter
  };

}();
