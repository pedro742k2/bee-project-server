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

        res.json({
          token,
          userName: user_name,
          email,
        });
      })
      .catch((error) => {
        if (
          String(error).includes(
            "duplicate key value violates unique constraint"
          )
        )
          return res.status(401).json("This account already exists");

        res.status(500).json("Something went wrong");
      });
  });
};

module.exports = {
  handleRegister,
};
