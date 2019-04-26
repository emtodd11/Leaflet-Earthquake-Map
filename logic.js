function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map
    var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
      attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    });
  
    // Create a baseMaps object to hold the lightmap layer
    var baseMaps = {
      "Light Map": lightmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options
    var map = L.map("map", {
      center: [37.09, -95.71],
      zoom: 5,
      layers: [lightmap, earthquakes]
    });
  
    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);
  }
  
  function createMarkers(response) {
  
    // Pull the earthquakes off of response data
    var quakes = response.features;
  
    // Initialize an array to hold earthquake markers
    var quakeMarkers = [];
  
    // Loop through the quakes array
    for (var index = 0; index < quakes.length; index++) {
      var quake = quakes[index];

      // assign colors correlated to magnitude
      var color = "";
      if (quake.properties.mag > 5) {
        color = "#FF0000";
      }
      else if (quake.properties.mag > 4) {
        color = "#FF3300";
      }
      else if (quake.properties.mag > 3) {
        color = "#FFCC00";
      }
      else if (quake.properties.mag > 2) {
        color = "#FFFF00";
      }
      else if (quake.properties.mag > 1) {
        color = "#66ff00";
      }
      else {
        color = "#00FF00";
      }  
  
      // For each earthquake, add a circle with dynamic color and radius
      var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]], {
        fillOpacity: 0.75,
        color: "white",
        fillColor: color,
        radius: (quake.properties.mag * 50000)})
        .bindPopup("<h3>" + quake.properties.place + "<h3><h4>Magnitude: " + quake.properties.mag + "<h4>");
  
      // Add the marker to the earthquake markers array
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group made from the earthquake markers array, pass it into the createMap function
    createMap(L.layerGroup(quakeMarkers));
  }
    
  // Perform an API call to get earthquake information. Call createMarkers when complete
  d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
  