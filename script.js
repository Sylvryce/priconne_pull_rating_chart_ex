const sheetURL = "https://docs.google.com/spreadsheets/d/1kJ8YMyx5kWiw1b8UXPg6tlTK3tosESa6t43NgWWdHaM/gviz/tq?tqx=out:json&sheet=unit_rating";

// Customizable parameters
const iconSize = 64;             // width & height in px
const columnPadding = 5;         // left + right padding
const numColumns = 23;           // units columns
const headerWidth = 120;         // width of left header
const numTiers = 7;              // number of vertical categories
const rowsPerTier = 3;           // stacked images
const tierColors = ["#f0f0f0", "#e0e0e0", "#d0d0d0", "#c0c0c0", "#b0b0b0", "#a0a0a0", "#909090"];
const verticalThresholds = [0, 20, 40, 60, 80, 100, 120, Infinity]; // customize thresholds per tier
const chartContainer = document.getElementById("chart");

// Set up chart container
chartContainer.style.position = "relative";
chartContainer.style.border = "1px solid black";
chartContainer.style.display = "inline-block";

// Calculate total width & height
const totalWidth = headerWidth + numColumns * (iconSize + 2*columnPadding);
const totalHeight = numTiers * rowsPerTier * iconSize;
chartContainer.style.width = totalWidth + "px";
chartContainer.style.height = totalHeight + "px";

// Add background tiers
for(let t=0; t<numTiers; t++){
    const tierDiv = document.createElement("div");
    tierDiv.style.position = "absolute";
    tierDiv.style.left = "0px";
    tierDiv.style.width = "100%";
    tierDiv.style.height = (rowsPerTier * iconSize) + "px";
    tierDiv.style.bottom = (t * rowsPerTier * iconSize) + "px";
    tierDiv.style.backgroundColor = tierColors[t % tierColors.length];
    chartContainer.appendChild(tierDiv);
}

// Function to map value to tier index
function getTier(value){
    for(let i=0; i<verticalThresholds.length-1; i++){
        if(value >= verticalThresholds[i] && value < verticalThresholds[i+1]) return i;
    }
    return numTiers-1; // fallback
}

// Fetch and plot sheet data
async function loadSheet() {
    const response = await fetch(sheetURL);
    const text = await response.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    if(!match) return console.error("Failed to parse sheet JSON");
    const data = JSON.parse(match[1]);
    const rows = data.table.rows;

    rows.forEach(row => {
        if(!row.c) return;
        const name = row.c[1] ? row.c[1].v : null;
        const id = row.c[22] ? row.c[22].v : null;
        const value = row.c[23] ? row.c[23].v : null;
        const column = row.c[24] ? row.c[24].v : null;

        if(!name || !id || !value || !column) return;

        const tier = getTier(value);

        // Create image element
        const img = document.createElement("img");
        img.src = `https://wthee.xyz/redive/jp/resource/icon/unit/${id}.webp`;
        img.width = iconSize;
        img.height = iconSize;
        img.style.position = "absolute";
        img.title = name; // hover tooltip

        // Horizontal position
        const x = headerWidth + (column - 1) * (iconSize + 2*columnPadding) + columnPadding;
        img.style.left = x + "px";

        // Vertical position (stack from bottom)
        // Currently stacking randomly in the tier
        const y = tier * rowsPerTier * iconSize;
        img.style.bottom = y + "px";

        chartContainer.appendChild(img);
    });
}

loadSheet();
