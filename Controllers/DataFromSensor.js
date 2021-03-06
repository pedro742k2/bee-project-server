const handleDataFromSensor = (db) => (req, res) => {
  const { hiveId, readDate, data } = req.body;

  const readOn = readDate.split("-");

  const readings_date = `${readOn[0]}/${readOn[1]}/${readOn[2]} ${readOn[3]}:${readOn[4]}`;

  db.select("readings_date")
    .from("apiaries")
    .where({
      hive_id: hiveId,
      readings_date,
    })
    .then((checkDate) => {
      if (checkDate.length >= 1)
        return res.json({
          stored: false,
          msg: "Database already has data for this date",
        });

      const splitedData = data.split("-");

      const weight = splitedData[0];
      const internalTemp = splitedData[1];
      const externalTemp = splitedData[2];
      const hmdt = splitedData[3];
      const solarVoltage = splitedData[4];
      const battery = splitedData[5];

      db("apiaries")
        .insert({
          hive_id: hiveId,
          external_temperature: externalTemp,
          internal_temperature: internalTemp,
          humidity: hmdt,
          weight,
          battery,
          solar_panel_voltage: solarVoltage,
          readings_date,
        })
        .returning("hive_id")
        .then((data) => {
          data = data[0];

          db("registered_hives")
            .select("hive_id")
            .where("hive_id", data)
            .then((returnedData) => {
              if (returnedData.length >= 1)
                return res.json({
                  stored: true,
                  msg: "Successfully stored",
                });

              db("registered_hives")
                .insert({
                  hive_id: data,
                  registered_date: readings_date,
                })
                .then(() => {
                  db.commit;
                  res.json({
                    stored: true,
                    msg: "Successfully registered and stored",
                  });
                })
                .catch((error) => {
                  console.log(error);
                  db.rollback;
                  res.status(500).json("Something went wrong");
                });
            })
            .catch((error) => {
              console.log(error);
              db.rollback;
              res.status(500).json("Something went wrong");
            });
        })
        .catch(db.rollback);
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
