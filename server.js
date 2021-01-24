const express = require("express");
const cors = require("cors");
const knex = require("knex");
const bcrypt = require("bcrypt");

/* Controllers */
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

app.post("/register", Register.handleRegister(db, bcrypt));

app.post("/login", (req, res) => {
  const { user, password } = req.body;

  db.select("user_name", "email", "password", "ap_hv", "name")
    .from("users")
    .where("user_name", user)
    .orWhere("email", user)
    .then((user) => {
      bcrypt.compare(password, user.password).then((result) => {
        if (result) {
          res.json({
            userName: user.user_name,
            email: user.email,
            ApHv: user.ap_hv,
            name: user.name,
          });
        } else {
          res.json("Wrong credentials");
        }
      });
      // res.json(user);
    })
    .catch(() => {
      res.json("Wrong credentials");
    });
});

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
