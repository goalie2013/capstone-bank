const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema(Number);

module.exports.RefreshToken = mongoose.model(
  "RefreshToken",
  RefreshTokenSchema
);
