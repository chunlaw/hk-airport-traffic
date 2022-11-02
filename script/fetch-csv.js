const fs = require("fs");

fetch("https://www.immd.gov.hk/opendata/eng/transport/immigration_clearance/statistics_on_daily_passenger_traffic.csv")
  .then(r => r.text())
  .then(res => {
    fs.writeFileSync("public/data.csv",res)
  })