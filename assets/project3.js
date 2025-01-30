// Initialize the map
let map3 = L.map('map3').setView([13.479694, 39.467275], 13);

// Base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map3);

// Load KML using Leaflet Omnivore
omnivore.kml('assets/mekelle.kml')
    .on('ready', function() {
        map3.fitBounds(this.getBounds());
    })
    .addTo(map3);

// Function to refresh map size when tab is clicked
function refreshMap3() {
    setTimeout(() => {
        map3.invalidateSize();
    }, 50);
}

// Attach event listener to the tab click event
document.querySelector(".tab:nth-child(3)").addEventListener("click", refreshMap3);
