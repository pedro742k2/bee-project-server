const express = require("express");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const app = express();
const PORT = process.env.PORT;
// const PORT = 3000;

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

  db.select("*")
    .from("apiaries")
    .then((data) => {
      console.log(data);
    });

  res.send("received");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
