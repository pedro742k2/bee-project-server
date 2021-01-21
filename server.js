const express = require("express");
const cors = require("cors");
const knex = require("knex");
const DataFromSensor = require("./Controllers/DataFromSensor");
const GetData = require("./Controllers/GetData");

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

app.post("/get-data", GetData.handleGetData(db));

app.post("/data-from-sensor", DataFromSensor.handleDataFromSensor(db));

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
