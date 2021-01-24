const express = require("express");
const cors = require("cors");
const knex = require("knex");
const DataFromSensor = require("./Controllers/DataFromSensor");
const GetData = require("./Controllers/GetData");
const Register = require("./Controllers/Register");

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

app.delete("/delete-data", (req, res) => {
  db("apiaries").truncate().then(db.commit);

  res.json("Deleted");
});

app.post("/get-data", GetData.handleGetData(db));

app.post("/data-from-sensor", DataFromSensor.handleDataFromSensor(db));

// app.post("/register", Register.handleRegister(db));
app.post("/register", (req, res) => {
  const { userName, email, password } = req.body;

  db.insert({
    user_name: userName,
    email,
    password,
  })
    .into("users")
    .then(() => {
      res.json("User has beed registred");
      db.commit;
    })
    .catch(() => {
      res.json("Something went wrong");
      db.rollback;
    });
});

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
