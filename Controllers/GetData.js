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
    db.select("temperature", "humidity", "weight", "battery", "readings_date")
      .from("apiaries")
      .where({
        apiary: ap,
        hive: hv,
      })
      .whereRaw("EXTRACT(DAY FROM readings_date) = ?", [day])
      .andWhereRaw("EXTRACT(MONTH FROM readings_date) = ?", [month])
      .andWhereRaw("EXTRACT(YEAR FROM readings_date) = ?", [year])
      .orderBy("readings_date")
      .then((data) => {
        data.forEach((value) => {
          let updateHour = true;

          const valueHour = new Date(value.readings_date).getHours();
          // console.log(hour, valueHour, hour === valueHour);
          if (valueHour === hour) {
            firstDataFromHours.push(value);
            hour++;
            updateHour = false;
          } else {
            if (valueHour > hour) {
              const faultyValues = valueHour - hour;
              for (let i = hour; i < faultyHour; i++) {
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

              hour = valueHour;
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
            apiary: ap,
            hive: hv,
          })
          .orderBy("readings_date")
          .then((lastValues) => {
            const target = lastValues[lastValues.length - 1];

            res.json({
              firstDataFromHours,
              lastValues: target,
            });
          })
          .catch((error) => {
            res.json("Unable to get any data:", error);
          });
      })
      .catch((error) => {
        res.json(
          `Unable to get data from Apiary ${ap} - Hive ${hv}\nError: ${error}`
        );
      });
  } else if (measurementType === "weekly") {
    res.json("Resource not available yet");
  } else if (measurementType === "monthly") {
    res.json("Resource not available yet");
  } else {
    res.json("Invalid resource");
  }
};

module.exports = {
  handleGetData,
};
