const handleGetData = (db) => (req, res) => {
  const { hiveId, currentDate, measurementType, clientDate } = req.body;

  const date = currentDate.split("-");
  const day = date[2];
  const month = date[1];
  const year = date[0];

  const firstDataFromHours = [];
  let hour = 0;

  switch (measurementType) {
    case "hourly":
      db.select(
        "external_temperature",
        "internal_temperature",
        "humidity",
        "weight",
        "battery",
        "solar_panel_voltage",
        "readings_date"
      )
        .from("apiaries")
        .where({
          hive_id: hiveId,
        })
        // .whereRaw("readings_date >= NOW() - INTERVAL '1 HOURS'")
        .andWhere(function () {
          this.where("readings_date", ">=", clientDate);
        })
        .orderBy("readings_date")
        .then((result) => {
          db("apiaries")
            .select(
              "external_temperature",
              "internal_temperature",
              "humidity",
              "weight",
              "battery",
              "solar_panel_voltage",
              "readings_date"
            )
            .orderBy("readings_date")
            .where({ hive_id: hiveId })
            .then((data) => {
              const target = data[data.length - 1];

              db("hives_info")
                .select("tare_weight")
                .where("hive_id", hiveId)
                .then((tare_weight) => {
                  res.json({
                    data: result,
                    lastValues: target,
                    tareWeight: tare_weight,
                  });
                })
                .catch(() => res.status(500).json("Unable to get any data"));
            })
            .catch(() => res.status(500).json("Something went wrong"));
        })
        .catch(() => res.status(500).json("Something went wrong"));
      break;
    case "daily":
      db.select(
        "external_temperature",
        "internal_temperature",
        "humidity",
        "weight",
        "battery",
        "solar_panel_voltage",
        "readings_date"
      )
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
                    solar_panel_voltage: "0",
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
            "external_temperature",
            "internal_temperature",
            "humidity",
            "weight",
            "battery",
            "solar_panel_voltage",
            "readings_date"
          )
            .from("apiaries")
            .where({ hive_id: hiveId })
            .orderBy("readings_date")
            .then((lastValues) => {
              const target = lastValues[lastValues.length - 1];

              db("hives_info")
                .select("tare_weight")
                .where("hive_id", hiveId)
                .then((tare_weight) => {
                  res
                    .json({
                      data: firstDataFromHours,
                      lastValues: target,
                      tareWeight: tare_weight,
                    })
                    .catch(() =>
                      res.status(500).json("Unable to get any data")
                    );
                });
            })
            .catch(() => res.json("Unable to get any data"));
        })
        .catch(() => res.status(500).json("Something went wrong"));
      break;
    case "weekly":
      db("apiaries")
        .select(
          "external_temperature",
          "internal_temperature",
          "humidity",
          "weight",
          "battery",
          "solar_panel_voltage",
          "readings_date"
        )
        .where({ hive_id: hiveId })
        .whereRaw("readings_date >= NOW() - INTERVAL '7 DAYS'")
        .andWhereRaw("readings_date <= NOW()")
        .andWhereRaw("EXTRACT(HOUR FROM readings_date) >= 0")
        .andWhereRaw("EXTRACT(HOUR FROM readings_date) <= 8")
        .orderBy("readings_date")
        .then((result) => {
          try {
            let lastItem = result[0];
            const valuesToSend = [];

            result.forEach((item) => {
              const lastItemTime = new Date(lastItem.readings_date).getDate();
              const actualItemTime = new Date(item.readings_date).getDate();

              if (
                lastItemTime < actualItemTime ||
                lastItemTime - actualItemTime >= 2
              ) {
                valuesToSend.push(lastItem);
              }

              lastItem = item;
            });

            valuesToSend.push(result[result.length - 1]);

            db.select(
              "external_temperature",
              "internal_temperature",
              "humidity",
              "weight",
              "battery",
              "solar_panel_voltage",
              "readings_date"
            )
              .from("apiaries")
              .where({ hive_id: hiveId })
              .orderBy("readings_date")
              .then((lastValues) => {
                const target = lastValues[lastValues.length - 1];

                db("hives_info")
                  .select("tare_weight")
                  .where("hive_id", hiveId)
                  .then((tare_weight) => {
                    res
                      .json({
                        data: valuesToSend,
                        lastValues: target,
                        tareWeight: tare_weight,
                      })
                      .catch(() =>
                        res.status(500).json("Unable to get any data")
                      );
                  });
              })
              .catch(() => {
                res.json("Unable to get any data");
              });
          } catch {
            res.status(500).json("Something went wrong");
          }
        })
        .catch(() => res.status(500).json("Something went wrong"));

      break;
    case "monthly":
      db("apiaries")
        .select(
          "external_temperature",
          "internal_temperature",
          "humidity",
          "weight",
          "battery",
          "solar_panel_voltage",
          "readings_date"
        )
        .where({ hive_id: hiveId })
        .whereRaw("readings_date >= NOW() - INTERVAL '31 DAYS'")
        .andWhereRaw("readings_date <= NOW()")
        .andWhereRaw("EXTRACT(HOUR FROM readings_date) >= 0")
        .andWhereRaw("EXTRACT(HOUR FROM readings_date) <= 8")
        .orderBy("readings_date")
        .then((result) => {
          try {
            let lastItem = result[0];
            const valuesToSend = [];

            result.forEach((item) => {
              const lastItemTime = new Date(lastItem.readings_date).getDate();
              const actualItemTime = new Date(item.readings_date).getDate();

              if (
                lastItemTime < actualItemTime ||
                lastItemTime - actualItemTime >= 2
              ) {
                valuesToSend.push(lastItem);
              }

              lastItem = item;
            });

            valuesToSend.push(result[result.length - 1]);

            db.select(
              "external_temperature",
              "internal_temperature",
              "humidity",
              "weight",
              "battery",
              "solar_panel_voltage",
              "readings_date"
            )
              .from("apiaries")
              .where({ hive_id: hiveId })
              .orderBy("readings_date")
              .then((lastValues) => {
                const target = lastValues[lastValues.length - 1];

                db("hives_info")
                  .select("tare_weight")
                  .where("hive_id", hiveId)
                  .then((tare_weight) => {
                    res
                      .json({
                        data: valuesToSend,
                        lastValues: target,
                        tareWeight: tare_weight,
                      })
                      .catch(() =>
                        res.status(500).json("Unable to get any data")
                      );
                  });
              })
              .catch(() => {
                res.json("Unable to get any data");
              });
          } catch {
            res.status(500).json("Something went wrong");
          }
        })
        .catch(() => res.status(500).json("Something went wrong"));
      break;
    default:
      res.json("Invalid resource");
  }
};

module.exports = {
  handleGetData,
};
