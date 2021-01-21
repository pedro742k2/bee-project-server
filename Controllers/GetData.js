const handleGetData = (db) => (req, res) => {
  const ApHv = req.body.ApHv[0];
  const { measurementType } = req.body;
  const ap = ApHv.split("-")[0];
  const hv = ApHv.split("-")[1];

  let firstDateCount = 0;

  db.select("temperature", "humidity", "weight", "battery", "readings_date")
    .from("apiaries")
    .where({
      apiary: ap,
      hive: hv,
    })
    .orderBy("readings_date")
    .then((data) => {
      data.forEach((value) => {
        console.log(value);
      });
      res.json(data);
    })
    .catch(() => {
      res.json(`Unable to get data from Apiary ${ap} - Hive ${hv}`);
    });
};

module.exports = {
  handleGetData,
};
