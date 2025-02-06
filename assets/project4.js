let map4 = L.map('map4').setView([40.65439144, -111.9671599], 4);

// Base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 12,
  attribution: '© OpenStreetMap'
}).addTo(map4);
L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-0b3452c0c2d34f099e6da847a6ce828d/wms', {
            layers: 'HS-0b3452c0c2d34f099e6da847a6ce828d:counties',
            format: 'image/png',
            transparent: true,
            attribution: 'Hydroshare GeoServer'
        }).addTo(map4);

const placestateCoordinates = {
  UT: [40.69494674, -111.9107696],
  WY: [42.0338271, -110.9329636],
  NV: [38.5037222, -114.2065],
  ID: [42.1988111, -112.0082944],
};

let currentKMLLayer = null;

function goToState(placeId) {
  const coords = placestateCoordinates[placeId];
  console.log(placeId);
  if (coords) {
    map4.setView(coords, 19);

    // Remove the previous KML layer if it exists
    if (currentKMLLayer) {
      map4.removeLayer(currentKMLLayer);
    }

    // Load and add the new KML layer
    currentKMLLayer = omnivore.kml('assets/' + placeId + '.kml')
      .on('ready', function() {
        map4.fitBounds(this.getBounds());
      })
      .on('layeradd', function(e) {
        let layer = e.layer;
        if (layer.feature && layer.feature.properties && layer.feature.properties.name) {
          let nameTag = layer.feature.properties.name; // Get the name tag

          layer.bindPopup(`<h3>${nameTag}</h3><p>${layer.feature.properties.description || 'No description available'}</p>`);

          layer.on('click', function() {
            if (layer.getBounds) {
              map4.fitBounds(layer.getBounds());
            } else if (layer.getLatLng) {
              map4.setView(layer.getLatLng(), 12);
            }

            // Generate Plotly plot when a coordinate is clicked
            generatePlot(nameTag);
          });
        }
      })
      .addTo(map4);

//    L.tileLayer.wms('https://geoserver.hydroshare.org/geoserver/HS-5f7a9ac9aa3e486aba143b30862050d0/wms', {
//      layers: 'HS-5f7a9ac9aa3e486aba143b30862050d0:' + placeId,
//      format: 'image/png',
//      transparent: true,
//      attribution: 'Hydroshare GeoServer'
//    }).addTo(map4);
  }
}

function generatePlot(nameTag) {
    // Load CSV data
    fetch('assets/state_well_data.csv')
        .then(response => response.text()) // Read CSV as text
        .then(csvText => {
            let rows = csvText.split("\n").map(row => row.split(",")); // Parse CSV into an array
            let headers = rows[0].map(h => h.trim()); // Extract headers
            let data = rows.slice(1); // Extract data rows

            // Find index of relevant columns
            let wellIndex = headers.indexOf("Well_ID");
            let wteIndex = headers.indexOf("WTE");
            let dateIndex = headers.indexOf("Date");

            if (wellIndex === -1 || wteIndex === -1 || dateIndex === -1) {
                console.error("CSV headers are incorrect!");
                return;
            }

            // Filter data based on selected Well_ID (nameTag)
            let filteredData = data.filter(row => row[wellIndex] === nameTag);

            // Extract Date and WTE values
            let xValues = filteredData.map(row => row[dateIndex]);
            let yValues = filteredData.map(row => parseFloat(row[wteIndex])); // Convert WTE to numbers

            if (xValues.length === 0 || yValues.length === 0) {
                console.error(`No data found for Well_ID: ${nameTag}`);
                return;
            }

            // Create Plotly line chart
            let trace = {
                x: xValues,
                y: yValues,
                type: 'scatter',
                mode: 'lines+markers',
                name: nameTag,
                line: { color: 'blue', width: 2 }
            };

            let layout = {
                title: `WTE vs. Date for Well_ID: ${nameTag}`,
                xaxis: { title: "Date" },
                yaxis: { title: "WTE (Water Table Elevation)" },
                margin: { t: 40, l: 50, r: 20, b: 40 },
                autosize: true
            };

            Plotly.newPlot('plotContainer', [trace], layout);
        })
        .catch(error => console.error("Error loading CSV:", error));
}
