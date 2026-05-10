const mongoose = require("mongoose")

async function connectodb()
{
  await mongoose.connect("mongodb://localhost:27017/jobportal")
  console.log("CONNECTED TO DB")


}

module.exports= connectodb;
