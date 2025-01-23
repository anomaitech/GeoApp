
    const units = {
        length: [
            { name: "Meters", factor: 1 },
            { name: "Kilometers", factor: 0.001 },
            { name: "Centimeters", factor: 100 },
            { name: "Inches", factor: 39.3701 },
            { name: "Feet", factor: 3.28084 }
        ],
        weight: [
            { name: "Kilograms", factor: 1 },
            { name: "Grams", factor: 1000 },
            { name: "Pounds", factor: 2.20462 },
            { name: "Ounces", factor: 35.274 }
        ],
        temperature: [
            { name: "Celsius", factor: 1 },
            { name: "Fahrenheit", factor: 1 },
            { name: "Kelvin", factor: 1 }
        ]
    };

    function updateUnits() {
        const unitType = document.getElementById("unit-type").value;
        const fromUnit = document.getElementById("from-unit");
        const toUnit = document.getElementById("to-unit");

        fromUnit.innerHTML = "";
        toUnit.innerHTML = "";

        units[unitType].forEach(unit => {
            const option1 = document.createElement("option");
            option1.value = unit.name;
            option1.textContent = unit.name;
            fromUnit.appendChild(option1);

            const option2 = document.createElement("option");
            option2.value = unit.name;
            option2.textContent = unit.name;
            toUnit.appendChild(option2);
        });
    }

    function convertUnits() {
        const unitType = document.getElementById("unit-type").value;
        const inputValue = parseFloat(document.getElementById("input-value").value);
        const fromUnit = document.getElementById("from-unit").value;
        const toUnit = document.getElementById("to-unit").value;
        const result = document.getElementById("result");
        let convertedValue;

        if (unitType === "temperature") {
            if (fromUnit === "Celsius" && toUnit === "Fahrenheit") {
                convertedValue = (inputValue * 9/5) + 32;
            } else if (fromUnit === "Fahrenheit" && toUnit === "Celsius") {
                convertedValue = (inputValue - 32) * 5/9;
            } else if (fromUnit === "Celsius" && toUnit === "Kelvin") {
                convertedValue = inputValue + 273.15;
            } else if (fromUnit === "Kelvin" && toUnit === "Celsius") {
                convertedValue = inputValue - 273.15;
            } else if (fromUnit === "Fahrenheit" && toUnit === "Kelvin") {
                convertedValue = ((inputValue - 32) * 5/9) + 273.15;
            } else if (fromUnit === "Kelvin" && toUnit === "Fahrenheit") {
                convertedValue = ((inputValue - 273.15) * 9/5) + 32;
            } else {
                convertedValue = inputValue;
            }
        } else {
            const fromFactor = units[unitType].find(unit => unit.name === fromUnit)?.factor;
            const toFactor = units[unitType].find(unit => unit.name === toUnit)?.factor;
            if (fromFactor !== undefined && toFactor !== undefined) {
                convertedValue = ((inputValue / fromFactor) * toFactor);
            } else {
                convertedValue = "Invalid Conversion";
            }
        }

        result.textContent = typeof convertedValue === 'number' ? convertedValue.toFixed(4) : convertedValue;
        addToHistory(inputValue, fromUnit, convertedValue, toUnit);
    }

    function addToHistory(fromValue, fromUnit, toValue, toUnit) {
        const historyList = document.getElementById("history-list");
        const listItem = document.createElement("li");
        const currentTime = new Date().toLocaleTimeString();
        listItem.textContent = `${currentTime} - ${fromValue} ${fromUnit} = ${toValue} ${toUnit}`;
        historyList.prepend(listItem);

        // Limit history to last 5 conversions
        if (historyList.children.length > 5) {
            historyList.removeChild(historyList.lastChild);
        }
    }

    function updateTime() {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        const formattedTime = `${hours}:${minutes}:${seconds}`;

        const toDate = document.getElementById("date");
        toDate.textContent = formattedTime;
    }

    function showTab(tabNumber) {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach((tab, index) => {
            if (index + 1 === tabNumber) {
                tab.classList.add('active');
                tabContents[index].classList.add('active');
            } else {
                tab.classList.remove('active');
                tabContents[index].classList.remove('active');
            }
        });
    }

    // Initialize the unit options
    updateUnits();

    // Update time every second
    setInterval(updateTime, 1000);

    // Initialize the map
    document.addEventListener('DOMContentLoaded', function() {
        var map = L.map('map').setView([40.2508, -111.6493], 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([40.2508, -111.6493]).addTo(map)
            .bindPopup('Brigham Young University')
            .openPopup();
    });
