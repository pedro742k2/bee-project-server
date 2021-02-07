const handleChangeUserInfo = (db) => (req, res) => {
  const { userName, email, field, value } = req.body;

  db("users")
    .where({ user_name: userName, email: email })
    .update(field, value)
    .then(() => {
      res.json("Updated successfully");
    })
    .catch(() => {
      res.status(400).json("Error");
    });

  /* db("users")
    .where({ user_name: userName, email: email })
    .update("name", name)
    .then(() => {
      res.json("Updated successfully");
    })
    .catch(() => {
      res.status(400).json("Error");
    }); */
};

module.exports = {
  handleChangeUserInfo,
};
