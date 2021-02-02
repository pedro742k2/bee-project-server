const handleAddHives = (db) => (req, res) => {
  const { userName, email, IdApHv, add } = req.body;
  let valid = true;

  const hiveId = IdApHv.split("-")[0];
  const apiaryNumber = IdApHv.split("-")[1];
  const hiveNumber = IdApHv.split("-")[2];

  if (IdApHv.length < 5) {
    res.json("Invalid input");
  } else {
    /* Adding apiary and hive number to hive id if add = true */
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
              .then(db.commit)
              .catch(db.rollback);
          } else {
            db("hives_info")
              .where("hive_id", hiveId)
              .update({
                apiary_number: apiaryNumber,
                hive_number: hiveNumber,
              })
              .then(db.commit)
              .catch(db.rollback);
          }
        })
        .catch(() => {
          res.status(400).json("Something went wrong");
          valid = false;
          return false;
        });
    } else {
      /* Removing all hive_id (including) info if add = false */
      db("hives_info")
        .select("hive_id")
        .where("hive_id", hiveId)
        .then((data) => {
          if (data.length === 0) {
            res.json("Unable to remove, that hive doesn't exist anymore");
          } else {
            db("hives_info").where("hive_id", hiveId).del();
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
                  res.json("Successfuly updated");
                })
                .catch((error) => {
                  console.log(error);
                  res.status(400).json("Something went wrong");
                });
            } else {
              res.json("Unable to remove, that hive doesn't exist anymore");
            }
          } else if (data.includes(hiveId)) {
            if (add) {
              res.json("This hive id already exists in your account");
            } else {
              const newData = data.replace(hiveId + ";", "");
              db("users")
                .where({
                  user_name: userName,
                  email: email,
                })
                .update("hives_id", newData)
                .then(() => {
                  res.json("Successfuly removed");
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
                  res.json("Successfuly added");
                })
                .catch(() => {
                  res.status(400).json("Something went wrong");
                });
            } else {
              res.status(400).json("Something went wrong");
            }
          }
        });
    }
  }
};

module.exports = {
  handleAddHives,
};
