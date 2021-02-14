const handleDataFromSensor = (db) => (req, res) => {
  console.log("DATA FROM SENSOR");

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

      const temp = data.split("-")[0];
      const hmdt = data.split("-")[1];
      const weight = data.split("-")[2];
      const battery = data.split("-")[3];

      db("apiaries")
        .insert({
          hive_id: hiveId,
          temperature: temp,
          humidity: hmdt,
          weight,
          battery,
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
