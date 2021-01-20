const express = require("express");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

let receivedData = [];

app.post("/get-data", (req, res) => {
  const ApHv = req.body.ApHv[0];

  const filteredApiaries = receivedData.filter((item) => {
    return ApHv === item.ApHv;
  });

  res.json(filteredApiaries);
});

app.post("/data-from-sensor", (req, res) => {
  const { ApHv, readDate, data } = req.body;

  const apiary = ApHv.split("-")[0];
  const hive = ApHv.split("-")[1];

  const temp = data.split("-")[0];
  const hmdt = data.split("-")[1];
  const weight = data.split("-")[2];
  const battery = data.split("-")[3];
  const readOn = readDate.split("-");
  const readings_date = `${readOn[2]}/${readOn[1]}/${readOn[0]} ${readOn[3]}:${readOn[4]}`;

  db.select("*")
    .from("apiaries")
    .then((data) => {
      console.log(data);
    });

  db.insert({
    apiary,
    hive,
    temperature: temp,
    humidity: hmdt,
    weight,
    battery,
    readings_date,
  })
    .into("apiaries")
    .then((data) => {
      console.log(data);
    });

  res.send("received");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
