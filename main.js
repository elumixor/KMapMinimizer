const inputElement = document.getElementById("input");
const parsedInputElement = document.getElementById("parsedInput");
const tableElement = document.getElementById("table");
const mapsContainerElement = document.getElementById("mapsContainer");

const allowedChars = ['1', '0', 'x', 'X'];

let currentSequence = [];

// Input validation
inputElement.oninput = () => {
    currentSequence = inputElement.value.split("")
        .filter(e => allowedChars.includes(e))
        .map(e => e === "X" ? "x" : e);

    inputElement.value = currentSequence.join("");
    evaluate();
};


function evaluate() {
    const power = Math.ceil(Math.log(currentSequence.length) / Math.log(2));
    const length = Math.pow(2, power);
    const expandedInput = [];

    for (let i = 0; i < currentSequence.length; i++) expandedInput.push(currentSequence[i]);
    for (let i = currentSequence.length; i < length; i++) expandedInput.push("x");


    parsedInputElement.textContent = "ParsedInput: " + expandedInput.join(" ");

    console.log(length, power, expandedInput);

    // Clear table
    for (let i = tableElement.rows.length - 1; i >= 0; i--) tableElement.deleteRow(i);

    // Add elements to table
    for (let i = 0; i < length; i++) {
        const row = tableElement.insertRow(i);

        for (let j = 0; j < power; j++) {
            const cell = row.insertCell(j);
            const powerValue = Math.pow(2, power - j);
            cell.textContent = Math.floor((i % powerValue) / Math.pow(2, power - j - 1)).toString(10);
        }

        row.insertCell(power).textContent = expandedInput[i];
    }

    updateTables(expandedInput, Math.pow(2, Math.max(0, power - 4)));
}


function updateTables(expandedInput, chunks) {
    while (mapsContainerElement.firstChild) mapsContainerElement.removeChild(mapsContainerElement.firstChild);


    console.log(expandedInput);

    let groups;
    if (chunks === 0) groups = [expandedInput];
    else {
        groups = [];
        for (let i = 0; i < chunks; i++) groups.push(expandedInput.slice(i * 16, i * 16 + 16))
    }

    for (let i = 0; i < groups.length; i++) {
        const map = document.createElement("table");
        mapsContainerElement.appendChild(map);

        const chunk = groups[i];
        console.log("chunk " + chunk + " length " + chunk.length);
        const mapSize = Math.sqrt(chunk.length);

        console.log(mapSize);

        for (let y = 0; y < mapSize; y++) {
            const row = map.insertRow(y);
            for (let x = 0; x < mapSize; x++) {
                const cell = row.insertCell(x);
                cell.textContent = chunk[((y % 4 === 2 ? 3 : y % 4 === 3 ? 2 : y)) * 4 + (x % 4 === 2 ? 3 : x % 4 === 3 ? 2 : x)];
            }
        }


        for (let i = 0; i < 2; i++) {
            const br = document.createElement("br");
            mapsContainerElement.appendChild(br);
        }
    }

}

