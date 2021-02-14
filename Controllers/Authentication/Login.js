const { loginValidation } = require("../../validation/InputSyntax");
const jwt = require("jsonwebtoken");

const handleLogin = (db, bcrypt) => (req, res) => {
  console.log("LOGIN");

  const { error } = loginValidation(req.body);

  if (error) return res.status(400).json(error?.details[0]?.message);

  const { user, password } = req.body;

  db.select("id", "user_name", "email", "password", "name", "hives_id")
    .from("users")
    .where("user_name", user)
    .orWhere("email", user)
    .then((user) => {
      if (user)
        return bcrypt.compare(password, user[0].password).then((result) => {
          if (!result) return res.json("Wrong credentials");

          const token = jwt.sign({ id: user[0].id }, process.env.TOKEN_SECRET);

          res.json({
            token,
            userName: user[0].user_name,
            email: user[0].email,
            hivesId: user[0].hives_id,
            name: user[0].name,
          });
        });

      res.status(401).json("Wrong credentials");
    })
    .catch(() => {
      res.status(500).json("Something went wrong");
    });
};

module.exports = {
  handleLogin,
};
