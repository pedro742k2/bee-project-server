const handleGetUsersData = (db) => (req, res) => {
  const { userName, email, id, getHivesId } = req.body;

  db.select("hive_id", "apiary_number", "hive_number")
    .from("users")
    .joinRaw(
      "JOIN hives_info ON (users.hives_id like '%' || hives_info.hive_id || '%')"
    )
    // .where({ user_name: userName, email: email, hives_id: id })
    .where({ user_name: userName, email: email })
    /* .join("hives_info", function () {
      this.on("hives_id", "like", "% || hive_id || %");
    }) */
    .then((hivesId) => {
      res.json(hivesId);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json("Unable to consult the database");
    });

  // db("users")
  //   .select("hives_id")
  //   .where({ user_name: userName, email: email })
  //   .then((hivesId) => {
  //     if (getHivesId) {
  //       res.json(hivesId);
  //     } else {
  //       hivesId = hivesId[0].hives_id;
  //       if (hivesId.includes(id)) {
  //         db("hives_info")
  //           .select("hive_id", "apiary_number", "hive_number")
  //           .orderBy("hive_number")
  //           .where("hive_id", id)
  //           .then((data) => {
  //             res.json(data);
  //           })
  //           .catch(() => {
  //             res.status(400).json("error");
  //           });
  //       }
  //     }
  //   })
  //   .catch(() => {
  //     res.status(400).json("Unable to consult the database");
  //   });
};

module.exports = {
  handleGetUsersData,
};
