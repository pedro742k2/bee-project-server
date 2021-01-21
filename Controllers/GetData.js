const handleGetData = (db) => (req, res) => {
  const ApHv = req.body.ApHv[0];
  const ap = ApHv.split("-")[0];
  const hv = ApHv.split("-")[1];
  const { currentDate, measurementType } = req.body;

  const date = currentDate.split("-");
  const day = Number(date[0]);
  const month = Number(date[1]);
  const year = Number(date[1]);

  console.log(day, month, year);
  if (measurementType === "daily") {
    db.select("*")
      .from("apiaries")
      .whereRaw("EXTRACT(DAY FROM readings_date) = ?", [day])
      .andWhereRaw("EXTRACT(MONTH FROM readings_date) = ?", [month])
      .andWhereRaw("EXTRACT(YEAR FROM readings_date) = ?", [year])
      .then((data) => {
        res.json(data);
      });
  } else if (measurementType === "monthly") {
    res.json("Resource not available yet");
  } else {
    res.json("Resource not available yet");
  }

  /* db.select("temperature", "humidity", "weight", "battery", "readings_date")
    .from("apiaries")
    .where({
      apiary: ap,
      hive: hv,
    })
    .orderBy("readings_date")
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      res.json(
        `Unable to get data from Apiary ${ap} - Hive ${hv}\nError: ${error}`
      );
    }); */
};

module.exports = {
  handleGetData,
};
