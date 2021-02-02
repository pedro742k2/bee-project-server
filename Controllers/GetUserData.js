const handleGetUsersData = (db) => (req, res) => {
  const { userName, email } = req.body;

  db("users")
    .select("name", "hive_id")
    .where({ user_name: userName, email: email })
    .then((hiveId) => {
      res.json(hiveId);
    })
    .catch(() => {
      res.status(400).json("Unable to consult the database");
    });
};

module.exports = {
  handleGetUsersData,
};
