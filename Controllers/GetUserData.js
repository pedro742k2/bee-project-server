const handleGetUsersData = (db) => (req, res) => {
  const { userName, email, id, getHivesId } = req.body;

  db("users")
    .select("hives_id")
    .where({ user_name: userName, email: email })
    .then((hivesId) => {
      if (getHivesId) {
        res.json(hivesId);
      } else {
        hivesId = hivesId[0].hives_id;
        if (hivesId.includes(id)) {
          db("hives_info")
            .select("hive_id", "apiary_number", "hive_number")
            .orderBy("hive_number")
            .where("hive_id", id)
            .then((data) => {
              res.json(data);
            })
            .catch(() => {
              res.status(400).json("error");
            });
        }
      }
    })
    .catch(() => {
      res.status(400).json("Unable to consult the database");
    });
};

module.exports = {
  handleGetUsersData,
};
