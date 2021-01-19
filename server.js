const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors());

let receivedData = [];

app.get("/get-data", (req, res) => {
  res.json(receivedData);
});

app.post("/data-from-sensor", (req, res) => {
  const { readDate, data } = req.body;

  receivedData.push({
    readDate,
    data,
  });

  console.log(receivedData, "\n");

  res.send("received");
});

app.listen(PORT, () => {
  console.log("Server started on port", PORT);
});
