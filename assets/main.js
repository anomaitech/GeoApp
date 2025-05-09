/************************************************************/
/*      Tab Switching + Date/Time + Unit Converter          */
/************************************************************/
function showTab(tabNum) {
  // remove 'active' class from all .tab and .tab-content
const allTabs = document.querySelectorAll('.tab');
const allContents = document.querySelectorAll('.tab-content');

allTabs.forEach(t => t.classList.remove('active'));
allContents.forEach(c => c.classList.remove('active'));

// Because tabNum is 1-based (1,2,3,4...), we do:
allTabs[tabNum - 1].classList.add('active');
allContents[tabNum - 1].classList.add('active');

  // if we just activated Project 2 tab, ensure the map is resized properly
  if (tabNum === 2 && typeof map2 !== 'undefined') {
    setTimeout(() => {
      map2.invalidateSize();
    }, 50);
  }
 if (tabNum === 4 && typeof map2 !== 'undefined') {
    setTimeout(() => {
      map4.invalidateSize();
    }, 50);
  }
  if (tabNum === 6 && typeof map6 !== 'undefined') {
    setTimeout(() => {
      map6.invalidateSize();
    }, 50);
  }
}

// keep date/time updated
function setDateTime() {
  const now = new Date().toLocaleString();
  const dateEl = document.getElementById('dateNow');
  if (dateEl) {
    dateEl.textContent = now;
  }
}
setInterval(setDateTime, 1000);

// minimal unit converter
const unitConfig = {
  length: ["meters", "kilometers", "miles", "feet"],
  weight: ["kilograms", "grams", "pounds"],
  temperature: ["celsius", "fahrenheit"]
};

function updateUnits() {
  const unitType = document.getElementById('unit-type').value;
  const fromUnit = document.getElementById('from-unit');
  const toUnit   = document.getElementById('to-unit');

  fromUnit.innerHTML = '';
  toUnit.innerHTML   = '';

  unitConfig[unitType].forEach(u => {
    const opt1 = document.createElement('option');
    opt1.value = u;
    opt1.textContent = u;
    fromUnit.appendChild(opt1);

    const opt2 = document.createElement('option');
    opt2.value = u;
    opt2.textContent = u;
    toUnit.appendChild(opt2);
  });
}

function convertUnits() {
  const unitType   = document.getElementById('unit-type').value;
  const inputValue = parseFloat(document.getElementById('input-value').value);
  const fromVal    = document.getElementById('from-unit').value;
  const toVal      = document.getElementById('to-unit').value;

  if (isNaN(inputValue)) {
    alert("Please enter a valid number.");
    return;
  }
  let result = 0;

  // LENGTH
  if (unitType === 'length') {
    let inMeters = 0;
    switch(fromVal) {
      case 'meters':     inMeters = inputValue; break;
      case 'kilometers': inMeters = inputValue * 1000; break;
      case 'miles':      inMeters = inputValue * 1609.34; break;
      case 'feet':       inMeters = inputValue * 0.3048; break;
    }
    switch(toVal) {
      case 'meters':     result = inMeters; break;
      case 'kilometers': result = inMeters / 1000; break;
      case 'miles':      result = inMeters / 1609.34; break;
      case 'feet':       result = inMeters / 0.3048; break;
    }
  }
  // WEIGHT
  else if (unitType === 'weight') {
    let inKg = 0;
    switch(fromVal) {
      case 'kilograms': inKg = inputValue; break;
      case 'grams':     inKg = inputValue / 1000; break;
      case 'pounds':    inKg = inputValue * 0.453592; break;
    }
    switch(toVal) {
      case 'kilograms': result = inKg; break;
      case 'grams':     result = inKg * 1000; break;
      case 'pounds':    result = inKg / 0.453592; break;
    }
  }
  // TEMPERATURE
  else if (unitType === 'temperature') {
    let inC = 0;
    switch(fromVal) {
      case 'celsius':    inC = inputValue; break;
      case 'fahrenheit': inC = (inputValue - 32) * 5/9; break;
    }
    switch(toVal) {
      case 'celsius':    result = inC; break;
      case 'fahrenheit': result = (inC * 9/5) + 32; break;
    }
  }

  // Display
  document.getElementById('result').textContent = result.toFixed(2);

  // Add to history
  const histList = document.getElementById('history-list');
  const li = document.createElement('li');
  li.textContent = `${inputValue} ${fromVal} -> ${result.toFixed(2)} ${toVal}`;
  histList.prepend(li);
}

// init dropdown
updateUnits();


