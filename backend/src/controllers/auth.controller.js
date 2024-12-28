
const {generateToken} = require("../lib/utils.js")
const User = require("../models/user.model.js")
const cloudinary =require("../lib/cloudinary.js");
const bcrypt = require("bcryptjs")


const signup = async(req,res) =>{
    const {fullName,email,password} = req.body

    try{
        if(!fullName || !email || !password){
            return res.status(400).json({message:"All fields are required "})
        }
         if(password.length<6){
            return res.status(400).json({ message:"password must be at least 6 character "})

         }
         const user = await User.findOne({email})
         if (user) return res.status(400).json({message:"user already present "}) 
         
         const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(password,salt) 
         
         const newUser = new User({
          fullName,
          email,
          password:hashedPassword 
         })
        
         if(newUser){
           generateToken(newUser._id,res)
           await newUser.save()

           res.status(201).json({
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
           })
        
        }

         else{
            res.status(400).json({message:"invalid user data"})
         }
        }


    catch(e){
      console.log("Error in signup controller ",e.message)
       
      res.status(500).json({message:"internal Server Error"})

    }

}

const login =async(req,res) =>{
    const {email,password} = req.body
    
    try{
        const user = await User.findOne({email})
        if (!user){
         return  res.status(400).json({message:"invalid email/password"})

        }

        const isPasswordCorrect = await bcrypt.compare(password,user.password)

        if(!isPasswordCorrect){
          return  res.status(400).json({message:"invalid email/password"})

        }
        generateToken(user._id,res)
 
        res.status(200).json({
          _id:user._id,
          fullName:user.fullName,
          email:user.email,
          profilePic:user.profilePic,

        })
    }
    catch(e){
      console.log("error in log in ",e.message)
      res.status(500).json({message:"internet server error"})

    }
}

const logout =(req,res) =>{
    
try{
 res.cookie("jwt","",{maxAge:0})
 res.status(200).json({message:"logged out successfully"})

}
catch(e){
  console.log("error in logout controller ",error.message)

}
}

const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (e) {
    console.log("error in update profile:", e);
    res.status(500).json({ message: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {signup,login,logout,checkAuth,updateProfile}
