const mongoose = require("mongoose");

const State = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    abbreviation: {
      type: String,
      required: true
    },
    cities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City"
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("State", State);
