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
const GetUsersData = require("./Controllers/GetUserData");

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

/* Get readings from the Arduino */
app.post("/data-from-sensor", DataFromSensor.handleDataFromSensor(db));

/* Send Arduino data stored in the database */
app.post("/get-data", GetData.handleGetData(db));

/* Send user data (name and hives) */
app.post("/get-user-data", GetUsersData.handleGetUsersData(db));

/* Check login and send token */
app.post("/login", Login.handleLogin(db, bcrypt));

/* Register user and send token */
app.post("/register", Register.handleRegister(db, bcrypt));

/* Add or remove hives */
app.put("/add-hives", AddHives.handleAddHives(db));

/* Set a name for a specific user */
app.put("/set-name", SetName.handleSetName(db));

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
