// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see the error "The Geolocation service
// failed.", it means you probably did not give permission for the browser to
// locate you.

    // Declare custom location
    const neighborhoods = [
      { lat: 10.823656, lng: 106.624636 },
      { lat: 10.824306718801228, lng: 106.62456626257018 },
      { lat: 10.826588, lng: 106.634645 },
      //{ lat: 35.9625525, lng: -161.8223674}
    ];

    // Declare marker variable, map, infoWindow
    let currentLocationMarker = null;
    let markers = [];

    // Declare map, infoWindow
    let map, infoWindow;

    function initMap() {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 11.107342350411704, lng: 106.61360637455256 },
        zoom: 17,
        mapId: '29842dec5d9edae3',
        mapTypeControl: false,
        fullscreenControl: false,
      });

      infoWindow = new google.maps.InfoWindow();

      // Modify Pan to Current Location Button
      const locationButton = document.createElement("button");
      locationButton.textContent = "Pan to Current Location";
      locationButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);

      locationButton.addEventListener("click", () => {
        function autoUpdate() {
          // Get current location
          navigator.geolocation.getCurrentPosition(function(position) {
            const newPoint = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            if (currentLocationMarker) { // Marker already created - Move it
              currentLocationMarker.setPosition(newPoint);
              startBounceAnimation(currentLocationMarker, 2000); // Bounce for 2 seconds
            }
            else { // Marker does not exist - Create it
              currentLocationMarker = new google.maps.Marker({
                position: newPoint,
                map: map,
                title: "Current Location",
                icon: {
                  url: "../images/pointer.svg",
                  scaledSize: new google.maps.Size(40, 40),
                },
                animation: google.maps.Animation.DROP,
                clickable: true,
              });

              const infowindow = new google.maps.InfoWindow({
                content: "Current Location",
              });

              currentLocationMarker.addListener("click", () => {
                infowindow.open(map, currentLocationMarker);
              });

              // Start bounce animation after drop animation
              setTimeout(() => {
                startBounceAnimation(currentLocationMarker, 2000); // Bounce for 2 seconds
              }, 600); // Adjust delay as needed to match the duration of the drop animation
            }

            // Center the map on the new position
            map.setCenter(newPoint);
            map.setZoom(18);
          });
        }

        autoUpdate();
      });

      // Function to handle the bouncing animation with a timeout
      function startBounceAnimation(marker, duration) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(() => {
          marker.setAnimation(null);
        }, duration);
      }

      // Modify Drop Button
      const dropButton = document.createElement("button");
      dropButton.textContent = "Drop Markers";
      dropButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(dropButton);

      dropButton.addEventListener("click", drop);

      // Modify function drop
      function drop() {
        clearMarkers();

        for (let i = 0; i < neighborhoods.length; i++) {
          addMarkerWithTimeout(neighborhoods[i], i * 200);
        }

        // Set bound for the markers
        var bounds = new google.maps.LatLngBounds();
        
        for (let i = 0; i < neighborhoods.length; i++) {
          const latLng = new google.maps.LatLng(neighborhoods[i].lat, neighborhoods[i].lng);
          bounds.extend(latLng);
        }
        
        if (currentLocationMarker && currentLocationMarker.getPosition()) {
          bounds.extend(currentLocationMarker.getPosition());
        }
        
        map.fitBounds(bounds);
      }

      // Modify marker with timeout
      function addMarkerWithTimeout(position, timeout) {
        window.setTimeout(() => {
          const newMarker = new google.maps.Marker({
            position: position,
            map,
            animation: google.maps.Animation.DROP,
            icon: {
                url: "../images/pipe.svg",
                scaledSize: new google.maps.Size(40, 40),
            },
          });
          markers.push(newMarker);
        }, timeout);
      }

      // Clear markers
      function clearMarkers() {
        for (let i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

      // Modify Pan to Markers Button
      const markersButton = document.createElement("button");
      markersButton.textContent = "Pan to Markers";
      markersButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(markersButton);

      markersButton.addEventListener("click", () => {
        if (markers.length > 0) {
          var bounds = new google.maps.LatLngBounds();
          
          for (let i = 0; i < markers.length; i++) {
            bounds.extend(markers[i].getPosition());
          }
      
          map.fitBounds(bounds);
        }
        else {
          // Replace the title with a notification when there are no markers
          const titleElement = document.querySelector('h1');
          const originalTitle = titleElement.textContent; // Store the original title
          titleElement.textContent = "No markers available :<";
          titleElement.classList.add("notification"); // Add a CSS class
      
          // Remove the notification after 2 seconds
          setTimeout(() => {
            titleElement.textContent = originalTitle; // Restore the original title
            titleElement.classList.remove("notification"); // Remove the notification class
          }, 2000);
        }
      });

      // Modify Clear Button
      const clearButton = document.createElement("button");
      clearButton.textContent = "Clear Markers";
      clearButton.classList.add("custom-map-control-button");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(clearButton);

      clearButton.addEventListener("click", clearMarkers);

    }
 

    window.initMap = initMap;

// VGU Campus: 11.107342350411704, 106.61360637455256
// Dorm 1: 11.1075704, 106.6124865
// Multi Map ID: 29842dec5d9edae3
// Map ID 2: 3552df9fa702c8d8
// Mario Map ID: a8c782ff86a12dc8