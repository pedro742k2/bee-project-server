/* const handleAddHives = (db) => (req, res) => {
  const { userName, email, ApHv, hiveId, add } = req.body;
  let valid = true;

  db("hives_info")
    .select("hive_id")
    .then((data) => {
      if (data.length === 0) {
        db("hives_info")
          .insert({
            hive_id: hiveId,
            apiary_number: ApHv.split("-")[0],
            hive_number: ApHv.split("-")[1],
          })
          .then(db.commit)
          .catch(db.rollback);
      } else {
        db("hives_info")
          .where("hive_id", hiveId)
          .update({
            apiary_number: ApHv.split("-")[0],
            hive_number: ApHv.split("-")[1],
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

  if (ApHv === "-" || ApHv.length < 3) {
    res.json("Invalid input");
  } else if (valid) {
    const sentApHv = ApHv.split("-");

    if (sentApHv.length === 2) {
      db("users")
        .where({
          user_name: userName,
          email: email,
        })
        .select("ap_hv")
        .then((data) => {
          let empty = false;

          const ApHvFromServer = data[0].ap_hv;

          if (data.length >= 1) {
            try {
              if (add) {
                if (ApHvFromServer.includes(ApHv)) {
                  res.status(400).json("Already exists");
                  return false;
                }
              } else {
                if (!ApHvFromServer.includes(ApHv)) {
                  res.status(400).json("This hive no longer exists");
                  return false;
                }
              }
            } catch {
              if (ApHvFromServer === null) {
                empty = true;
                if (!add) {
                  res.status(400).json("This hive no longer exists");
                  return false;
                }
              }
              // Continues, there are no hives
            }

            let newApHvString = undefined;

            if (empty && !add) {
              res.status(400).json("This hive no longer exists");
              return false;
            } else if (empty && add) {
              newApHvString = ApHv + ";";
            } else {
              newApHvString = add
                ? ApHvFromServer + ApHv + ";"
                : ApHvFromServer.replace(ApHv + ";", "");
              // newApHvString = ApHvFromServer + ApHv + ";";
            }

            db("users")
              .where({
                user_name: userName,
                email: email,
              })
              .update("ap_hv", newApHvString)
              .then(() => {
                res.json("Successfuly updated");
              })
              .catch(() => {
                res.status(400).json("Something went wrong");
                return false;
              });
          }
        });
    } else {
      res.status(400).json("Invalid input");
    }
  }
}; */

const handleAddHives = (db) => (req, res) => {
  const { userName, email, IdApHv, add } = req.body;
  let valid = true;

  const hiveId = IdApHv.split("-")[0];
  const apiaryNumber = IdApHv.split("-")[1];
  const hiveNumber = IdApHv.split("-")[2];

  if (IdApHv.length < 5) {
    res.json("Invalid input");
  } else {
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

    if (valid) {
      db("users")
        .select("hives_id")
        .where({
          user_name: userName,
          email: email,
        })
        .then((data) => {
          console.log(data);
          data = data[0].hives_id;
          console.log(data);

          if (data === null) {
            const newData = hiveId + ";";
            console.log(newData);

            db("users")
              .where({
                user_name: userName,
                email: email,
              })
              .insert("hives_id", newData)
              .then(() => {
                res.json("Successfuly updated");
              })
              .catch((error) => {
                console.log(error);
                res.status(400).json("Something went wrong");
              });
          } else if (data.includes(hiveId)) {
            res.json("This hive id already exists in your account");
          } else {
            const newData = data + hiveId + ";";

            db("users")
              .where({
                user_name: userName,
                email: email,
              })
              .insert("hives_id", newData)
              .then(() => {
                res.json("Successfuly updated");
              })
              .catch((error) => {
                console.log(error);
                res.status(400).json("Something went wrong");
              });
          }
        });
    }
  }

  /* if (ApHv === "-" || ApHv.length < 3) {
    res.json("Invalid input");
  } else if (valid) {
    const sentApHv = ApHv.split("-");

    if (sentApHv.length === 2) {
      db("users")
        .where({
          user_name: userName,
          email: email,
        })
        .select("ap_hv")
        .then((data) => {
          let empty = false;

          const ApHvFromServer = data[0].ap_hv;

          if (data.length >= 1) {
            try {
              if (add) {
                if (ApHvFromServer.includes(ApHv)) {
                  res.status(400).json("Already exists");
                  return false;
                }
              } else {
                if (!ApHvFromServer.includes(ApHv)) {
                  res.status(400).json("This hive no longer exists");
                  return false;
                }
              }
            } catch {
              if (ApHvFromServer === null) {
                empty = true;
                if (!add) {
                  res.status(400).json("This hive no longer exists");
                  return false;
                }
              }
              // Continues, there are no hives
            }

            let newApHvString = undefined;

            if (empty && !add) {
              res.status(400).json("This hive no longer exists");
              return false;
            } else if (empty && add) {
              newApHvString = ApHv + ";";
            } else {
              newApHvString = add
                ? ApHvFromServer + ApHv + ";"
                : ApHvFromServer.replace(ApHv + ";", "");
              // newApHvString = ApHvFromServer + ApHv + ";";
            }

            db("users")
              .where({
                user_name: userName,
                email: email,
              })
              .update("ap_hv", newApHvString)
              .then(() => {
                res.json("Successfuly updated");
              })
              .catch(() => {
                res.status(400).json("Something went wrong");
                return false;
              });
          }
        });
    } else {
      res.status(400).json("Invalid input");
    } 
  } */
};

module.exports = {
  handleAddHives,
};
