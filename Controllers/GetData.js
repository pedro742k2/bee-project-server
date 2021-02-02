const handleGetData = (db) => (req, res) => {
  const { hiveId, currentDate, measurementType } = req.body;

  const date = currentDate.split("-");
  const day = date[2];
  const month = date[1];
  const year = date[0];

  const firstDataFromHours = [];
  let hour = 0;

  if (measurementType === "daily") {
    db.select("temperature", "humidity", "weight", "battery", "readings_date")
      .from("apiaries")
      .where({
        hive_id: hiveId,
      })
      .whereRaw("EXTRACT(DAY FROM readings_date) = ?", [day])
      .andWhereRaw("EXTRACT(MONTH FROM readings_date) = ?", [month])
      .andWhereRaw("EXTRACT(YEAR FROM readings_date) = ?", [year])
      .orderBy("readings_date")
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
                  }-${validDate.getDate()} ${i}:${validDate.getMinutes()}`
                );

                firstDataFromHours.push({
                  temperature: "0",
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

        db.select(
          "temperature",
          "humidity",
          "weight",
          "battery",
          "readings_date"
        )
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
            res.json("Unable to get any data:");
          });
      })
      .catch(() => {
        res.json(`Unable to get data`);
      });
  } else if (measurementType === "weekly") {
    res.json("not available");
  } else if (measurementType === "monthly") {
    res.json("not available");
  } else {
    res.json("Invalid resource");
  }
};

module.exports = {
  handleGetData,
};
