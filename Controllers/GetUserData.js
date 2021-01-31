const handleGetUsersData = (db) => (req, res) => {
  const { userName, email } = req.body;

  db("users")
    .select("name", "ap_hv")
    .where({ user_name: userName, email: email })
    .then((ApHv) => {
      res.json(ApHv);
    })
    .catch(() => {
      res.status(400).json("Unable to consult the database");
    });
};

module.exports = {
  handleGetUsersData,
};
