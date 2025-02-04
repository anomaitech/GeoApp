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
    "https://scontent-sea1-1.xx.fbcdn.net/v/t1.6435-9/37694191_1956018194449217_6312838151085752320_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=833d8c&_nc_ohc=7PLTYFWZISwQ7kNvgFnlAej&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=A-YlHad5xmv5oqNfwNXKYKR&oh=00_AYBbes6lMvZFsdJRZEOmPnlmtUAgcNlUGULXgUbEXA6CWw&oe=67C951AF",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t1.6435-9/199280570_4268057306578616_6910930401477012555_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=W1kv3cbqZ-UQ7kNvgEdS-1-&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=A05Ulp-2o0LiIW_wGsOVqWB&oh=00_AYDzfdOM1dXtEIzsZAHLwLyB7AP_PXO11w3wJ2dOh0SuDQ&oe=67C92957",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t1.6435-9/154112715_3952595401458143_3247323488628717676_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=K3Nse-mUbmkQ7kNvgH7-k80&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=Af2J62u0Yccsr85f-ArGtw-&oh=00_AYCgERtbDxi1BkevSnU8XOA4vIc0JCRf8L1Ho97nv2pyrA&oe=67C93332",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/323950420_645220220711820_3785401832934187258_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=gYG9abhW1WUQ7kNvgFVOcnG&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AEroF7TisH7BbUD80_kAwY2&oh=00_AYCUkspONnzV_Q3jZPA0acL9FFWI7_bdoEi-390w1XO7ng&oe=67A7B2EB",
      ],
  jerusalem: [
    // 4 Israel images (Unsplash examples)
          "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/297295517_5557269710990696_6678857978704252543_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rwJcBdnuAdQQ7kNvgEIVkvZ&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AT8kArL-_Wx6lWqSj5JKhD5&oh=00_AYBIwg6X2m857n8RFjWO7V24lfB6UkAX5i470parSKD3PQ&oe=67A7B86A",

   "https://media.licdn.com/dms/image/v2/C4D22AQHgwiZ-VemA6A/feedshare-shrink_1280/feedshare-shrink_1280/0/1659366665553?e=1741824000&v=beta&t=p8exm4XZTaJa3NV5rh0WeLl5sAZQINwsikENezznrFE",
     "https://media.licdn.com/dms/image/v2/C4D22AQGqymsj1Y74XA/feedshare-shrink_1280/feedshare-shrink_1280/0/1659366661072?e=1741824000&v=beta&t=07fHIWiRvDXy1WZD-vpsH5K22pMh4zUmkIa-xq8OfU4",
       "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/296923989_5557269800990687_3388526471136093314_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=JuegyO1tN8sQ7kNvgE4CeEW&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AaTB_uZ8rJcTfUqyl7l4NSY&oh=00_AYCuJhvs6goLAOohjWrWBQhaF6o_8PSoOoWlbKFytj-Uiw&oe=67A7BA92",

  ],
  delft: [
    // 4 Netherlands images (Unsplash examples)
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/415977644_7258630844187899_1127290543093876902_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=76ETv9hIbxYQ7kNvgF5iB3Q&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AfLaavFBxkVRVVlogzyrd4N&oh=00_AYD9aqkWVpifR2MpLeGtL3uPIjzL0bqQN_5Qij7ScAabvw&oe=67A77E76",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/415181798_7258630964187887_6210579373126240850_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=_i_TvfaQBsgQ7kNvgEd97dw&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AJVMY1ZyNKdbP8ioATXt0SZ&oh=00_AYCo8K1WhgS3cgw52B51NSclRYpJqiNJa--sd6JLzKlXkw&oe=67A7B1C7",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/415977644_7258630844187899_1127290543093876902_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=833d8c&_nc_ohc=76ETv9hIbxYQ7kNvgF5iB3Q&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AfLaavFBxkVRVVlogzyrd4N&oh=00_AYD9aqkWVpifR2MpLeGtL3uPIjzL0bqQN_5Qij7ScAabvw&oe=67A77E76",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/415181798_7258630964187887_6210579373126240850_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=833d8c&_nc_ohc=_i_TvfaQBsgQ7kNvgEd97dw&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AJVMY1ZyNKdbP8ioATXt0SZ&oh=00_AYCo8K1WhgS3cgw52B51NSclRYpJqiNJa--sd6JLzKlXkw&oe=67A7B1C7",
     ],
  tennessee: [
    // 4 Tennessee images (Unsplash examples)
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/454314698_8258600107524296_5744322330665360799_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=102&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=4EGaC8nFVFgQ7kNvgFAKZOR&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=A4ZKvbCXmAKOu6WDFKVaeAv&oh=00_AYA7bSDP2AgwLrzR1g0Lr3FWxd6r8ad0jVzj6ONE4B5pwA&oe=67A7891E",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/455631872_8322741564443483_2798931171289703877_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=wvR65POwwtkQ7kNvgGe3ayk&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AdnRuveJYEOYzTsuZkYakTD&oh=00_AYCzpP0jmzTHwEQeUeDuB09XMXY2xNby38yCuZq1RzA8wA&oe=67A78AE9",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/459397546_8480644641986507_1336535011999683028_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=833d8c&_nc_ohc=sbmDYGj94rkQ7kNvgHiZ-xQ&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AjBNYtr0CTW2_B1pimfdKix&oh=00_AYCkOWTpm0_Qm_rqpWhZg1fx1eO-1RjwObAKjvih9PROAw&oe=67A77E86",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/459247974_8480645015319803_1412228176233537978_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=jOandlU_uzEQ7kNvgHTqA2f&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AANBmWfHcepWJKN38IYuSIc&oh=00_AYC9hJRnjUUlLnfyvbhe7t2fDR2hoIaBB1l-tx6lFmMPuQ&oe=67A7B3FC",

  ],
  lyon: [
    // 4 Tennessee images (Unsplash examples)
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/441178069_7796337780417200_7337824886491358979_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=833d8c&_nc_ohc=OJQdkN8TV_gQ7kNvgFFhkga&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=A1eszK6xyvXII6TVvSiwmlk&oh=00_AYDwOWg1Re0t2p7v9YRnUj2dU2cA2Hj57xOrWd1jlMxPAw&oe=67A78DF3",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/438168844_7796338170417161_3345430390754675372_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=zeeDiJUHKb4Q7kNvgFbNPe1&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AbEEXRL9yheX59NkSigtrpk&oh=00_AYB2BH0_Sb3aRRbVACwJmRYiJ0oPiZ6q9cDaV1THdF5FKg&oe=67A78901",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/438172432_7796338843750427_4616807648567929894_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rhj4gf_DrqsQ7kNvgGKIH8a&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AJQyh9XIVpK5MY-UnDS9Lc2&oh=00_AYCKg0tOEdJ9piiObx3ZHaDeg-WHWObku6Km9fMRGiE5VQ&oe=67A7AF0C",
    "https://scontent-sea1-1.xx.fbcdn.net/v/t39.30808-6/438163007_7796339200417058_6923345574805263292_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=833d8c&_nc_ohc=rdJ844ZUWhMQ7kNvgHANPwr&_nc_zt=23&_nc_ht=scontent-sea1-1.xx&_nc_gid=AI8FiXvHZDM7bgAC9yj2muP&oh=00_AYAakDfLOKS9vBu4rkWWPWrsdaKiGxUsVXi_RhUMEFcdHw&oe=67A7A42C"
  ]
};
const placeCoordinates = {

      addis_ababa: [8.9806, 38.7578],

      jerusalem: [31.778345, 35.220480],

      delft: [52.011576, 4.357067],

      tennessee: [35.5175, -86.5804],
      lyon: [45.7640,4.8357],
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
  slide1Snapper.innerHTML = ''; // Clear first
slide1Snapper.appendChild(document.createElement('img')).src = images[0];

  // Slide 2
  const slide2Snapper = document.querySelector("#carousel__slide2 .carousel__snapper");
  const slide2NavHTML = slide2Snapper.querySelectorAll("a");
  slide2Snapper.innerHTML = `<img src="${images[1]}" class="carousel__image" alt="Slide 2" />`;
  slide2NavHTML.forEach(anchor => slide2Snapper.appendChild(anchor));

  // Slide 3
  const slide3Snapper = document.querySelector("#carousel__slide3 .carousel__snapper");
  const slide3NavHTML = slide3Snapper.querySelectorAll("a");
  slide3Snapper.innerHTML = `<img src="${images[2]}" class="carousel__image" alt="Slide 3" />`;
  slide3NavHTML.forEach(anchor => slide3Snapper.appendChild(anchor));

  // Slide 4
  const slide4Snapper = document.querySelector("#carousel__slide4 .carousel__snapper");
  const slide4NavHTML = slide4Snapper.querySelectorAll("a");
  slide4Snapper.innerHTML = `<img src="${images[3]}"class="carousel__image"  alt="Slide 4" />`;
  slide4NavHTML.forEach(anchor => slide4Snapper.appendChild(anchor));

  console.log(`Carousel updated for place: ${placeId}`);
}
// Attach event listener to the tab click event
document.querySelector(".tab:nth-child(3)").addEventListener("click", refreshMap3);
