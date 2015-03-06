var globalLat;
var globalLong;

function getLocationNow()
{
  navigator.geolocation.getCurrentPosition(getLocation, locationError);
}

function getLocation(position) {
     var latitude = position.coords.latitude;
     var longitude = position.coords.longitude;
    
    
    currentGeoLoc[0] = latitude;  //if I use push then it keeps adding to the array but using the first 2 slots as location
    currentGeoLoc[1] = latitude;  //this make it certain that the first 2 slots are the only 2 slots
    
    globalLat = latitude;
    globalLong = longitude;
}

function locationError(error) {     //checking for potential errors 
    var errorTypes = {
        0: "Unknown error",
        1: "Permission denied by user",
        2: "Position not available",
        3: "Request timed out"
    };
    var errorMessage = errorTypes[error.code];
    if (error.code == 0 || error.code == 2) {
        errorMessage += " " + error.message;
    }
    console.log(errorMessage);
    alert(errorMessage);
}

function checkForMap()
{
  if (!map) {
        showMap(globalLat, globalLong);        
    }
    addMarker(globalLat, globalLong);
}

function showMap(lat, long) {
    var googleLatLong = new google.maps.LatLng(lat, long);
    var mapOptions = {
        zoom: 12,
        center: googleLatLong,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var mapDiv = document.getElementById("map");
    map = new google.maps.Map(mapDiv, mapOptions);
    map.panTo(googleLatLong);
}

function addMarker(lat, long)
{
  var googleLatLong = new google.maps.LatLng(lat, long);
    var markerOptions = {
        position: googleLatLong,
        map: map,
        title: "Where I'm thinking today"
    }
    var marker = new google.maps.Marker(markerOptions);
}

