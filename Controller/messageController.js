import messageModel from "../Model/messageModel.js";

export const addMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new messageModel({ chatId, senderId, text });
  try {
    const result = await message.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getMessage = async (req, res) => {
  const  chatId  = req.params.chatId;
  console.log(chatId)
  try {
    const result = await messageModel.find({ chatId });
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
};
