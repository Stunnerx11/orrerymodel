document.addEventListener("DOMContentLoaded", () => {
    // Create main container
    const inputBox = document.createElement('div');
    inputBox.id = 'inputBox';

    // Create the date header
    const dateHeader = document.createElement('h3');
    dateHeader.id = 'date';
    inputBox.appendChild(dateHeader);

    // Create the main content div
    const mainDiv = document.createElement('div');

    // Create the table for time controls
    const timeTable = document.createElement('table');
    timeTable.style.float = 'right';

    // Create the first row for buttons
    const buttonRow = document.createElement('tr');
    const buttonConfigs = [
        { id: 'now', title: 'Set time to now', imgSrc: 'data/now.svg' },
        { id: 'reverse', title: 'Slow/reverse time', imgSrc: 'data/rewind (2).svg' },
        { id: 'forward', title: 'Advance time', imgSrc: 'data/ff.svg' },
        { id: 'play', title: 'Play/pause', imgSrc: 'data/pause.svg' }
    ];

    buttonConfigs.forEach(config => {
        const td = document.createElement('td');
        const button = document.createElement('button');
        button.id = config.id;
        button.title = config.title;
        const img = document.createElement('img');
        img.src = config.imgSrc;
        button.appendChild(img);
        td.appendChild(button);
        buttonRow.appendChild(td);
    });

    // Add speed field
    const speedField = document.createElement('td');
    speedField.id = 'speedfield';
    const speedSpan = document.createElement('span');
    speedSpan.id = 'speed';
    const fpsSpan = document.createElement('span');
    fpsSpan.id = 'fps';
    speedField.appendChild(speedSpan);
    speedField.appendChild(document.createElement('br'));
    speedField.appendChild(document.createTextNode('FPS: '));
    speedField.appendChild(fpsSpan);
    buttonRow.appendChild(speedField);

    timeTable.appendChild(buttonRow);

    // Create the second row for geolocation
    const geoRow = document.createElement('tr');
    const latlongCell = document.createElement('td');
    latlongCell.colSpan = 5;
    latlongCell.id = 'latlong';
    latlongCell.innerHTML = `Geolocation:&nbsp;<span id="lat">Default (Greenwich, UK)</span>&nbsp;<span id="long"></span>`;
    geoRow.appendChild(latlongCell);
    timeTable.appendChild(geoRow);

    // Create extra data row
    const extraDataRow = document.createElement('tr');
    extraDataRow.className = 'extraData';
    const extraDataCell = document.createElement('td');
    extraDataCell.colSpan = 5;
    extraDataCell.innerHTML = `MJD:&nbsp;<span id="mjd"></span>&nbsp;&nbsp;&bull;&nbsp;&nbsp;LST:&nbsp;<span id="lst"></span>&deg;`;
    extraDataRow.appendChild(extraDataCell);
    timeTable.appendChild(extraDataRow);

    // Add timeTable to mainDiv
    mainDiv.appendChild(timeTable);

    // Create search section
    const searchLabel = document.createElement('label');
    searchLabel.setAttribute('for', 'autocomplete');
    searchLabel.innerHTML = '<b>SEARCH FOR AN OBJECT:</b>';
    const searchInput = document.createElement('input');
    searchInput.id = 'autocomplete';
    searchInput.title = "Type an object's name";
    const fieldset = document.createElement('fieldset');
    const legend = document.createElement('legend');
    legend.innerHTML = 'Include:&nbsp;&nbsp;';
    fieldset.appendChild(legend);

    const checkboxes = [
        { id: 'moonBox', label: 'Moons' },
        { id: 'asteroidBox', label: 'Asteroids' },
        { id: 'cometBox', label: 'Comets' }
    ];

    checkboxes.forEach(checkboxConfig => {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = checkboxConfig.id;
        input.id = checkboxConfig.id;
        input.title = `Allow ${checkboxConfig.label.toLowerCase()} in search`;
        input.checked = true;

        const label = document.createElement('label');
        label.setAttribute('for', checkboxConfig.id);
        label.innerHTML = checkboxConfig.label;

        fieldset.appendChild(input);
        fieldset.appendChild(label);
        fieldset.appendChild(document.createTextNode('&nbsp;&nbsp;'));
    });

    // Append elements to mainDiv
    mainDiv.appendChild(searchLabel);
    mainDiv.appendChild(searchInput);
    mainDiv.appendChild(fieldset);

    // Create info section
    const infoDiv = document.createElement('div');
    const infoHead = document.createElement('a');
    infoHead.id = 'infohead';
    infoHead.target = '_blank';
    infoDiv.appendChild(infoHead);
    infoDiv.appendChild(document.createElement('br'));

    const infoImg = document.createElement('a');
    infoImg.target = '_blank';
    const wikiPic = document.createElement('img');
    wikiPic.className = 'wikipic';
    infoImg.appendChild(wikiPic);
    infoDiv.appendChild(infoImg);

    const dataLabels = [
        { id: 'planetInfo', label: '' },
        { id: 'semiMajorAxis', label: 'Semimajor Axis:' },
        { id: 'period', label: 'Orbital Period:' },
        { id: 'eccentricity', label: 'Eccentricity:' },
        { id: 'inclination', label: 'Inclination:', unit: '°' },
        { id: 'orbitVel', label: 'Orbital Velocity:', unit: 'km/s' },
        { id: 'radius', label: 'Radius:', unit: 'km' },
        { id: 'absMag', label: 'Absolute Magnitude:' }
    ];

    dataLabels.forEach(({ id, label, unit }) => {
        const line = document.createElement('div');
        line.innerHTML = `${label}&nbsp;<span id="${id}" class="data"></span>${unit || ''}`;
        infoDiv.appendChild(line);
    });

    const earthSpan = document.createElement('span');
    earthSpan.id = 'earth';
    const earthDataLabels = [
        { id: 'earthToSun', label: 'Distance from Sun:', unit: 'AU' },
        { id: 'sunRA', label: 'Sun Right Ascension:', unit: '″' },
        { id: 'sunDec', label: 'Sun Declination:', unit: '°' },
        { id: 'earthRiseSet', label: 'Sun ', unit: '' },
        { id: 'sunAlt', label: 'Sun Altitude:', unit: '°' },
        { id: 'sunAz', label: 'Sun Azimuth:', unit: '″' }
    ];

    earthDataLabels.forEach(({ id, label, unit }) => {
        const line = document.createElement('div');
        line.innerHTML = `${label}&nbsp;<span id="${id}" class="data"></span>${unit || ''}`;
        earthSpan.appendChild(line);
    });

    infoDiv.appendChild(earthSpan);
    mainDiv.appendChild(infoDiv);

    // Create time and geolocation section
    const timeGeoHeader = document.createElement('h3');
    timeGeoHeader.innerText = 'Set Time and Geolocation';
    mainDiv.appendChild(timeGeoHeader);

    const timeGeoTable = document.createElement('table');
    const timeGeoRow1 = document.createElement('tr');
    const timeInputs = [
        { id: 'manualYear', label: 'Year:', title: 'Year (±9999)' },
        { id: 'manualDay', label: 'MMDD:', title: 'Month and Day (MMDD)' },
        { id: 'manualTime', label: 'Time:', title: 'Time of Day (HHMM in military time)' },
    ];

    timeInputs.forEach(({ id, label, title }) => {
        const td = document.createElement('td');
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.innerText = label;
        const input = document.createElement('input');
        input.id = id;
        input.title = title;

        td.appendChild(labelElement);
        td.appendChild(input);
        timeGeoRow1.appendChild(td);
    });

    const setTimeTd = document.createElement('td');
    const setTimeButton = document.createElement('button');
    setTimeButton.id = 'setTime';
    setTimeButton.title = 'Set time';
    const setTimeImg = document.createElement('img');
    setTimeImg.src = 'data/set.svg';
    setTimeButton.appendChild(setTimeImg);
    setTimeTd.appendChild(setTimeButton);
    timeGeoRow1.appendChild(setTimeTd);
    timeGeoTable.appendChild(timeGeoRow1);

    const validDateRow = document.createElement('tr');
    validDateRow.innerHTML = `<td colspan="4">Valid date range: 9999 BC to 9999 AD<br>Use negative year values for BC<br>Time in 4-digit military time</td>`;
    timeGeoTable.appendChild(validDateRow);

    const timeGeoRow2 = document.createElement('tr');
    const coordsInputs = [
        { id: 'manualLat', label: 'Lat:', title: 'Latitude (decimal degrees)' },
        { id: 'manualLon', label: 'Lon:', title: 'Longitude (decimal degrees)' },
    ];

    coordsInputs.forEach(({ id, label, title }) => {
        const td = document.createElement('td');
        const labelElement = document.createElement('label');
        labelElement.setAttribute('for', id);
        labelElement.innerText = label;
        const input = document.createElement('input');
        input.id = id;
        input.title = title;

        td.appendChild(labelElement);
        td.appendChild(input);
        timeGeoRow2.appendChild(td);
    });

    const setCoordsTd = document.createElement('td');
    const setCoordsButton = document.createElement('button');
    setCoordsButton.id = 'setCoords';
    setCoordsButton.title = 'Set coordinates';
    const setCoordsImg = document.createElement('img');
    setCoordsImg.src = 'data/set.svg';
    setCoordsButton.appendChild(setCoordsImg);
    setCoordsTd.appendChild(setCoordsButton);
    timeGeoRow2.appendChild(setCoordsTd);
    timeGeoTable.appendChild(timeGeoRow2);

    const coordsInfoRow = document.createElement('tr');
    coordsInfoRow.innerHTML = `<td colspan="4">Use decimal degrees for lat/long,<br>negative values for west or south</td>`;
    timeGeoTable.appendChild(coordsInfoRow);

    // Add timeGeoTable to mainDiv
    mainDiv.appendChild(timeGeoTable);

    // Create Help section
    const helpHeader = document.createElement('h3');
    helpHeader.innerText = 'Help';
    mainDiv.appendChild(helpHeader);

    const helpDiv = document.createElement('div');
    const helpText = [
        { key: 'SPACE BAR:', desc: 'Pause/resume time' },
        { key: 'LEFT/RIGHT ARROW KEYS:', desc: 'Change speed' },
        { key: 'DOWN ARROW KEY:', desc: 'Set to current time' },
        { key: 'UP ARROW KEY:', desc: 'Toggle chase mode on focused object' },
        { key: 'ESC:', desc: 'Release focus on object' },
        { key: 'F2:', desc: 'Hide/show UI panels' },
        { key: 'F4:', desc: 'Hide/show celestial sphere' },
        { key: 'F8:', desc: 'Hide/show extra time info' },
        { key: 'CLICK ON LABELS:', desc: 'Shift focus to object and display info' },
        { key: 'CLICK ON INFO HEADER OR IMAGE:', desc: 'Learn more on Wikipedia' },
        { key: 'LEFT/MID/RIGHT MOUSE + DRAG:', desc: 'Rotate/zoom/translate around focus' },
        { key: 'SCROLL WHEEL:', desc: 'Zoom to focus' }
    ];

    helpText.forEach(({ key, desc }) => {
        helpDiv.innerHTML += `<b>${key}</b> ${desc}<br>`;
    });

    const httpVarsText = document.createElement('p');
    httpVarsText.innerHTML = `<b>HTTP VARIABLES - SET ON LAUNCH:</b><br>
    <b>x: (decimal degrees)</b> Longitude<br>
    <b>y: (decimal degrees)</b> Latitude<br>
    <b>t: (YYYYMMDDHHMM)</b> Date<br>
    <b>n: (integer)</b> Small asteroid limit (max: <span id="smallRoids"></span>)`;
    
    helpDiv.appendChild(httpVarsText);

    const aboutButton = document.createElement('button');
    aboutButton.id = 'openSplash';
    aboutButton.innerText = 'About';
    helpDiv.appendChild(aboutButton);

    mainDiv.appendChild(helpDiv);

    // Append mainDiv to inputBox
    inputBox.appendChild(mainDiv);

    // Append inputBox to body
    document.body.appendChild(inputBox);
});
