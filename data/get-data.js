const fs = require("fs").promises;
const path = require("path");
const url = require("url");
const https = require("https");
const parse = require("csv-parse");
const HttpsProxyAgent = require("https-proxy-agent");

const csvLocation =
  "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_global.csv";

const proxy = "http://192.168.1.165:7890";
const endpoint = csvLocation;
const options = url.parse(endpoint);
const agent = new HttpsProxyAgent(proxy);
options.agent = agent;

let originData = "";
const dataArray = [];

https.get(options, (res) => {
  res.on("data", (chunk) => {
    originData += chunk;
  });
  res.on("end", () => {
    console.log("fetch done.\nstart parsing...\n");
    parse(originData, {
      relaxColumnCount: true,
    })
      .on("readable", function() {
        let record;
        while ((record = this.read())) {
          dataArray.push(record);
        }
      })
      .on("end", function() {
        const dates = dataArray[0].slice(4);

        const countryData = {};

        for (let data of dataArray.slice(1)) {
          const country = data[1];

          if (countryData[country]) {
            countryData[country] = countryData[country].map(
              (value, i) => value + Number(data[i + 4])
            );
          } else {
            countryData[country] = data.slice(4).map(Number);
          }
        }

        // Change a couple countries so that they fit better
        countryData["UAE"] = countryData["United Arab Emirates"];
        delete countryData["United Arab Emirates"];

        countryData["United States"] = countryData["US"];
        delete countryData["US"];

        fs.writeFile(
          path.resolve(__dirname, "country-cases.json"),
          JSON.stringify({ dates, countryData }),
          (err) => {
            if (err) console.log(err);
          }
        );
        console.log("All done.");
      });
  });
});
