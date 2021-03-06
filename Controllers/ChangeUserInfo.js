const handleChangeUserInfo = (db) => (req, res) => {
  const { userName, email, field, value } = req.body;

  db("users")
    .where({ user_name: userName, email: email })
    .update(field, value)
    .returning(["user_name", "email", "name", "hives_id"])
    .then((data) => {
      res.json(data[0]);
    })
    .catch(() => {
      res.status(400).json("Error");
    });
};

module.exports = {
  handleChangeUserInfo,
};
