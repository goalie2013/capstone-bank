const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  tokens: {
    type: Array,
  },
});

module.exports.RefreshToken = mongoose.model(
  "RefreshToken",
  RefreshTokenSchema
);
