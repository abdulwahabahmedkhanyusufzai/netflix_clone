import { User } from "../models/usermodel.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

export async function signup(req,res){
    try{
        const {email,password,username} = req.body;
        
        if(!email ||!password ||!username){
        return res.status(400).json({success:false,message:"All fields are required"})
        }

        const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if(!emailRegex.test(email)){
            return res.status(400).json({success:false,message:"Invalid Email"})
        }

        if(password.length < 6){
            return res.status(400).json({success:false,message:"Password must be atleast 6 characters"})
        }

        const existingUserByEmail = await User.findOne({email:email})

        if(existingUserByEmail){
            return res.status(400).json({success:false,message:"Email already exists"})
        }
        
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password,salt);

        const existingUserByUsername =await User.findOne({username:username})

        if(existingUserByUsername){
            return res.status(400).json({success:false,message:"Username already exists"})
        }
        
        const PROFILE_PICS =["/profile_1.png","/profile_2.png","profile_3.png"]

        const image = PROFILE_PICS[Math.floor(Math.random() * PROFILE_PICS.length)]
        const newUser = new User({
            email,
            username,
            password:hashedPassword,
            image
        })
        generateTokenAndSetCookie(newUser._id,res)
        await newUser.save();

        res.status(201).json({
            success:true,
            user:{
                ...newUser._doc,
                password:"",
            },
            message:"User created successfully"})
    } catch(error) {
        console.log("Error in signup Controller",error,error.message);
        res.status(500).json({success:false,message:"Internal Server Error"})
    }
};

export async function login(req,res) {
   try{
    const {email,password} = req.body;
    
    if(!email || !password){
        return res.status(400).json({success:false,message:"All fields are Required"});
    }
    
    const user = await User.findOne({email:email});

    if(!user){
        return res.status(400).json({success:false,message:"Invalid Creditionals"})
    }

    const isPasswordCorrect = await bcryptjs.compare(password,user.password);

    if(!isPasswordCorrect){
        return res.status(400).json({success:false,message:"Invalid Password"})
    }

    generateTokenAndSetCookie(user._id,res);

    res.status(200).json({
        success:true,
        user:{
            ...user._doc,
            password:""
        }
    })
   }catch(error){
    console.log("Error in login credientials",error.message);
    res.status(500).json({success:false,message:"Internal Server Error"});
   }
};

export async function logout(req,res){
    try{
       res.clearCookie("jwt-netflix");
       res.status(200).json({success:true,message:"Logged Out Successfully"})
    }catch(error){
        console.log("Error in logout Controller",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
};

export async function authCheck(req,res){
    try {
        res.status(200).json({success:true, user: req.user});
    } catch (error) {
      console.log("Error in authCheck Controller",error.message);
      res.status(500).json({success:false, message:"Internal Server Error"});  
    }
}