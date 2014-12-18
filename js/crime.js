var geocoder;
var map;
var mc;
var path = "";
var umdIncidentFile = 'https://www.kimonolabs.com/api/5fusrny8?apikey=YanxNfnAcZA2dWTnbxmnkxR1B23SzhqR';
var incidentArr = [];
var crimeTypes = ['Assault', 'Robbery', 'Murder'];
var markerClusterer = null;
var OFFSET = 268435456;
var RADIUS = 85445659.4471;

var firebaseURL = 'https://umd-crimes.firebaseio.com/results/collection1/';

//$(document).ready(function(){
var ref;
  //codeAddress("7706 Edmonston Rd, Berwyn Heights MD");
//}
//var myCharityDataRef = new Firebase(firebaseURL);

/**********Functions used for the clustering feature of the map.********/



function getRandomMarkers(){
  var lat = 38.9900;
  var lng = -76.9400;
  var markers = [];
  for(var i = 0; i< 1000; i++){
    var type = crimeTypes[Math.floor((Math.random() * 3) + 1)];
    var tmpCoor = {'Lat':lat+(Math.random()/100), 'Lng':lng-(Math.random()/100)};
    var latLng =  new google.maps.LatLng(tmpCoor['Lat'], tmpCoor['Lng']);
    var mark = new google.maps.Marker({
      'position' :latLng, 
      'title': type,
      'opacity': 0.5

    });
    markers.push(mark);
  }
  return markers;
}



function initialize() {
  geocoder = new google.maps.Geocoder();
  var collegePark = new google.maps.LatLng(38.993723, -76.941181);
  var mapOptions = {
    zoom: 16,
    center: collegePark
  }

  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  var mcOptions = {gridSize:80, maxZoom:50};
  var markers = getRandomMarkers();
  markerClusterer = new MarkerClusterer(map,markers, mcOptions);
  /*var ctaLayer = new google.maps.KmlLayer({
    url: 'http://terpconnect.umd.edu/~kemaric/GEOG475/KemariLeggLab5.kmz'
  });*/
//ctaLayer.setMap(map);

 /* if(localStorage['crimeLocals'] == null || 
    localStorage['crimeLocals'] == 'null' || 
    localStorage['crimeLocals'] == '[]'){
    ref = new Firebase(firebaseURL);
    mapAllLocations(ref, true);
  }else{
    incidentArr = JSON.parse(localStorage['crimeLocals']);
    mapAllLocations(incidentArr,false)
  }*/
  console.log("Map zoom is: "+ map.getZoom());
}

function Crime(id,dateTime,location, type){
  this.id = id;
  this.dateTime = dateTime;
  this.location = location;
  this.type = type;
}

//This gets called once by only me to put the lat and lon of the incidents in firebase
/*function addCoordinates(myCrimeDataRef){
  var crimes = [];
   myCrimeDataRef.orderByChild("caseNumber").on("child_added", function(matchesnap){
         //if there is a result
         var fld = matchesnap.val();
         if(fld['caseNumber'] != ""){
            var tmpCrimeRef = new Firebase(firebaseURL+matchesnap.key());
            tmpCrimeRef.once('value', function(item){
              var fd = item.val();
              geocoder.geocode({'address':addr}, function(results, status){
                if (status == google.maps.GeocoderStatus.OK) {
                  
                 }
              });

            })


         }
         //matchedCategories.push(matchesnap.key());
    }
}*/

function addMarker(location, type){

  var marker = new google.maps.Marker({
          map: map, 
    draggable:false,
    title: type,
    animation: google.maps.Animation.DROP,
          position: location
      });

  //incidentArr.push(marker);
}

function drawMarker(local,type){
  map.setCenter(local);
  addMarker(local, type);
}

/*function getLatLng(addr){
  geocoder.geocode({'address':addr}, function(results, status){
     if (status == google.maps.GeocoderStatus.OK) {

     }
  });
}*/

function codeAddress(address, type) {
  //var address = document.getElementById("address").value;
  geocoder.geocode( { 'address': address}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      //Adding the lat, long and type to the crime incident list for chaching
      var lat = results[0].geometry.location.lat();
      var lng = results[0].geometry.location.lng();
      incidentArr.push({Lat:lat,Lng:lng,Type:type});
      drawMarker(results[0].geometry.location, type);
      //map.setCenter(results[0].geometry.location);
      //addMarker(results[0].geometry.location,type)
  //document.getElementById("output_Lat").value = results[0].geometry.location.lat();
  //document.getElementById("output_Lng").value = results[0].geometry.location.lng();
     /* var marker = new google.maps.Marker({
          map: map, 
    draggable:false,
    animation: google.maps.Animation.DROP,
          position: results[0].geometry.location
      });*/

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });

}


//Retrieving the values for the specified key from the to level
function retrieveValues(myCrimeDataRef, key){
  var keyValues = [];
   myCrimeDataRef.on("child_added", function(snapchild){
  if (keyValues.indexOf(snapchild.val()[key]) == -1) {
    keyValues.push(snapchild.val()[key]);
  }
});
  return keyValues;
}



function clearAddressBox() {
document.getElementById("address").value = "";
}

function mapAllLocations(crimesRef, startFresh){
  if(startFresh == true){
    var cp = ", College Park MD";
    crimesRef.orderByChild("caseNumber").on("child_added", function(snapchild){
    if(snapchild.val()['location'] != "" && snapchild.val()['caseNumber'] != ""){
        setTimeout(function(){
          codeAddress(snapchild.val()['location']+cp, snapchild.val()['type']);
          console.log(snapchild.val()['caseNumber']+": "+snapchild.val()['type']);
        }, 100); 
    }

    });

    localStorage['crimeLocals'] = JSON.stringify(incidentArr);
  }else{
    for(var crime in crimesRef){
      var latlng = new google.maps.LatLng(crime.Lat,crime.Lng);
      drawMarker(latlng,crime.Type);
    } 
  }
 
  //alert("Finished getting crimes!");
}


 function refreshMap() {
        if (markerClusterer) {
          markerClusterer.clearMarkers();
        }

        /*var markers = [];

        var markerImage = new google.maps.MarkerImage(imageUrl,
          new google.maps.Size(24, 32));

        for (var i = 0; i < 1000; ++i) {
          var latLng = new google.maps.LatLng(data.photos[i].latitude,
              data.photos[i].longitude)
          var marker = new google.maps.Marker({
           position: latLng,
           draggable: true,
           icon: markerImage
          });
          markers.push(marker);
        }*/

        var zoom = parseInt(document.getElementById('zoom').value, 10);
        var size = parseInt(document.getElementById('size').value, 10);
        var style = parseInt(document.getElementById('style').value, 10);
        zoom = zoom == -1 ? null : zoom;
        size = size == -1 ? null : size;
        style = style == -1 ? null: style;

        markerClusterer = new MarkerClusterer(map, markers, {
          maxZoom: zoom,
          gridSize: size,
          styles: styles[style]
        });
      }

   function clearClusters(e) {
    e.preventDefault();
    e.stopPropagation();
    markerClusterer.clearMarkers();
  }



google.maps.event.addDomListener(window, 'load', initialize);
//google.maps.event.addDomListener(window, 'load', codeAddress("7706 Edmonston Rd, Berwyn Heights MD"));

/*var crimeDat = angular.module('UMDCrimeApp', ["firebase"]);

crimeDat.controller('crimeCtrl', ['$scope', "firebase",
  function($scope, $firebase){
    var ref = new Firebase(firebaseURL);

    //GET CRIMES AS AN ARRAY
    $scope.crimes = $firebase(ref).$asArray();
    console.log($scope.crimes);
  }
  ]);*/


/*crimeDat.service('crimeService', function($http, $q)
{

  var deferred = $q.defer();
  $http.get(umdIncidentFile).then(function(data)
  {
    deferred.resolve(data);
  });

  this.getCrimes = function()
  {
    return deferred.promise;
  }
})
  .controller('crimeCtrl', function ($scope, crimeService)
  {
    var promise = crimeService.getCrimes();
    promise.then(function (data)
    {
      $scope.crimes = data.data;
      console.log($scope.crimes);
    });
  })*/
/*crimeDat.controller('MainCtrl', function($scope, JsonService){
JsonService.get(function(data){
  $scope.crimes = data.results.collection1
  angular.copy($scope.crimes, incidentArr);
});
});*/


