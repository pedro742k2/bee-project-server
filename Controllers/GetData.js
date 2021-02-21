const handleGetData = (db) => (req, res) => {
  const { hiveId, currentDate, measurementType } = req.body;

  const date = currentDate.split("-");
  const day = date[2];
  const month = date[1];
  const year = date[0];

  const firstDataFromHours = [];
  let hour = 0;

  const DATA_TO_EXTRACT =
    ("external_temperature",
    "internal_temperature",
    "humidity",
    "weight",
    "battery",
    "readings_date");

  switch (measurementType) {
    case "hourly":
      db.select(DATA_TO_EXTRACT)
        .orderBy("readings_date")
        .from("apiaries")
        .where({
          hive_id: hiveId,
        })
        .whereRaw("readings_date >= NOW() - INTERVAL '1 HOURS'")
        .then((result) => {
          db("apiaries")
            .select(DATA_TO_EXTRACT)
            .orderBy("readings_date")
            .where({ hive_id: hiveId })
            .then((data) => {
              const target = data[data.length - 1];

              res.json({
                firstDataFromHours: result,
                lastValues: target,
              });
            })
            .catch(() => res.status(500).json("Something went wrong"));
        })
        .catch(() => res.status(500).json("Something went wrong"));
      break;
    case "daily":
      db.select(DATA_TO_EXTRACT)
        .orderBy("readings_date")
        .from("apiaries")
        .where({
          hive_id: hiveId,
        })
        .whereRaw("EXTRACT(DAY FROM readings_date) = ?", [day])
        .andWhereRaw("EXTRACT(MONTH FROM readings_date) = ?", [month])
        .andWhereRaw("EXTRACT(YEAR FROM readings_date) = ?", [year])
        .then((data) => {
          data.forEach((value) => {
            const valueHour = new Date(value.readings_date).getHours();
            if (valueHour === hour) {
              firstDataFromHours.push(value);
              hour++;
            } else {
              if (valueHour > hour) {
                for (let i = hour; i < valueHour; i++) {
                  const validDate = new Date(value.readings_date);
                  const faultyHour = new Date(
                    `${validDate.getFullYear()}-${
                      validDate.getMonth() + 1
                    }-${validDate.getDate()} ${i}:0`
                  );

                  firstDataFromHours.push({
                    external_temperature: "0",
                    internal_temperature: "0",
                    humidity: "0",
                    weight: "0",
                    battery: "0",
                    readings_date: faultyHour,
                  });
                }

                hour = valueHour + 1;
                firstDataFromHours.push(value);
              }
            }
          });

          db.select(DATA_TO_EXTRACT)
            .from("apiaries")
            .where({
              hive_id: hiveId,
            })
            .orderBy("readings_date")
            .then((lastValues) => {
              const target = lastValues[lastValues.length - 1];

              res.json({
                firstDataFromHours,
                lastValues: target,
              });
            })
            .catch(() => {
              res.json("Unable to get any data");
            });
        })
        .catch(() => {
          res.json(`Unable to get data`);
        });
      break;
    case "weekly":
      res.json("not available");
      break;
    case "monthly":
      res.json("not available");
      break;
    default:
      res.json("Invalid resource");
  }
};

module.exports = {
  handleGetData,
};
