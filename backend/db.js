require("dotenv").config();
const mongoose = require('mongoose');

const connectToMongo = async () =>
{
    await mongoose.connect(process.env.MONGODB_URI);
    // await mongoose.connect(process.env.mongoURI);
    console.log("Connected to Mongo Successfully!");
}

module.exports = connectToMongo;