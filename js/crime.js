  var geocoder;
  var map;
  var path = ""
  var incidentArr = []
  function initialize() {
    geocoder = new google.maps.Geocoder();
    var collegePark = new google.maps.LatLng(38.9967,-76.9275);
    var mapOptions = {
      zoom: 13,
      center: collegePark
    }

    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    var ctaLayer = new google.maps.KmlLayer({
      url: 'http://terpconnect.umd.edu/~kemaric/GEOG475/KemariLeggLab5.kmz'
    });
  //ctaLayer.setMap(map);
  }

function codeAddress(address) {
    //var address = document.getElementById("address").value;
    geocoder.geocode( { 'address': address}, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
    //document.getElementById("output_Lat").value = results[0].geometry.location.lat();
    //document.getElementById("output_Lng").value = results[0].geometry.location.lng();
        var marker = new google.maps.Marker({
            map: map, 
      draggable:false,
      animation: google.maps.Animation.DROP,
            position: results[0].geometry.location
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  }



function clearAddressBox() {
  document.getElementById("address").value = "";
}


function mapAllLocations(){
  angular.forEach(incidentArr, function(item, index){
    alert(item.caseNumber);
  });
}

var crimeDat = angular.module('UMDCrimeApp', ['jsonService']);

google.maps.event.addDomListener(window, 'load', initialize);

crimeDat.controller('MainCtrl', function($scope, JsonService){
  JsonService.get(function(data){
    $scope.crimes = data.results.collection1
    angular.copy($scope.crimes, incidentArr);
  });
});


