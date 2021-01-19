const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

let receivedData = [
  /* {
    readDate: "19/01/2021 - 10:51 GMT",
    data: ["24", "7", "30", "98"],
  },
  {
    readDate: "19/01/2021 - 10:51 GMT",
    data: ["24", "7", "30", "98"],
  }, */
];

app.get("/data-from-sensor", (req, res) => {
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
