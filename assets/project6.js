let map6 = L.map('map6').setView([46.25, -119.2], 9);
let featureGroup = L.featureGroup().addTo(map6);
let cardMap = new Map();

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

    document.getElementById('card-container').prepend(card);
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
    cardInfo.card.querySelector('.comid-value').textContent = comid;

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
    const dischargeModal = document.getElementById('dischargeModal');
    document.getElementById('modalComid').textContent = comid;
    dischargeModal.style.display = 'block';

    // Clear previous plots
    ['dischargePlotShort', 'dischargePlotLong', 'returnPeriodPlot'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });

    try {
        await updateDischargePlot(comid);
        await updateReturnPeriodPlot(comid);
    } catch (error) {
        console.error('Error updating plots:', error);
    }
}

async function updateDischargePlot(comid) {
    try {
        const [shortRangeResponse, longRangeResponse] = await Promise.all([
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${comid}/streamflow?series=short_range`),
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${comid}/streamflow?series=long_range`)
        ]);

        // Process discharge data
        const shortData = shortRangeResponse.data.shortRange?.series?.data || [];
        const longData = longRangeResponse.data.longRange?.mean?.data || [];

        // Plot discharge forecasts
        plotData('dischargePlotShort', shortData, 'Short Range Forecast', '#1f77b4');
        plotData('dischargePlotLong', longData, 'Long Range Forecast', '#ff7f0e');
    } catch (error) {
        handlePlotError('discharge', error);
    }
}

async function updateReturnPeriodPlot(comid) {
    try {
        const response = await axios.get('https://nwm-api-updt-9f6idmxh.uc.gateway.dev/return-period', {
            headers: { 'x-api-key': 'AIzaSyArCbLaEevrqrVPJDzu2OioM_kNmCBtsx8' },
            params: {
                comids: comid,
                output_format: 'json',
                order_by_comid: 'False'
            }
        });

        const returnData = response.data;
        if (returnData.length === 0) throw new Error('No return period data');

        const periods = [2, 5, 10, 25, 50, 100];
        const values = periods.map(p => returnData[0][`return_period_${p}`]);

        Plotly.newPlot('returnPeriodPlot', [{
            x: periods.map(p => `${p}-year`),
            y: values,
            type: 'bar',
            marker: { color: '#2ca02c' }
        }], {
            title: 'Return Period Discharge Values (ft³/s)',
            xaxis: { title: 'Return Period' },
            yaxis: { title: 'Discharge' },
            margin: { t: 40, b: 100 }
        });
    } catch (error) {
        document.getElementById('returnPeriodPlot').innerHTML =
            '<div class="plot-placeholder">Error loading return period data</div>';
    }
}

// Utility functions
function plotData(containerId, data, title, color) {
    if (data.length === 0) {
        document.getElementById(containerId).innerHTML =
            `<div class="plot-placeholder">No ${title.toLowerCase()} data available</div>`;
        return;
    }

    Plotly.newPlot(containerId, [{
        x: data.map(f => new Date(f.validTime)),
        y: data.map(f => f.flow),
        mode: 'lines+markers',
        line: { color },
        name: title
    }], {
        title: `${title} (ft³/s)`,
        xaxis: { title: 'Time', rangeslider: {} },
        yaxis: { title: 'Discharge' },
        margin: { t: 40, b: 100 }
    });
}

function handlePlotError(type, error) {
    console.error(`${type} plot error:`, error);
    const containers = type === 'discharge'
        ? ['dischargePlotShort', 'dischargePlotLong']
        : ['returnPeriodPlot'];

    containers.forEach(id => {
        document.getElementById(id).innerHTML =
            '<div class="plot-placeholder">Error loading data</div>';
    });
}

function clearAll() {
    featureGroup.clearLayers();
    document.getElementById('card-container').innerHTML = '';
    cardMap.clear();
}

function handleFetchError(marker, error) {
    console.error('Fetch error:', error);
    const cardInfo = cardMap.get(marker._leaflet_id);
    cardInfo.card.querySelector('.comid-value').textContent = '❌ Error';
    marker.bindPopup('Failed to fetch data').openPopup();
}

// Event Listeners
document.getElementById('clearAllButton').addEventListener('click', clearAll);

document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('dischargeModal').style.display = 'none';
    ['dischargePlotShort', 'dischargePlotLong', 'returnPeriodPlot'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });
});

window.onclick = event => {
    const dischargeModal = document.getElementById('dischargeModal');
    if (event.target === dischargeModal) {
        dischargeModal.style.display = 'none';
        ['dischargePlotShort', 'dischargePlotLong', 'returnPeriodPlot'].forEach(id => {
            document.getElementById(id).innerHTML = '';
        });
    }
};