const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("connectDB()");
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // const conn = await connectToDatabase();

    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.error("Error", err.message);
    //TODO:Throw Error
  }
};

module.exports = connectDB;
