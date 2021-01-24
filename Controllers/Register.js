const handleRegister = (db, bcrypt) => (req, res) => {
  const { userName, email, password } = req.body;

  bcrypt
    .hash(password, 10, (error, hash) => {
      db.insert({
        user_name: userName,
        email,
        password: hash,
      })
        .into("users")
        .then(() => {
          res.json("User has beed registred");
          db.commit;
        })
        .catch(() => {
          res.json("Something went wrong");
          db.rollback;
        });
    })
    .catch(() => {
      res.json("Something went wrong");
    });
};

module.exports = {
  handleRegister,
};
