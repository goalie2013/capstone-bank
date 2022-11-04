const mongoose = require("mongoose");

const RefreshTokensSchema = new mongoose.Schema({
  tokens: [Number],
});

module.exports.User = mongoose.model("Refresh Token", RefreshTokensSchema);
