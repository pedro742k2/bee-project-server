const handleChangeUserInfo = (db) => (req, res) => {
  console.log("CHANGE USER INFO");

  const { userName, email, field, value } = req.body;

  db("users")
    .where({ user_name: userName, email: email })
    .update(field, value)
    .returning(["user_name", "email", "name", "hives_id"])
    .then((data) => {
      console.log(data);
      res.json(data[0]);
    })
    .catch(() => {
      res.status(400).json("Error");
    });
};

module.exports = {
  handleChangeUserInfo,
};
