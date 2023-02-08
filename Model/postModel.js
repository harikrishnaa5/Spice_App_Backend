import mongoose from "mongoose";

const postSchema = mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true ,ref:"Users"},
    desc: String,
    likes: [],
    comments:[
      {
        comment:{
          type:String
        },
        commentBy:{
          type: mongoose.Schema.Types.ObjectId,
          ref:"Users"
        },
        createdAt:{
          type:Date,
          default: new Date(),
        },
      }
    ],
    report:[
      {
        userId:{
          type:mongoose.Types.ObjectId,
          ref:"users"
        },
        reason:String
      }
    ],
    image: String,
    createdAt: {
      type: Date,
      default: new Date()
    },
  },
  {
    timestamps: true,
  }
);

var postModel = mongoose.model("Posts", postSchema);
export default postModel;
