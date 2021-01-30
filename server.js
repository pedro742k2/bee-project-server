const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");

/* Controllers */
const DataFromSensor = require("./Controllers/DataFromSensor");
const GetData = require("./Controllers/GetData");
const Register = require("./Controllers/Register");
const Login = require("./Controllers/Login");
const SetName = require("./Controllers/SetName");
const AddHives = require("./Controllers/AddHives");

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

app.post("/get-user-data", (req, res) => {
  const { userName, email } = req.body;

  db.select("name", "ap_hv")
    .where({ user_name: userName, email: email })
    .then((ApHv) => {
      res.json(ApHv);
    })
    .catch(() => {
      res.status(400).json("Unable to consult the database");
    });
});

app.post("/get-data", GetData.handleGetData(db));

app.post("/data-from-sensor", DataFromSensor.handleDataFromSensor(db));

app.post("/register", Register.handleRegister(db, bcrypt));

app.post("/login", Login.handleLogin(db, bcrypt));

app.put("/set-name", SetName.handleSetName(db));

app.put("/add-hives", AddHives.handleAddHives(db));

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
