const mongoose = require("mongoose");

const City = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    state: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "State"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("City", City);
