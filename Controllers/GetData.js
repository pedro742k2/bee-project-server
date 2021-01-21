const handleGetData = (db) => (req, res) => {
  const ApHv = req.body.ApHv[0];
  const ap = ApHv.split("-")[0];
  const hv = ApHv.split("-")[1];

  db.select("temperature", "humidity", "weight", "battery", "readings_date")
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
    });
};

module.exports = {
  handleGetData,
};
