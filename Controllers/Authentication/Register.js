const { registerValidation } = require("../../validation/InputSyntax");
const jwt = require("jsonwebtoken");

const handleRegister = (db, bcrypt) => (req, res) => {
  const { error } = registerValidation(req.body);

  if (error) return res.status(400).json(error?.details[0]?.message);

  const { userName, email, password } = req.body;

  bcrypt.hash(password, 10, (error, hash) => {
    if (error) return res.status(500).json("Something went wrong");

    db.insert({
      user_name: userName,
      email,
      password: hash,
    })
      .returning(["id", "user_name", "email"])
      .into("users")
      .then((data) => {
        const { id, user_name, email } = data[0];

        const token = jwt.sign({ id: id }, process.env.TOKEN_SECRET);

        res.header("auth-token", token).json({
          user_name,
          email,
        });
      })
      .catch(() => {
        res.json("Something went wrong");
      });
  });
};

module.exports = {
  handleRegister,
};
