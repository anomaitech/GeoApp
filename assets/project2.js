/****************************************************/
/* 2) LEAFLET MAP SETUP (Project 2)                 */
/****************************************************/
// center at Mekelle home coords
let map2 = L.map('map2').setView([13.479694, 39.467275], 13);

// base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map2);

// user-specified markers
let homeMarker = L.marker([13.484056, 39.470219]).addTo(map2);
homeMarker.bindPopup("<b>My House</b><br/>Home sweet home! (13.484056, 39.470219)");

let schoolMarker = L.marker([13.489424, 39.474480]).addTo(map2);
schoolMarker.bindPopup("<b>My School</b><br/>Where I studied Elementary and high-school.(13.489424, 39.474480)");

let churchMarker = L.marker([13.508397, 39.471145]).addTo(map2);
churchMarker.bindPopup("<b>My Church</b><br/>Place of worship. its called መሰረተ ክርስቶስ(Meserete Cristos),Evangelical (13.508397, 39.471145)");

// polygon around home property
let homePolygon = L.polygon([
  [13.483949, 39.470158],
  [13.483971, 39.470125],
  [13.484078, 39.470183],
  [13.484056, 39.470219]
], {
  color: 'green',
  fillColor: 'lightgreen',
  fillOpacity: 0.4
}).addTo(map2);
homePolygon.bindPopup("Home Boundary");

// circle for 10-min walk (~800m)
let walkCircle = L.circle([13.484056, 39.470219], {
  radius: 800,
  color: 'orange',
  fillColor: 'orange',
  fillOpacity: 0.2
}).addTo(map2);
walkCircle.bindPopup("10-min walk radius");

// distance line
const distanceSpan = document.getElementById('distanceResult');
let pathLayer = null;

function drawLocationsAndLine() {
  if(pathLayer) {
    map2.removeLayer(pathLayer);
    pathLayer = null;
  }
  const loc1 = document.getElementById('location1').value.trim();
  const loc2 = document.getElementById('location2').value.trim();
  if(!loc1 || !loc2) {
    alert("Please enter both lat,lng positions.");
    return;
  }
  let [lat1, lng1] = loc1.split(',').map(Number);
  let [lat2, lng2] = loc2.split(',').map(Number);
  if(isNaN(lat1) || isNaN(lng1) || isNaN(lat2) || isNaN(lng2)) {
    alert("Invalid coordinates. Must be decimals (e.g. 13.479694, 39.467275).");
    return;
  }

  // markers
  let marker1 = L.marker([lat1, lng1]).addTo(map2);
  marker1.bindPopup("<b>Location 1</b>");

  let marker2 = L.marker([lat2, lng2]).addTo(map2);
  marker2.bindPopup("<b>Location 2</b>");

  // line
  pathLayer = L.polyline(
    [[lat1, lng1], [lat2, lng2]],
    {
      color: 'blue',
      weight: 3
    }
  ).addTo(map2);

  // distance
  const latLng1 = L.latLng(lat1, lng1);
  const latLng2 = L.latLng(lat2, lng2);
  const distMeters = latLng1.distanceTo(latLng2);
  const distKm = distMeters / 1000;
  distanceSpan.textContent = distKm.toFixed(2) + ' km';

  // fit bounds to line
  map2.fitBounds(L.latLngBounds([latLng1, latLng2]), { padding: [50, 50] });
}
// optional test cases
const testCases = [
  {
    name: "Home -> School",
    loc1: "13.479694, 39.467275",
    loc2: "13.489424, 39.474480",
    expected: "Distance ~1.3 km"
  },
  {
    name: "School -> Church",
    loc1: "13.489424, 39.474480",
    loc2: "13.508397, 39.471145",
    expected: "Distance ~2.1 km"
  }
];

function runTestCases() {
  testCases.forEach(tc => {
    console.log(`Running Test: ${tc.name}`);
    document.getElementById('location1').value = tc.loc1;
    document.getElementById('location2').value = tc.loc2;
    drawLocationsAndLine();
  });
}