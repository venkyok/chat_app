const mongoose = require("mongoose")

const connectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected: ${conn.connection.host}`) 

    }
    catch(e){
        console.log("error occured in mongodb",e)


    }
}

module.exports = {connectDB}