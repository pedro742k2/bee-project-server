const handleAddHives = (db) => (req, res) => {
  const { userName, email, ApHv } = req.body;

  const sentApHv = ApHv.split("-");

  console.log(userName, email, ApHv);

  if (sentApHv.length === 2) {
    db("users")
      .where({
        user_name: userName,
        email: email,
      })
      .select("ap_hv")
      .then((data) => {
        data = data[0].ap_hv;
        try {
          if (data.includes(ApHv)) {
            res.status(400).json("already exists");
            return false;
          }
        } catch {
          res.status(400).json("Something went wrong 1");
          return false;
        }

        const newApHvString = data + ApHv + ";";

        db("users")
          .where({
            user_name: userName,
            email: email,
          })
          .update("ap_hv", newApHvString)
          .then(() => {
            res.json("Successfuly updated");
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json("Something went wrong 2");
            return false;
          });
      });
  } else {
    res.status(400).json("Invalid input");
  }
};

module.exports = {
  handleAddHives,
};
