const handleAddHives = (db) => (req, res) => {
  const { userName, email, ApHv } = req.body;

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
            if (ApHvFromServer.includes(ApHv)) {
              res.status(400).json("already exists");
              return false;
            }
          } catch {
            if (ApHvFromServer === null) {
              empty = true;
            }
            // Continues, there are no hives
          }

          let newApHvString = undefined;

          if (empty) {
            newApHvString = ApHv + ";";
          } else {
            newApHvString = ApHvFromServer + ApHv + ";";
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
};

module.exports = {
  handleAddHives,
};
