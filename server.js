const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");

/* Controllers */
const DataFromSensor = require("./Controllers/DataFromSensor");
const GetData = require("./Controllers/GetData");
const Register = require("./Controllers/Register");
const Login = require("./Controllers/Login");

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

app.post("/register", Register.handleRegister(db, bcrypt));

app.post("/login", Login.handleLogin(db, bcrypt));

app.put("/set-name", (req, res) => {
  const { userName, email, name } = req.body;

  db("users")
    .where({ user_name: name, email: email })
    .update("name", name)
    .then((data) => {
      res.json("Updated successfuly:", data);
    })
    .catch((error) => {
      res.status(400).json("Error:", error);
    });
});

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
