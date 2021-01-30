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

app.put("/set-name", SetName.handleSetName(db));

app.put("/add-hives", (req, res) => {
  const { userName, email, ApHv } = req.body;
  let valid = true;

  const sentApHv = ApHv.split("-");

  if (sentApHv.length === 2) {
    valid = db("users")
      .where({
        user_name: userName,
        email: email,
      })
      .select("ap_hv")
      .then((data) => {
        data = data[0].ap_hv;
        console.log(data);
        if (data.includes(ApHv)) {
          console.log("1");
          return false;
        } else {
          console.log("2");
          data.split(";").forEach((item) => {
            const newItem = item.split("-");
            if (sentApHv[0] === newItem[0] && sentApHv[1] === newItem[1]) {
              return false;
            }
          });
        }

        if (valid) {
          const newApHvString = data + ApHv + ";";
          console.log("3");
          db("users")
            .where({
              user_name: userName,
              email: email,
            })
            .update("ap_hv", newApHvString)
            .then((newApHvData) => {
              console.log("4");
              res.json("Successfuly updated:", newApHvData);
            })
            .catch(() => {
              console.log("5");
              res.status(400).json("Something went wrong");
            });
        } else {
          return false;
        }
      });
  } else {
    console.log("6");
    valid = false;
  }

  console.log("7,", valid);
  if (!valid) {
    console.log("8");
    res.status(400).json("Invalid input");
  }
});

app.listen(PORT, () => {
  console.log("Server listening on port", PORT);
});
