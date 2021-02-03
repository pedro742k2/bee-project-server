const handleDataFromSensor = (db) => (req, res) => {
  const { hiveId, readDate, data } = req.body;

  const readOn = readDate.split("-");
  const readings_date = `${readOn[0]}/${readOn[1]}/${readOn[2]} ${readOn[3]}:${readOn[4]}`;

  db.select("readings_date")
    .from("apiaries")
    .where({
      hive_id: hiveId,
      readings_date: readings_date,
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
            hive_id: hiveId,
            temperature: temp,
            humidity: hmdt,
            weight,
            battery,
            readings_date,
          })
          .returning(["hive_id"])
          .then((data) => {
            db.commit;

            db("registered_hives")
              .whereNot("hive_id", data[0])
              .insert({
                hive_id: data[0],
                registered,
              })
              .then(db.commit)
              .catch(db.rollback);
          })
          .catch(() => {
            db.rollback;
          });

        res.json({
          stored: true,
          msg: "Successfully stored",
        });
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
