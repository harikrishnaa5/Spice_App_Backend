// import mongoose from "mongoose";
import chatModel from "../Model/chatModel.js";

export const createChat = async (req, res) => {
  console.log("kkkk"   ,req.body)
  console.log("kkkk====="   ,req.params)
  // const userId = mongoose.Types.ObjectId(req.body.userid)
  // const id = mongoose.Types.ObjectId(req.body.userid)

  const exist = await chatModel.findOne({members:{$all:[req.body.userid,req.params.id]}})
  if(exist) return res.sendStatus(500)
  const newChat = new chatModel({
    members: [req.body.userid, req.params.id],
  });
  try {
    const result = await newChat.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const userChats = async (req, res) => {
  try {
    const chat = await chatModel.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const findChat = async (req, res) => {
  try {
    const chat = await chatModel.findOne({
      members: { $all: [req.params.firstId, req.params.secondId] },
    });
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json(error);
  }
};
