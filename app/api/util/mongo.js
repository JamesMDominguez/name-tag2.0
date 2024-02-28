import mongoose from "mongoose";

  
console.log("Mongo connected with helper")

async function database() {
    await mongoose.connect(process.env.MONGODB_URI);
    return mongoose.connection.db;
}


  export default database;