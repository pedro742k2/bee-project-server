const handleSetName = (db) => (req, res) => {
  const { userName, email, name } = req.body;

  db("users")
    .where({ user_name: userName, email: email })
    .update("name", name)
    .then(() => {
      res.json("Updated successfuly");
    })
    .catch(() => {
      res.status(400).json("Error");
    });
};

module.exports = {
  handleSetName,
};
