import userModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import postModel from "../Model/postModel.js";

//get User
export const getUser = async (req, res) => {
  const id = req.params.id;
console.log(id)
  try {
    const user = await userModel.findById(id);
    if (user) {
      const { password, ...otherDetails } = user._doc;
      console.log(otherDetails, "-------------other details");
      const userPost = await postModel.find({userid:id})
      otherDetails.allPosts = userPost
      res.status(200).json(otherDetails);
    } else {
      res.status(404).json("user does not exist");
    }
  } catch (error) {
    res.status(500).json({ error });
  }
};

//get All Users
export const getAlluser = async (req, res) => {
  try {
    let users = await userModel.find();

    users = users.map((user) => {
      const { password, ...otherDetails } = user._doc;
      return otherDetails;
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Update User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { _id, password } = req.body;
  console.log(req.body,"formDataaaaaaaaaaa");

  if (id === _id) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await userModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      const token = jwt.sign(
        { username: user.username, id: user._id },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );
      res.status(200).json({ user, token });
    } catch (error) {
      console.log(error);
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied");
  }
};

//Delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus } = req.body;
  if (currentUserId === id || currentUserAdminStatus) {
    try {
      await userModel.findByIdAndDelete(id);
      res.status(200).json("User Deleted Successfully");
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("Access Denied");
  }
};

//Follow USer
export const followUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await userModel.findById(id);
      const followingUser = await userModel.findById(_id);
      if (!followUser.followers.includes(_id)) {
        await followUser.updateOne({ $push: { followers: _id } });
        await followingUser.updateOne({ $push: { following: id } });
        res.status(200).json("User Followed");
      } else {
        res.status(403).json("User is Already followed by You");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  }
};

//unFollow USer
export const UnfollowUser = async (req, res) => {
  const id = req.params.id;
  const { _id } = req.body;
  if (_id === id) {
    res.status(403).json("Action Forbidden");
  } else {
    try {
      const followUser = await userModel.findById(id);
      const followingUser = await userModel.findById(_id);

      if (followUser.followers.includes(_id)) {
        await followUser.updateOne({ $pull: { followers: _id } });
        await followingUser.updateOne({ $pull: { following: id } });
        res.status(200).json("User unFollowed");
      } else {
        res.status(403).json("User is not followed by You");
      }
    } catch (error) {
      res.status(500).json({ error });
    }
  }
};

////Search User
export const SearchUsers = async (req, res) => {
  console.log("Search User Enabled");
  const { keyword } = req.body;
  console.log(keyword, "keyword");
  try {
    let FindUser = await userModel.find({
      firstname: { $regex: new RegExp(keyword), $options: "si" },
    });
    res.status(200).json(FindUser);
  } catch (error) {
    res.status(500).json({ error });
  }
};
