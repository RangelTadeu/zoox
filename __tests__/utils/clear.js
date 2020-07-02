const mongoose = require("mongoose");

module.exports = async () => {
  await mongoose.connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    function () {
      /* Apagar o DB */
      mongoose.connection.db.dropDatabase();
    }
  );
};
