import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AdminModel from '../Model/adminModel.js'
import PostModel from '../Model/postModel.js'
import UserModel from '../Model/userModel.js'


//Admin Login
export const adminLogin = async(req, res) => {
    const {username, password} = req.body;
    
    try {
        const admin = await AdminModel.findOne({username})
        if(admin){
            const validity = await bcrypt.compare(password, admin.password)
            if(!validity){
                res.status(400).json("Wrong password")
            }else{
                const  token = jwt.sign({
                    username: admin.username,
                    id: admin._id
                },
                process.env.JWT_KEY,{expiresIn: "48h"})
                res.status(200).json({admin, token})
            }
        }else{
            res.status(404).json("Enter valid credentials !")
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

//Get all posts
export const getAllPosts=async(req,res)=>{
    try {
      const response=await PostModel.find().sort({createdAt:-1}).populate('userId').populate('report')
      res.status(200).json(response)
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  }

  //Block Users

export const blockUser=async(req,res)=>{
    const id=req.params.id;
    try {
      await UserModel.findByIdAndUpdate(id,{isBlocked:true})
      res.status(202).json('User Blocked')
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  }

  //Activate Users

export const activateUser=async(req,res)=>{
    const id =req.params.id;
    try {
      await UserModel.findByIdAndUpdate(id,{isBlocked:false});
      res.status(200).json('User Activated')
    } catch (error) {
      console.log(error);
      res.status(500).json(error)
    }
  }
  