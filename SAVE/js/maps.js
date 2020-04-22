function initMap(){
  //===============================VARIABLES==============================//
  var options = { //styling options
    zoom:12,
    center:{lat: 43.4723, lng:80.5449},
    styles: [
          {
            elementType: 'geometry',
            stylers: [{color: '#242f3e'}]
          },
          {
            elementType: 'labels.text.stroke',
            stylers: [{color: '#242f3e'}]
          },
          {
            elementType: 'labels.text.fill',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#00f9ff'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ]
  },
      markers = [],
      map = new google.maps.Map(document.getElementById('map'), options),
      geocoder = new google.maps.Geocoder,
      infoWindow = new google.maps.InfoWindow;
  //=============================LOGIC FUNCTIONS==========================//
  //Locates user on map on page load
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) { //Geolocation has worked
      var pos = { //gets current position
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      updateCurrentLocationMarkerOnMap(pos, map);
      infoWindow.open(map);
      map.setCenter(pos);
    }, function() { //Geolocation has failed
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else { //Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  //locates user on map when address is inputted in search box
  document.getElementById('address').addEventListener('change', function() { // Converts address to location on map
    codeAddress(geocoder, map);
  });

  //locates user when map is clicked
  map.addListener('click', function(event) {
    updateCurrentLocationMarkerOnMap(event.latLng, map);
    infoWindow.open(map);
    map.setCenter(event.latLng);
  });










  //============================HELPER FUNCTIONS==========================//
  //marker functions
  function addMarker(coords, currMap){ //adds marker at location
    let marker = new google.maps.Marker({
      position:coords,
      map:currMap
    });
    markers.push(marker);
  }
  function setMapOnAll(map){ // Sets the map on all markers in the array.
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  }
  function showMarkers(currMap){ // Shows markers currently in markers array.
    setMapOnAll(currMap);
  }
  function deleteMarkers(){ // Deletes all markers in markers array.
    setMapOnAll(null);
    markers = [];
  }
  function updateCurrentLocationMarkerOnMap(coords, currMap){ //updates the current location marker on the map
    deleteMarkers();
    addMarker(coords, currMap);
    showMarkers(currMap);
  }
  //address locator
  function codeAddress(geocoder, resultsMap) { //locates address on map (Geocode)
    let address = document.getElementById('address').value;
    geocoder.geocode( {'address': address}, function(results, status) {
      if (status == 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
        address = results[0].geometry.location;
        updateCurrentLocationMarkerOnMap(results[0].geometry.location, resultsMap);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
  //errors
  function handleLocationError(browserHasGeolocation, infoWindow, pos) { //Handles errors for Geolocations
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ? 'Error: The Geolocation service failed.' : 'Error: Your browser doesn\'t support geolocation.');
    infoWindow.open(map);
  }
}
