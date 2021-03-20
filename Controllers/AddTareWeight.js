const handleAddTareWeight = (db) => (req, res) => {
  const { hiveId, tareWeight } = req.body;

  db("hives_info")
    .where("hive_id", hiveId)
    .update(tare_weight, tareWeight)
    .returning(["tare_weight"])
    .then((data) => {
      res.json(data);
    })
    .catch(res.status(400).json("Bad syntax"));
};

module.exports = {
  handleAddTareWeight,
};
