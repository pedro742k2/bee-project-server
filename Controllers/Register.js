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
      .then((userName, userEmail) => {
        const data = [];
        data.push(userName, userEmail);
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
