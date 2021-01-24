const handleRegister = (db, bcrypt) => (req, res) => {
  const { userName, email, password } = req.body;

  bcrypt.hash(password, 10, (error, hash) => {
    db.insert({
      user_name: userName,
      email,
      password: hash,
    })
      .into("users")
      .returning("user_name", "email")
      .then((user_name, user_email) => {
        const data = [user_name, user_email];
        res.json(data);
        db.commit;
      })
      .catch(() => {
        res.json("Something went wrong");
        db.rollback;
      });
  });
};

module.exports = {
  handleRegister,
};
