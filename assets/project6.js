const PROXY_URL = 'https://henok.x10.mx/index.php'; // Your PHP endpoint

// Map initialization
let map6 = L.map('map6').setView([46.25, -119.2], 9);
let featureGroup = L.featureGroup().addTo(map6);
let cardMap = new Map();

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map6);

// Event handlers
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

// Card management
function createCard(latlng, markerId) {
    const card = document.createElement('div');
    card.className = 'comid-card';
    card.innerHTML = `
        <div class="coordinates">${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}</div>
        <div class="comid-value">⏳ Loading COMID...</div>
    `;

    card.addEventListener('click', () => {
        const { marker } = cardMap.get(markerId);
        map6.setView(marker.getLatLng(), 14);
        marker.openPopup();
    });

    document.getElementById('card-container').prepend(card);
    return card;
}

// Data fetching
async function fetchCOMID(lon, lat) {
    try {
        const response = await axios.get(
            `https://labs.waterdata.usgs.gov/api/nldi/linked-data/comid/position?coords=POINT(${lon}%20${lat})`
        );
        return response.data.features[0].properties.comid;
    } catch (error) {
        throw new Error('Failed to fetch COMID');
    }
}

async function updateCardAndFlowline(marker, comid) {
    const cardInfo = cardMap.get(marker._leaflet_id);
    const comidValue = cardInfo.card.querySelector('.comid-value');
    comidValue.textContent = comid;
    comidValue.style.color = '#28a745';

    try {
        const flowlineResponse = await axios.get(
            `https://labs.waterdata.usgs.gov/api/nldi/linked-data/comid/${comid}`
        );

        L.geoJSON(flowlineResponse.data, {
            style: { color: '#007bff', weight: 3 },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(`COMID: ${comid}`);
                layer.on('click', () => showAnalysisModal(comid));
            }
        }).addTo(featureGroup);

        marker.bindPopup(`COMID: ${comid}`).on('click', () => showAnalysisModal(comid));
        map6.fitBounds(featureGroup.getBounds());
    } catch (error) {
        console.error('Flowline error:', error);
        comidValue.textContent = '❌ Flowline Error';
        comidValue.style.color = '#dc3545';
    }
}

// Analysis modal functions
async function showAnalysisModal(comid) {
    const modal = document.getElementById('dischargeModal');
    document.getElementById('modalComid').textContent = comid;
    modal.style.display = 'block';

    // Show loading states
    ['dischargePlotShort', 'dischargePlotLong', 'returnPeriodPlot'].forEach(id => {
        document.getElementById(id).innerHTML = '<div class="loading">Loading data...</div>';
    });

    try {
        await Promise.all([
            updateDischargePlot(comid),
            updateReturnPeriodPlot(comid)
        ]);
    } catch (error) {
        console.error('Analysis error:', error);
        document.getElementById('returnPeriodPlot').innerHTML =
            `<div class="error">${error.message}</div>`;
    }
}

async function updateDischargePlot(comid) {
    try {
        const [shortRange, longRange] = await Promise.all([
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${comid}/streamflow?series=short_range`),
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${comid}/streamflow?series=long_range`)
        ]);

        createDischargePlot('dischargePlotShort',
            shortRange.data.shortRange?.series?.data,
            'Short Range Forecast',
            '#1f77b4'
        );

        createDischargePlot('dischargePlotLong',
            longRange.data.longRange?.mean?.data,
            'Long Range Forecast',
            '#ff7f0e'
        );
    } catch (error) {
        handlePlotError('Forecast data unavailable');
    }
}

async function updateReturnPeriodPlot(comid) {
    try {
        const response = await axios.get(PROXY_URL, {
            params: { comid: comid }
        });

        if (!response.data.success) {
            throw new Error(response.data.error || 'Server error');
        }

        const data = response.data.data[0];
        const periods = [2, 5, 10, 25, 50, 100];
        const values = periods.map(p => data[`return_period_${p}`]);
        console.log('return period')
        console.log(data)
        console.log(values)

        Plotly.newPlot('returnPeriodPlot', [{
            x: periods.map(p => `${p}-Year`),
            y: values,
            type: 'bar',
            marker: { color: '#4CAF50' }
        }], {
            title: 'Return Period Discharge (ft³/s)',
            xaxis: { title: 'Return Period' },
            yaxis: { title: 'Discharge' },
            margin: { t: 40, b: 100 }
        });
    } catch (error) {
        throw new Error('Failed to load return periods: ' + error.message);
    }
}

// Plot utilities
function createDischargePlot(containerId, data, title, color) {
    const container = document.getElementById(containerId);

    if (!data || data.length === 0) {
        container.innerHTML = `<div class="error">${title} data unavailable</div>`;
        return;
    }

    Plotly.newPlot(container, [{
        x: data.map(d => new Date(d.validTime)),
        y: data.map(d => d.flow),
        mode: 'lines+markers',
        line: { color: color },
        name: title
    }], {
        title: `${title} (ft³/s)`,
        xaxis: { title: 'Time', rangeslider: {} },
        yaxis: { title: 'Discharge' },
        margin: { t: 40, b: 100 }
    });
}

function handlePlotError(message) {
    ['dischargePlotShort', 'dischargePlotLong'].forEach(id => {
        document.getElementById(id).innerHTML =
            `<div class="error">${message}</div>`;
    });
}

// Cleanup functions
function clearAll() {
    featureGroup.clearLayers();
    document.getElementById('card-container').innerHTML = '';
    cardMap.clear();
}

function handleFetchError(marker, error) {
    console.error('Fetch error:', error);
    const cardInfo = cardMap.get(marker._leaflet_id);
    cardInfo.card.querySelector('.comid-value').textContent = '❌ Error';
    cardInfo.card.querySelector('.comid-value').style.color = '#dc3545';
    marker.bindPopup('Data fetch failed').openPopup();
}

// Event listeners
document.getElementById('clearAllButton').addEventListener('click', clearAll);
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('dischargeModal').style.display = 'none';
});
window.addEventListener('click', e => {
    if (e.target === document.getElementById('dischargeModal')) {
        document.getElementById('dischargeModal').style.display = 'none';
    }
});