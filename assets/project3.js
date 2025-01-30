// Initialize the map
let map3 = L.map('map3').setView([13.479694, 39.467275], 19);

// Base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map3);

// Load KML file
omnivore.kml('assets/mekelle.kml')
    .on('ready', function() {
        map3.fitBounds(this.getBounds());
    })
    .on('layeradd', function(e) {
        let layer = e.layer;
        if (layer.feature && layer.feature.properties && layer.feature.properties.name) {
            layer.bindPopup(`<h3>${layer.feature.properties.name}</h3><p>${layer.feature.properties.description || 'No description available'}</p>`);

            layer.on('click', function() {
                if (layer.getBounds) {
                    map3.fitBounds(layer.getBounds()); // Zoom to polygons or lines
                } else if (layer.getLatLng) {
                    map3.setView(layer.getLatLng(), 16); // Zoom closer for points
                }
            });
        }
    })
    .addTo(map3);

// Function to refresh map size when the tab is clicked
function refreshMap3() {
    setTimeout(() => {
        map3.invalidateSize();
    }, 50);
}

// Attach event listener to the tab click event
document.querySelector(".tab:nth-child(3)").addEventListener("click", refreshMap3);
