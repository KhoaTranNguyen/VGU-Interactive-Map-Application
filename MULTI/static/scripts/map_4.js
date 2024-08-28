//                                            MARKER DECLARATION                                                    \\
//                                            ==================                                                     \\
const neighborhoods = [
  ["Ceremony Hall",           { lat: 11.108017011450801, lng: 106.61339599282121 },       "../static/icon/yoshi_house.svg"],
  ["Lecture Hall",            { lat: 11.106990453911946, lng: 106.61485382563335 },       "../static/icon/yoshi_house.svg"],
  ["Library",                 { lat: 11.108307632978415, lng: 106.61422431190194 },       "../static/icon/yoshi_house.svg"],
  ["Dorm 1",                  { lat: 11.10760232545595, lng: 106.6125135141044 },         "../static/icon/yoshi_house.svg"],
  ["Dorm 2",                  { lat: 11.106411276661785, lng: 106.61293230544415 },       "../static/icon/yoshi_house.svg"],
  ["Canteen",                 { lat: 11.107023615304339, lng: 106.61332483891645 },       "../static/icon/yoshi_house.svg"],
  ["Sport Hall",              { lat: 11.105593234212053, lng: 106.61444002762384 },       "../static/icon/yoshi_house.svg"],
  ["Academic Block Cluster",  { lat: 11.10838198445949, lng: 106.61563553833982 },        "../static/icon/yoshi_house.svg"],
  ["Admin Building",          { lat: 11.109782854121686, lng: 106.61505993384421 },       "../static/icon/yoshi_house.svg"],
  ["Exhibition Hall",         { lat: 11.11061691181166, lng: 106.61737666202414 },        "../static/icon/yoshi_house.svg"],
  ["Guest Housing",           { lat: 11.109285441252798, lng: 106.61768175193517 },       "../static/icon/yoshi_house.svg"]
];

//                                            VARIABLE DECLARATION                                                  \\
//                                            ====================                                                   \\
let currentLocationMarker = null;
let markers               = [];
let timeoutIds            = [];
let map, infoWindow;



//                                               MAP CREATION                                                        \\
//                                            ==================                                                     \\
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    zoom:               17,         //Set zoom level to 17, to zoom in to 19 later.
    maxZoom:            20,
    gestureHandling:    "greedy",
    mapId:              '29842dec5d9edae3',
    mapTypeControl:     false,
    fullscreenControl:  false,
    streetViewControl:  false,
    restriction: {
      latLngBounds: {
        north:          11.116667,
        south:          10.433333,
        east:           107.133333,
        west:           105.933333,
      },
    }
  });

  infoWindow = new google.maps.InfoWindow();

  createMapButton("Pan to Current Location", panToCurrentLocation ,"../static/icon/pointer.svg"); //Button [1]
  createMapButton("Drop Markers",            drop                 , "../static/icon/yoshi_house.svg"); //Button [2]
  createMapButton("Pan to Markers",          panToMarkers         , "../static/icon/yoshi_house.svg"); //Button [3]
  createMapButton("Clear Markers",           clearMarkers         , "../static/icon/ghosthouse.svg"); //Button [4]
  createMapButton("Log out", logout, "../static/icon/star.svg", {
    className: "custom-logout-button"
  });                                                                                           //Button [5]

  autoUpdate();
}


//                                            LOCATION AUTOUPDATE                                                   \\
//                                            ==================                                                     \\
function autoUpdate() {
  navigator.geolocation.watchPosition(position => {
    const newPoint                  = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

    if (currentLocationMarker)      currentLocationMarker.setPosition(newPoint);
    
    else {
      currentLocationMarker         = createMarker("Current Location", newPoint, "../static/icon/pointer.svg");
      panToCurrentLocation();
    }
  },
  
  error => {
    handleLocationError(error);
  }
  );
}

//        MARKER CREATION                                                            ERROR HANDLING: LINE 194
//        ===============                                                            ========================
function createMarker(title, position, iconUrl) {
  const marker                      = new google.maps.Marker({
    position,
    map,
    title,
    icon: {
      url:                          iconUrl,
      scaledSize:                   new google.maps.Size(40, 40),
    },
    animation:                      google.maps.Animation.DROP,
    clickable:                      true,
  });

  const infowindow                  = new google.maps.InfoWindow({ content: title });
  marker.addListener("click", ()    => infowindow.open(map, marker));
  return marker;
}    


//                                                BUTTON LIST                                                       \\
//                                            ==================                                                     \\
function createMapButton(text, callback, imageUrl, options = {}) {
  const button = document.createElement("button");

  // Check if a specific className is provided in options, otherwise use default class
  button.className = options.className || 'custom-map-control-button';
  
  button.innerHTML = `
    <img src="${imageUrl}" alt="Button Image">
    <span>${text}</span>
  `;

  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(button);
  button.addEventListener("click", callback);
}


//      BUTTON [1]: PAN TO CURRENT LOCATION
//      ===================================
function panToCurrentLocation() {
  if (currentLocationMarker && currentLocationMarker.getPosition()) {
    map.panTo(currentLocationMarker.getPosition());
    map.setTilt(45);
    
    if      (map.getZoom() === 17 || map.getZoom() < 17)  map.setZoom(19); //Default zoom
    else if (map.getZoom() === 19)                        map.setZoom(20); //Maximum Zoom
    else if (map.getZoom() === 20)                        map.setZoom(17); //Minimum Zoom
    else                                                  map.setZoom(19); //Default Zoom

    setTimeout(() => startBounceAnimation(currentLocationMarker, 2000), 1000);
  }
}

function startBounceAnimation(marker, duration) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(() => marker.setAnimation(null), duration);
}

//      BUTTON [2]: DROP MARKERS
//      ========================
function drop() {
  clearMarkers();
  neighborhoods.forEach((location, index) => {
    const title                   = location[0];
    const latLng                  = location[1];
    const iconUrl                 = location[2];

    addMarkerWithTimeout(title, latLng, iconUrl, index * 200);
  });

  const bounds = new google.maps.LatLngBounds();
  neighborhoods.forEach(location => bounds.extend(new google.maps.LatLng(location[1].lat, location[1].lng)));
  map.fitBounds(bounds);
  map.setTilt(45); //Set the tilt & zoom again, for better viewing
  map.setZoom(17);
}

function addMarkerWithTimeout(title, position, iconUrl, timeout) {
  const timeoutId = setTimeout(() => {
    const newMarker = createMarker(title, position, iconUrl);
    markers.push(newMarker);
  }, timeout);
  timeoutIds.push(timeoutId);
}

//      BUTTON [3]: PAN TO MARKERS
//      ============================
function panToMarkers() {
  if (markers.length > 0) {
    const bounds                = new google.maps.LatLngBounds();
    markers.forEach(marker      => bounds.extend(marker.getPosition()));
    map.fitBounds(bounds);

    // Adjust the zoom level if needed after fitting the bounds
    const listener              = google.maps.event.addListener(map, "idle", () => {
      if (map.getZoom() > 17)     map.setZoom(17);
      google.maps.event.removeListener(listener);
    });
  }
  
  else {
    showNotification("No markers available :<", 2000); //The markers were cleared or not dropped
  }
  
  map.setTilt(45);
}

//      BUTTON [4]: CLEAR MARKER
//      ========================
function clearMarkers() {
  markers.forEach(marker => marker.setMap(null));
  markers = [];
  timeoutIds.forEach(timeoutId => clearTimeout(timeoutId)); //Clear even the dropping markers
  timeoutIds = [];
}

//      BUTTON [5]: LOG OUT
//      ===================
function logout() {
  // Add your logout logic here
  console.log("Logging out...");
  // You can also redirect the user to a login page or perform any other action
  window.location.href = "/home"; // Replace with your login page URL
}

//      CREATE IMAGE FOR BUTTON
//      =======================
function createImageButton(imageUrl) {
  const button = document.createElement("button");
  button.innerHTML = `<img src="${imageUrl}" alt="Button Image" style="width: 20px; height: 20px;">`;

  button.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(button);
}


///                                             ERROR HANDLING                                                       \\
//                                            ==================                                                     \\
function handleLocationError(error) {
  let message = "";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      message   = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      message   = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      message   = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      message   = "An unknown error occurred.";
      break;
  }

  showNotification(message, 5000);
}


//                                               NOTIFICATION                                                      \\
//                                               ============                                                       \\
function showNotification(message, duration) {
  const titleElement         = document.querySelector('h1'); //Replace the title
  const originalTitle        = titleElement.textContent;
  titleElement.textContent   = message;
  titleElement.classList.add("notification");

  setTimeout(() => {
    titleElement.textContent = originalTitle;
    titleElement.classList.remove("notification");
  }, duration);
}

//                                               RUNNING CODE                                                       \\
//                                            ==================                                                     \\
window.initMap = initMap;