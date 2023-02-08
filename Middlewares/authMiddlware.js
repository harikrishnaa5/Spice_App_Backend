import Jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../Model/userModel.js";

dotenv.config();
const secret = process.env.JWT_KEY;

const authMiddlware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    console.log(token);
    
    if (token) {
      const decoded = Jwt.verify(token, secret);
      req.body.id = decoded?.id;
      const user = await userModel.findById(decoded.id)
      if(!user )return res.status(401).json('user-not-exist')
      if(user.isBlocked)return res.status(401).json("user is blocked")
      next();
    }
    else{
      res.status(401).json('user-not-exist')
    }
  } catch (error) {
    console.log(error);
  }
};
export default authMiddlware;
