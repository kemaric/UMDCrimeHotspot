var umdIncidentFile = "https://github.com/kemaric/UMDCrimeHotspot/blob/master/UMDIncidents.json"

angular.module('jsonService', ['ngResource'])
.factory('JsonService', function($resource) {
  return $resource(umdIncidentFile,{ }, {
    getData: {method:'GET', isArray: false}
  });
});