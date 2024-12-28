 const express = require("express")
 const dotenv = require("dotenv")
 const cookieParser = require("cookie-parser");
 const authRoutes = require("./routes/auth.route.js")
 const { connectDB } = require("./lib/db.js")
 const messageRoutes = require("./routes/message.route.js")
 dotenv.config()
 const app = express()
 const __dirname = path.resolve();

 const cors = require("cors");
 const PORT = process.env.PORT || 3000
 
 app.use(express.json())
 app.use("/api/auth",authRoutes)
 app.use("api/message",messageRoutes)
 app.use(cookieParser())
 app.use(
   cors({
     origin: "http://localhost:3005",
     credentials: true,
   })
)

if (process.env.NODE_ENV === "production") {
      app.use(express.static(path.join(__dirname, "../frontend/dist")));
    
      app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/chat_app", "dist", "index.html"));
      });
    }
    
 app.listen(PORT,()=>{
    console.log("server is running on port " + PORT)
    connectDB()
 })
 console.log(process.env.MONGODB_URI);  // Add this for debugging
