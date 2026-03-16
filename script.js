const sheetURL = "https://docs.google.com/spreadsheets/d/1kJ8YMyx5kWiw1b8UXPg6tlTK3tosESa6t43NgWWdHaM/gviz/tq?tqx=out:json&sheet=unit_rating";

async function loadSheet() {
  try {
    const response = await fetch(sheetURL);
    const text = await response.text();

    // Check the raw response
    console.log("Raw sheet text:", text.slice(0, 200) + "...");

    const match = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/);
    if (!match) {
      console.error("Failed to parse JSON from sheet.");
      return;
    }

    const jsonText = match[1];
    const data = JSON.parse(jsonText);

    const rows = data.table.rows;
    rows.forEach((row, index) => {
      console.log(`Row ${index+1}:`, row.c.map(cell => cell ? cell.v : null));
    });

  } catch (err) {
    console.error("Error fetching sheet:", err);
  }
}

loadSheet();
