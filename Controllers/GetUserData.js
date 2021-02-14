const handleGetUsersData = (db) => (req, res) => {
  const { userName, email } = req.body;

  db.select("hive_id", "apiary_number", "hive_number")
    .from("users")
    .joinRaw(
      "JOIN hives_info ON (users.hives_id like '%' || hives_info.hive_id || '%')"
    )
    .where({ user_name: userName, email: email })
    .then((hivesInfo) => {
      res.json(hivesInfo);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json("Unable to consult the database");
    });
};

module.exports = {
  handleGetUsersData,
};
