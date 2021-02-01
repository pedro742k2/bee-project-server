const handleAddHives = (db) => (req, res) => {
  const { userName, email, ApHv, add } = req.body;

  console.log(ApHv.length);

  if (ApHv === "-" || ApHv.length < 3) {
    res.json("Invalid input");
  } else {
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
};

module.exports = {
  handleAddHives,
};
