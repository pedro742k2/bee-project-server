const handleDataFromSensor = (db) => (req, res) => {
  const { ApHv, readDate, data } = req.body;

  const apiary = ApHv.split("-")[0];
  const hive = ApHv.split("-")[1];

  const readOn = readDate.split("-");
  const readings_date = `${readOn[2]}/${readOn[1]}/${readOn[0]} ${readOn[3]}:${readOn[4]}`;

  const saveDailyData = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    db.select("*")
      .from("apiaries")
      .whereRaw("EXTRACT(DAY FROM readings_date) = ?", [day])
      .andWhereRaw("EXTRACT(MONTH FROM readings_date) = ?", [month])
      .andWhereRaw("EXTRACT(YEAR FROM readings_date) = ?", [year])
      .then((data) => {
        console.log(data);
      });
  };

  db.select("readings_date")
    .from("apiaries")
    .where({
      readings_date: readings_date,
      apiary: apiary,
      hive: hive,
    })
    .then((checkDate) => {
      if (checkDate.length >= 1) {
        res.json({
          stored: false,
          msg: "Database already have data for this date",
        });
      } else {
        const temp = data.split("-")[0];
        const hmdt = data.split("-")[1];
        const weight = data.split("-")[2];
        const battery = data.split("-")[3];

        db("apiaries")
          .insert({
            apiary,
            hive,
            temperature: temp,
            humidity: hmdt,
            weight,
            battery,
            readings_date,
          })
          .into("apiaries")
          .then(db.commit)
          .catch(db.rollback);

        res.json({
          stored: true,
          msg: "Successfully stored on the database",
        });

        saveDailyData();
      }
    })
    .catch(() => {
      res.json({
        stored: false,
        msg: "Unable to consult the database",
      });
    });
};

module.exports = {
  handleDataFromSensor,
};
