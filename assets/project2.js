/************************************************************/
/*            Project 2: Leaflet Map (Mekelle)             */
/*       + Haversine + Great-Circle Spherical Interp       */
/************************************************************/

// 1) Center the map on Mekelle (Home)
let map2 = L.map('map2').setView([13.479694, 39.467275], 13);

// 2) Base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '© OpenStreetMap'
}).addTo(map2);

// 3) Static Markers (Home, School, Church)
let homeMarker = L.marker([13.479694, 39.467275]).addTo(map2);
homeMarker.bindPopup("<b>My House</b><br/>Coords: 13.479694, 39.467275<br/>Home sweet home!");

let schoolMarker = L.marker([13.489424, 39.474480]).addTo(map2);
schoolMarker.bindPopup("<b>My School</b><br/>Coords: 13.489424, 39.474480<br/>Where I studied.");

let churchMarker = L.marker([13.508397, 39.471145]).addTo(map2);
churchMarker.bindPopup("<b>My Church</b><br/>Coords: 13.508397, 39.471145<br/>Place of worship.");

// 4) Polygon for home boundary
let homePolygon = L.polygon([
  [13.4798, 39.4672],
  [13.4798, 39.4675],
  [13.4795, 39.4675],
  [13.4795, 39.4672]
], {
  color: 'green',
  fillColor: 'lightgreen',
  fillOpacity: 0.4
}).addTo(map2);
homePolygon.bindPopup("<b>Home Boundary</b>");

// 5) Circle for 10-min walk
let walkCircle = L.circle([13.479694, 39.467275], {
  radius: 800,
  color: 'orange',
  fillColor: 'orange',
  fillOpacity: 0.2
}).addTo(map2);
walkCircle.bindPopup("10-min walk radius");

// HELPER 1: Haversine distance in KM
function haversineDistance(lat1Deg, lon1Deg, lat2Deg, lon2Deg) {
  let R = 6371; // Earth's mean radius in km
  // convert to radians
  let φ1 = lat1Deg * Math.PI/180;
  let λ1 = lon1Deg * Math.PI/180;
  let φ2 = lat2Deg * Math.PI/180;
  let λ2 = lon2Deg * Math.PI/180;
  let dφ = φ2 - φ1;
  let dλ = λ2 - λ1;

  let a = Math.sin(dφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  let d = R * c; // in km
  return d;
}

// HELPER 2: Great-circle points for the polyline
//  nSteps is how many segments to use, default ~60
function computeGreatCirclePoints(lat1Deg, lon1Deg, lat2Deg, lon2Deg, nSteps=60) {
  let points = [];

  // Convert degrees to radians
  let φ1 = lat1Deg * Math.PI/180;
  let λ1 = lon1Deg * Math.PI/180;
  let φ2 = lat2Deg * Math.PI/180;
  let λ2 = lon2Deg * Math.PI/180;

  // Haversine to get central angle c
  let dφ = φ2 - φ1;
  let dλ = λ2 - λ1;
  let a = Math.sin(dφ/2)**2 + Math.cos(φ1)*Math.cos(φ2)*Math.sin(dλ/2)**2;
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  // If the two points are basically the same, just return one
  if (c < 1e-12) {
    return [[lat1Deg, lon1Deg]];
  }

  // for each fraction f from 0..1, find intermediate point
  for (let step = 0; step <= nSteps; step++) {
    let f = step / nSteps; // fraction along the route

    // from the spherical interpolation formula
    let A = Math.sin((1 - f) * c) / Math.sin(c);
    let B = Math.sin(f * c) / Math.sin(c);

    let x = A * Math.cos(φ1)*Math.cos(λ1) + B * Math.cos(φ2)*Math.cos(λ2);
    let y = A * Math.cos(φ1)*Math.sin(λ1) + B * Math.cos(φ2)*Math.sin(λ2);
    let z = A * Math.sin(φ1) +     B * Math.sin(φ2);

    let φi = Math.atan2(z, Math.sqrt(x*x + y*y));
    let λi = Math.atan2(y, x);

    // convert back to degrees
    let lat_i = φi * 180/Math.PI;
    let lon_i = λi * 180/Math.PI;
    points.push([lat_i, lon_i]);
  }
  return points;
}

// main function for user input
const distanceSpan = document.getElementById('distanceResult');
let pathLayer = null;

function drawLocationsAndLine() {
  if (pathLayer) {
    map2.removeLayer(pathLayer);
    pathLayer = null;
  }
  const loc1 = document.getElementById('location1').value.trim();
  const loc2 = document.getElementById('location2').value.trim();
  if (!loc1 || !loc2) {
    alert("Please enter both lat,lng positions.");
    return;
  }

  let [lat1, lon1] = loc1.split(',').map(Number);
  let [lat2, lon2] = loc2.split(',').map(Number);
  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    alert("Invalid coords. Must be decimal lat,lng. Example: 13.479694, 39.467275");
    return;
  }

  // 1) Haversine distance
  let distKm = haversineDistance(lat1, lon1, lat2, lon2);
  distanceSpan.textContent = distKm.toFixed(2) + ' km';

  // 2) Build great-circle arc
  let gcPoints = computeGreatCirclePoints(lat1, lon1, lat2, lon2, 60);

  // 3) Markers at start & end
  let marker1 = L.marker([lat1, lon1]).addTo(map2);
  marker1.bindPopup(`<b>Location 1</b><br/>Coords: ${lat1}, ${lon1}`);
  let marker2 = L.marker([lat2, lon2]).addTo(map2);
  marker2.bindPopup(`<b>Location 2</b><br/>Coords: ${lat2}, ${lon2}`);

  // 4) Draw the polyline
  pathLayer = L.polyline(gcPoints, {
    color: 'blue',
    weight: 3
  }).addTo(map2);

  // 5) Fit map bounds
  let bounds = L.latLngBounds(gcPoints);
  map2.fitBounds(bounds, { padding: [50, 50] });
}
// ========================== Optional Test Cases ==========================
const testCases = [
  {
    name: "Home -> School",
    loc1: "13.479694, 39.467275",
    loc2: "13.489424, 39.474480",
    expected: "~1.2 km"
  },
  {
    name: "School -> Church",
    loc1: "13.489424, 39.474480",
    loc2: "13.508397, 39.471145",
    expected: "~2.1 km"
  }
];

function runTestCases() {
  testCases.forEach(tc => {
    console.log("Running Test:", tc.name);
    document.getElementById('location1').value = tc.loc1;
    document.getElementById('location2').value = tc.loc2;
    drawLocationsAndLine();
  });
}
// runTestCases();