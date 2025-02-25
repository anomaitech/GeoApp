let myChart = null;

async function getForecast() {
    const reachId = document.getElementById('reachId').value.trim();
    const forecastType = document.getElementById('forecastType').value;
    console.log(reachId);
    if (!reachId) {
        alert('Please enter a reach ID');
        return;
    }

    try {
        const [shortRange, longRange] = await Promise.all([
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=short_range`),
            axios.get(`https://api.water.noaa.gov/nwps/v1/reaches/${reachId}/streamflow?series=long_range`)
        ]);

        console.log("Short-Range Data:", shortRange.data.shortRange?.series?.data);
        console.log("Long-Range Data:", longRange.data.longRange?.mean?.data);

        displayReachInfo(shortRange.data, longRange.data, forecastType);
    } catch (error) {
        console.error('Error:', error);
        alert('Error fetching forecast data');
    }
}

function displayReachInfo(shortRangeData, longRangeData, forecastType) {
    const infoDiv = document.getElementById('reachInfo');

    infoDiv.innerHTML = `
        <h3>Reach Information</h3>
        <p><strong>Name:</strong> ${shortRangeData.reach?.name || "Unknown"}</p>
        <p><strong>Coordinates:</strong> ${shortRangeData.reach?.latitude || "N/A"}, ${shortRangeData.reach?.longitude || "N/A"}</p>
        <p><strong>Available Forecasts:</strong> Short-Range, Long-Range</p>
        <p><strong>Selected Forecast:</strong> ${forecastType.replace("_", " ").toUpperCase()}</p>
    `;

    let forecastData;
    if (forecastType === "short_range") {
        forecastData = shortRangeData.shortRange?.series?.data || [];
    } else if (forecastType === "long_range") {
        forecastData = longRangeData.longRange?.mean?.data || [];
    } else {
        alert("Invalid forecast type selected or no data available.");
        return;
    }

    if (!forecastData || !Array.isArray(forecastData) || forecastData.length === 0) {
        alert("No forecast data available.");
        return;
    }

    const timestamps = forecastData.map(entry => new Date(entry.validTime));
    const flowValues = forecastData.map(entry => entry.flow);

    displayChart(timestamps, flowValues, forecastType);
    displayTable(timestamps, flowValues);
}

function displayChart(times, flows, forecastType) {
    const ctx = document.getElementById('forecastChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times.map(t => t.toLocaleString()),
            datasets: [{
                label: `Streamflow Forecast (ft³/s) - ${forecastType.replace("_", " ").toUpperCase()}`,
                data: flows,
                borderColor: '#007bff',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { title: { display: true, text: 'ft³/s' } },
                x: { title: { display: true, text: 'Time' } }
            }
        }
    });
}

function displayTable(times, flows) {
    const table = document.getElementById('forecastTable');
    table.innerHTML = `<tr><th>Time</th><th>Streamflow (ft³/s)</th></tr>`;
    times.forEach((time, index) => {
        const row = table.insertRow();
        row.insertCell().textContent = time.toLocaleString();
        row.insertCell().textContent = flows[index];
    });
}
