const handleLogin = (db, bcrypt) => (req, res) => {
  const { user, password } = req.body;

  db.select("user_name", "email", "password", "name", "hives_id")
    .from("users")
    .where("user_name", user)
    .orWhere("email", user)
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user[0].password).then((result) => {
          if (result) {
            res.json({
              userName: user[0].user_name,
              email: user[0].email,
              ApHv: user[0].ap_hv,
              name: user[0].name,
            });
          } else {
            res.json("Wrong credentials");
          }
        });
      } else {
        res.json("Wrong credentials");
      }
    })
    .catch(() => {
      res.json("Wrong credentials");
    });
};

module.exports = {
  handleLogin,
};
