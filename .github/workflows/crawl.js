const fs = require("fs");
const path = require("path");
const memberDir = path.join(__dirname, "member");
fs.mkdirSync(memberDir, { recursive: true });
fetch(
  "https://roboninon.win/api/v1/priconne/clan/489663?key=yEmk6fTXsyr4GOjEMwTM15Jt"
)
  .then((response) => response.json())
  .then((data) => {
    const obj = (Array.isArray(data) ? data : data.members || []).reduce(
      (acc, curr) => ({
        ...acc,
        [curr.user_info?.viewer_id]: curr,
      }),
      {}
    );
    console.log(Object.keys(obj));

    Object.keys(obj).forEach((x) => {
      const filePath = path.join(memberDir, `${x}.json`);
      fs.writeFileSync(filePath, JSON.stringify(obj[x], null, 2));
      console.log(`Saved: ${filePath}`);
    });
  });
