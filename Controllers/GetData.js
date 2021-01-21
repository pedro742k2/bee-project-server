const handleGetData = (db) => (req, res) => {
  const ApHv = req.body.ApHv[0];
  const ap = ApHv.split("-")[0];
  const hv = ApHv.split("-")[1];
  const { currentDate, measurementType } = req.body;

  const date = currentDate.split("-");
  const day = date[0];
  const month = date[1];
  const year = date[2];

  const firstDataFromHours = [];
  let hour = 0;

  if (measurementType === "daily") {
    db.select("*")
      .from("apiaries")
      .whereRaw("EXTRACT(DAY FROM readings_date) = ?", [day])
      .andWhereRaw("EXTRACT(MONTH FROM readings_date) = ?", [month])
      .andWhereRaw("EXTRACT(YEAR FROM readings_date) = ?", [year])
      .orderBy("readings_date")
      .then((data) => {
        data.forEach((value) => {
          const valueHour = new Date(String(value.readings_date)).getHours();
          if (valueHour === hour && keepChecking) {
            firstDataFromHours.push(value);
            hour++;
          }
        });
        res.json(firstDataFromHours);
      })
      .catch((error) => {
        res.json(
          `Unable to get data from Apiary ${ap} - Hive ${hv}\nError: ${error}`
        );
      });
  } else if (measurementType === "monthly") {
    res.json("Resource not available yet");
  } else {
    res.json("Resource not available yet");
  }
};

module.exports = {
  handleGetData,
};
