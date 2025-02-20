let map6 = L.map('map6').setView([46.25, -119.2], 9);
let featureGroup = L.featureGroup().addTo(map6);
let cardMap = new Map();
let currentPlot = null; // Keep this at the top level
let updateInterval = null;

// Initialize Base Map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map6);

// Map Click Handler
map6.on('click', async e => {
    const marker = L.marker(e.latlng).addTo(featureGroup);
    const card = createCard(e.latlng, marker._leaflet_id);
    cardMap.set(marker._leaflet_id, { marker, card });

    try {
        const comid = await fetchCOMID(e.latlng.lng, e.latlng.lat);
        updateCardAndFlowline(marker, comid);
    } catch (error) {
        handleFetchError(marker, error);
    }
});

// Card Creation
function createCard(latlng, markerId) {
    const card = document.createElement('div');
    card.className = 'comid-card';
    card.innerHTML = `
        <div class="coordinates">${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}</div>
        <div class="comid-value">⏳ Loading...</div>
    `;

    card.addEventListener('click', () => {
        const { marker } = cardMap.get(markerId);
        map6.setView(marker.getLatLng(), 14);
        marker.openPopup();
    });

    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
        cardContainer.prepend(card);
    } else {
        console.error('Card container not found');
    }
    return card;
}

// Data Fetching Functions
async function fetchCOMID(lon, lat) {
    const response = await axios.get(
        `https://labs.waterdata.usgs.gov/api/nldi/linked-data/comid/position?coords=POINT(${lon}%20${lat})`
    );
    return response.data.features[0].properties.comid;
}

async function updateCardAndFlowline(marker, comid) {
    // Update Card
    const cardInfo = cardMap.get(marker._leaflet_id);
    if (cardInfo && cardInfo.card) {
        const comidValueElement = cardInfo.card.querySelector('.comid-value');
        if (comidValueElement) {
            comidValueElement.textContent = comid;
        }
    }

    // Add Flowline
    try {
        const flowlineResponse = await axios.get(
            `https://labs.waterdata.usgs.gov/api/nldi/linked-data/comid/${comid}`
        );

        L.geoJSON(flowlineResponse.data, {
            style: { color: '#0078d4', weight: 2 },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`COMID: ${comid}`);
                layer.on('click', () => showForecastModal(comid));
            }
        }).addTo(featureGroup);

        marker.bindPopup(`COMID: ${comid}`).on('click', () => showForecastModal(comid));
        map6.fitBounds(featureGroup.getBounds());
    } catch (error) {
        console.error('Error fetching flowline data:', error);
    }
}

// Forecast Visualization
async function showForecastModal(comid) {
    const modalComidElement = document.getElementById('modalComid');
    const dischargeModal = document.getElementById('dischargeModal');

    if (modalComidElement && dischargeModal) {
        modalComidElement.textContent = comid;
        dischargeModal.style.display = 'block';

        if (updateInterval) clearInterval(updateInterval);
        updateInterval = setInterval(() => updateDischargePlot(comid), 2000);
        await updateDischargePlot(comid);
    } else {
        console.error('Modal elements not found');
    }
}

async function updateDischargePlot(comid) {
    try {
        // Fetch both short_range and long_range data
        const [shortRangeResponse, longRangeResponse] = await Promise.all([
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${comid}/streamflow?series=short_range`),
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${comid}/streamflow?series=long_range`)
        ]);

        const shortRangeData = shortRangeResponse.data.shortRange?.series?.data;
        const longRangeData = longRangeResponse.data.longRange?.series?.data;

        console.log('Short Range Data:', shortRangeData);
        console.log('Long Range Data:', longRangeData);

        const traces = [];

        if (shortRangeData && shortRangeData.length > 0) {
            traces.push(createTrace(shortRangeData, 'Short Range', '#1f77b4'));
        } else {
            console.warn("No short-range forecast data available.");
        }

        if (longRangeData && longRangeData.length > 0) {
            traces.push(createTrace(longRangeData, 'Long Range', '#ff7f0e'));
        } else {
            console.warn("No long-range forecast data available.");
        }

        console.log('Traces:', traces);

        const layout = {
            title: `Discharge Forecast (ft³/s) for Reach ID: ${comid}`,
            xaxis: { title: 'Time', rangeslider: {} },
            yaxis: { title: 'Discharge (ft³/s)' },
            showlegend: true,
            margin: { t: 40, b: 100 }
        };

        const dischargePlotElement = document.getElementById('dischargePlot');
        if (dischargePlotElement) {
            if (currentPlot) {
                Plotly.react('dischargePlot', traces, layout);
            } else {
                currentPlot = Plotly.newPlot('dischargePlot', traces, layout);
            }
        } else {
            console.error('Discharge plot element not found');
        }
    } catch (error) {
        console.error('Forecast update error:', error);
        const dischargePlotElement = document.getElementById('dischargePlot');
        if (dischargePlotElement) {
            dischargePlotElement.innerHTML = `<p>Error fetching forecast data. Please try again later.</p>`;
        }
        if (updateInterval) clearInterval(updateInterval);
    }
}

function createTrace(forecasts, name, color) {
    return {
        x: forecasts.map(f => new Date(f.validTime)),
        y: forecasts.map(f => f.flow),
        mode: 'lines+markers',
        name: name,
        line: { color: color },
        hoverinfo: 'x+y+name'
    };
}

// Utility Functions
function clearAll() {
    featureGroup.clearLayers();
    const cardContainer = document.getElementById('card-container');
    if (cardContainer) {
        cardContainer.innerHTML = '';
    }
    cardMap.clear();
    if (updateInterval) clearInterval(updateInterval);
}

function handleFetchError(marker, error) {
    console.error('Fetch error:', error);
    const cardInfo = cardMap.get(marker._leaflet_id);
    if (cardInfo && cardInfo.card) {
        const comidValueElement = cardInfo.card.querySelector('.comid-value');
        if (comidValueElement) {
            comidValueElement.textContent = '❌ Error';
        }
    }
    marker.bindPopup('Failed to fetch data').openPopup();
}

// Event Listeners
const clearAllButton = document.getElementById('clearAllButton');
if (clearAllButton) {
    clearAllButton.addEventListener('click', clearAll);
}

const closeButton = document.querySelector('.close');
if (closeButton) {
    closeButton.addEventListener('click', () => {
        const dischargeModal = document.getElementById('dischargeModal');
        if (dischargeModal) {
            dischargeModal.style.display = 'none';

            // Clear the interval AND the plot when the modal is closed
            if (updateInterval) clearInterval(updateInterval);
            const dischargePlotElement = document.getElementById('dischargePlot');
            if (dischargePlotElement) {
                dischargePlotElement.innerHTML = '';  // Clear the plot's content
                currentPlot = null; // Reset currentPlot
            }
        }
    });
}

window.onclick = event => {
    const dischargeModal = document.getElementById('dischargeModal');
    if (event.target == dischargeModal) {
        dischargeModal.style.display = 'none';
        // Clear the interval AND the plot when the modal is closed
        if (updateInterval) clearInterval(updateInterval);
        const dischargePlotElement = document.getElementById('dischargePlot');
        if (dischargePlotElement) {
            dischargePlotElement.innerHTML = '';  // Clear the plot's content
            currentPlot = null; // Reset currentPlot
        }
    }
};
