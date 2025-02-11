let myChart = null;

        async function getForecast() {
            const reachId = document.getElementById('reachId').value.trim();
            const forecastType = document.getElementById('forecastType').value;

            if (!reachId) {
                alert('Please enter a reach ID');
                return;
            }

            try {
                const response = await fetch(`https://api.water.noaa.gov/nwps/v1/reaches/${reachId}`);
                if (!response.ok) throw new Error("Error fetching data");

                const data = await response.json();
                displayReachInfo(data, forecastType);
            } catch (error) {
                console.error('Error:', error);
                alert('Error fetching forecast data');
            }
        }

        function displayReachInfo(data, forecastType) {
            const infoDiv = document.getElementById('reachInfo');
            infoDiv.innerHTML = `
                <h3>Reach Information</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Coordinates:</strong> ${data.latitude}, ${data.longitude}</p>
                <p><strong>Available Forecasts:</strong> ${data.streamflow.join(", ")}</p>
                <p><strong>Selected Forecast:</strong> ${forecastType.replace("_", " ").toUpperCase()}</p>
                <h4>Upstream Reaches</h4>
                <ul>${data.route.upstream.map(r => `<li>Reach ID: ${r.reachId} (Order: ${r.streamOrder})</li>`).join("")}</ul>
                <h4>Downstream Reaches</h4>
                <ul>${data.route.downstream.map(r => `<li>Reach ID: ${r.reachId} (Order: ${r.streamOrder})</li>`).join("")}</ul>
            `;

            // Simulated forecast data for selected type
            const timestamps = Array.from({ length: 10 }, (_, i) => new Date(Date.now() + i * 3600000));
            const flowValues = timestamps.map(() => (Math.random() * 200).toFixed(2));

            displayChart(timestamps, flowValues);
            displayTable(timestamps, flowValues);
        }

        function displayChart(times, flows) {
            const ctx = document.getElementById('forecastChart').getContext('2d');
            if (myChart) myChart.destroy();

            myChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: times.map(t => t.toLocaleTimeString()),
                    datasets: [{
                        label: 'Streamflow Forecast (m³/s)',
                        data: flows,
                        borderColor: '#007bff',
                        tension: 0.1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: { title: { display: true, text: 'm³/s' } },
                        x: { title: { display: true, text: 'Time' } }
                    }
                }
            });
        }

        function displayTable(times, flows) {
            const table = document.getElementById('forecastTable');
            table.innerHTML = `<tr><th>Time</th><th>Streamflow (m³/s)</th></tr>`;
            times.forEach((time, index) => {
                const row = table.insertRow();
                row.insertCell().textContent = time.toLocaleString();
                row.insertCell().textContent = flows[index];
            });
        }