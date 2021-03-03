const express = require("express");
const cors = require("cors");
const knex = require("knex");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const verify = require("./validation/TokenValidation");

dotenv.config();

/* Controllers */
const Login = require("./Controllers/Authentication/Login");
const Register = require("./Controllers/Authentication/Register");
const DataFromSensor = require("./Controllers/DataFromSensor");
const GetData = require("./Controllers/GetData");
const ChangeUserInfo = require("./Controllers/ChangeUserInfo");
const AddHives = require("./Controllers/AddHives");
const GetUsersData = require("./Controllers/GetUserData");

/* LOCAL DATABASE CONNECTION */
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: process.env.LOCAL_DATABASE_PASSWORD,
    database: "beeproject",
  },
});
const PORT = 5000;

/* HEROKU DATABASE CONNECTION 
const db = knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  },
});
const PORT = process.env.PORT; */

const app = express();

app.use(express.json());
app.use(cors());

/* Get readings from the Arduino */
app.post("/data-from-sensor", DataFromSensor.handleDataFromSensor(db));

/* Send hive data stored in the database */
app.post("/get-data", verify, GetData.handleGetData(db));

/* Send user data (name and hives) */
app.post("/get-user-data", verify, GetUsersData.handleGetUsersData(db));

/* Check login and send token */
app.post("/login", Login.handleLogin(db, bcrypt));

/* Register user and send token */
app.post("/register", Register.handleRegister(db, bcrypt));

/* Add or remove hives */
app.put("/add-hives", verify, AddHives.handleAddHives(db));

/* Set a name for a specific user */
app.put("/change-user-info", verify, ChangeUserInfo.handleChangeUserInfo(db));

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
