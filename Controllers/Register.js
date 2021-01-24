const handleRegister = (db, bcrypt) => (req, res) => {
  const { userName, email, password } = req.body;

  bcrypt.hash(password, 10, (error, hash) => {
    db.insert({
      user_name: userName,
      email,
      password: hash,
    })
      .returning(["user_name", "email"])
      .into("users")
      .then((data) => {
        res.json(data);
      })
      .catch(() => {
        res.json("Something went wrong");
      });
  });
};

module.exports = {
  handleRegister,
};
