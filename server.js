const express = require("express");
const cors = require("cors");
const knex = require("knex");
const DataFromSensor = require("./Controllers/DataFromSensor");

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

app.post("/get-data", (req, res) => {
  const ApHv = req.body.ApHv[0];
  const ap = ApHv.split("-")[0];
  const hv = ApHv.split("-")[1];

  db.select("temperature", "humidity", "weight", "battery", "readings_date")
    .from("apiaries")
    .where({
      apiary: ap,
      hive: hv,
    })
    .orderBy("readings_date")
    .then((data) => {
      res.json(data);
    })
    .catch(() => {
      res.json(`Unable to get data from Apiary ${ap} - Hive ${hv}`);
    });
});

app.post("/data-from-sensor", DataFromSensor.handleDataFromSensor(db));

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
