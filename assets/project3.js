// Initialize the map
let map3 = L.map('map3').setView([13.479694, 39.467275], 19);

// Base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 12,
  attribution: '© OpenStreetMap'
}).addTo(map3);
const countryImages = {
  addis_ababa: [
    // 4 Ethiopia images (Unsplash examples)
    "assets/images/wedding.jpg",
    "assets/images/abeni.jpg",
    "assets/images/abeniye.jpg",
    "assets/images/family.jpg",
      ],
  jerusalem: [
    // 4 Israel images (Unsplash examples)
    "https://images.unsplash.com/photo-1590414286514-443b5bb1cbe0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1630247765474-2260db422061?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1630529928207-514e5bf98562?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1636589330925-d04150543142?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
  ],
  delft: [
    // 4 Netherlands images (Unsplash examples)
    "https://images.unsplash.com/photo-1600954389543-66c996a2abc9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1620643020143-aba8bf709732?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1584184056269-b35af839dba4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1616453715081-48db37cd2312?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
  ],
  tennessee: [
    // 4 Tennessee images (Unsplash examples)
    "https://images.unsplash.com/photo-1601889761626-a3d56b2c7d23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1531606482087-e1619236b136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1571569335139-cf3111752f1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
    "https://images.unsplash.com/photo-1588795947937-d465117cde01?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
  ]
};
const placeCoordinates = {

      addis_ababa: [8.9806, 38.7578],

      jerusalem: [31.778345, 35.220480],

      delft: [52.011576, 4.357067],

      tennessee: [35.5175, -86.5804]
    };
    function goToPlace(placeId) {
      const coords = placeCoordinates[placeId];
      if (coords) {
        // Choose your preferred zoom level or use map.flyTo
        map3.setView(coords, 19);
        // OR:
        // map.flyTo(coords, 12);
         updateCarousel(placeId);
      }
    }
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
                    map3.setView(layer.getLatLng(), 12); // Zoom closer for points
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
function updateCarousel(placeId) {
  // Grab the array of image URLs
  const images = countryImages[placeId];
  if (!images) {
    console.warn("No images found for place:", placeId);
    return;
  }
  // Slide 1
  const slide1Snapper = document.querySelector("#carousel__slide1 .carousel__snapper");
  const slide1NavHTML = slide1Snapper.querySelectorAll("a"); // next/prev anchors
  slide1Snapper.innerHTML = `<img src="${images[0]}" alt="Slide 1" />`;
  slide1NavHTML.forEach(anchor => slide1Snapper.appendChild(anchor));

  // Slide 2
  const slide2Snapper = document.querySelector("#carousel__slide2 .carousel__snapper");
  const slide2NavHTML = slide2Snapper.querySelectorAll("a");
  slide2Snapper.innerHTML = `<img src="${images[1]}" alt="Slide 2" />`;
  slide2NavHTML.forEach(anchor => slide2Snapper.appendChild(anchor));

  // Slide 3
  const slide3Snapper = document.querySelector("#carousel__slide3 .carousel__snapper");
  const slide3NavHTML = slide3Snapper.querySelectorAll("a");
  slide3Snapper.innerHTML = `<img src="${images[2]}" alt="Slide 3" />`;
  slide3NavHTML.forEach(anchor => slide3Snapper.appendChild(anchor));

  // Slide 4
  const slide4Snapper = document.querySelector("#carousel__slide4 .carousel__snapper");
  const slide4NavHTML = slide4Snapper.querySelectorAll("a");
  slide4Snapper.innerHTML = `<img src="${images[3]}" alt="Slide 4" />`;
  slide4NavHTML.forEach(anchor => slide4Snapper.appendChild(anchor));

  console.log(`Carousel updated for place: ${placeId}`);
}
// Attach event listener to the tab click event
document.querySelector(".tab:nth-child(3)").addEventListener("click", refreshMap3);
