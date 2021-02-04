const handleAddHives = (db) => async (req, res) => {
  const { userName, email, IdApHv, add } = req.body;
  let valid = true;
  let edited = false;

  const hiveId = IdApHv.split("-")[0];
  const apiaryNumber = IdApHv.split("-")[1];
  const hiveNumber = IdApHv.split("-")[2];

  const exists = await db("registered_hives")
    .select("hive_id")
    .where("hive_id", hiveId)
    .then((data) => data)
    .catch(() => false);

  if (add && exists.length === 0) {
    res.json("Hive not registered");
    return false;
  } else if (IdApHv.length < 5 && add === true) {
    res.json("Invalid input");
  } else {
    if (add) {
      db("hives_info")
        .select("hive_id")
        .where("hive_id", hiveId)
        .then((data) => {
          if (data.length === 0) {
            db("hives_info")
              .insert({
                hive_id: hiveId,
                apiary_number: apiaryNumber,
                hive_number: hiveNumber,
              })
              .then(() => {
                edited = true;
                db.commit;
              })
              .catch(db.rollback);
          } else {
            db("hives_info")
              .where("hive_id", hiveId)
              .update({
                apiary_number: apiaryNumber,
                hive_number: hiveNumber,
              })
              .then(() => {
                edited = true;
                db.commit;
              })
              .catch(db.rollback);
          }
        })
        .catch(() => {
          res.status(400).json("Something went wrong");
          valid = false;
          return false;
        });
    } else {
      db("hives_info")
        .select("hive_id")
        .where("hive_id", hiveId)
        .then((data) => {
          if (data.length === 0) {
            res.json("No longer exists");
          } else {
            db("hives_info")
              .where("hive_id", hiveId)
              .del()
              .then(db.commit)
              .catch(db.rollback);
          }
        })
        .catch(() => {
          res.status(400).json("Something went wrong");
          valid = false;
          return false;
        });
    }

    if (valid) {
      db("users")
        .select("hives_id")
        .where({
          user_name: userName,
          email: email,
        })
        .then((data) => {
          data = data[0].hives_id;

          console.log(`db: ${data} | hiveId: ${hiveId}`);

          if (data === null) {
            if (add) {
              const newData = hiveId + ";";
              console.log(newData);

              db("users")
                .where({
                  user_name: userName,
                  email: email,
                })
                .update("hives_id", newData)
                .then(() => {
                  res.json("Successfully updated");
                })
                .catch(() => {
                  res.status(400).json("Something went wrong");
                });
            } else {
              res.json("No longer exists");
            }
          } else if (data.includes(hiveId)) {
            if (add) {
              if (edited) {
                res.json("Edited");
              } else {
                res.json("Already exists");
              }
            } else {
              const newData = data.replace(hiveId + ";", "");
              db("users")
                .where({
                  user_name: userName,
                  email: email,
                })
                .update("hives_id", newData)
                .then(() => {
                  res.json("Successfully removed");
                })
                .catch(() => {
                  res.status(400).json("Something went wrong");
                });
            }
          } else {
            if (add) {
              const newData = data + hiveId + ";";

              db("users")
                .where({
                  user_name: userName,
                  email: email,
                })
                .update("hives_id", newData)
                .then(() => {
                  res.json("Successfully added");
                })
                .catch(() => {
                  res.status(400).json("Something went wrong");
                });
            } else {
              res.status(400).json("Something went wrong 2");
            }
          }
        });
    }
  }
};

module.exports = {
  handleAddHives,
};
