const sheetURL = "https://docs.google.com/spreadsheets/d/1kJ8YMyx5kWiw1b8UXPg6tlTK3tosESa6t43NgWWdHaM/gviz/tq?tqx=out:json&sheet=unit_rating";

// Function to fetch and parse the sheet data
async function loadSheet() {
  const response = await fetch(sheetURL);
  const text = await response.text();

  // The gviz endpoint wraps JSON in a function call, so we need to extract the JSON
  const jsonText = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/)[1];
  const data = JSON.parse(jsonText);

  // Show all rows in console
  const rows = data.table.rows;
  rows.forEach((row, index) => {
    console.log(`Row ${index+1}:`, row.c.map(cell => cell ? cell.v : null));
  });
}

loadSheet();
