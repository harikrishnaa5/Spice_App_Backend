import postModel from "../Model/postModel.js";
import userModel from "../Model/userModel.js";
import mongoose, { Types } from "mongoose";

//Create New Post
export const createPost = async (req, res) => {
  const newPost = new postModel(req.body);
  try {
    await newPost.save();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get a Post
export const getPost = async (req, res) => {
  console.log(req.params.id);
  const id = req.params.id;

  try {
    const post = await postModel.findById(id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json(error);
  }
};

//Update a Post
export const updatePost = async (req, res) => {
  const {postId,id} = req.body;

  try {
    const post = await postModel.findById(postId);
    console.log(post.userId,Types.ObjectId(id))
    if (post.userId +""=== id) {
      await post.updateOne({ $set: req.body });
      console.log('updated')
      // res.status(200).json("Post Updated");
      const posts=await postModel.find().populate("userId");
      res.status(200).json(posts);
    } else {
      res.status(403).json("Action Forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Delete a Post
export const deletePost = async (req, res) => {
  const postId = req.params.id;
  const { id } = req.body;

  try {
    const post = await postModel.findById(postId);
    if (post.userId+"" === id) {
      await post.deleteOne();
      res.status(200).json("Post Deleted Successfully");
    } else {
      res.status(403).json("Action Forbidden");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Like & Dislike a Post
export const likePost = async (req, res) => {
  const id = req.params.id;
  const { userId } = req.body;

  try {
    const post = await postModel.findById(id);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
      res.status(200).json("Post Liked");
    } else {
      await post.updateOne({ $pull: { likes: userId } });
      res.status(200).json("Post unLiked");
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

//Get Timeline Post
export const getTimeLinePost = async (req, res) => {
  const userId = req.params.id;
 
  try {
    const user = await userModel.findOne({ _id: userId }, { following: 1 });
  
    const currentUserPosts = await postModel
      .find({$and:[{
        userId: { $in: [...user.following, userId] }},
        {'report.userId':{$ne:userId}
      }]})
      .populate("userId")
      .sort({ createdAt: "ascending" });
      currentUserPosts.reverse()
    console.log(currentUserPosts, "user posts of current");
    res.status(200).json({ currentUserPosts });
  } catch (error) {
    res.status(500).json(error);
  }
};

//Add Comment
export const addComment = async (req, res) => {
  try {
    console.log(req.body.postid);
    const postid = req.body.postid;
    const userid = req.body.userId;
    const content = req.body.body.comment;
    const post = await postModel.findById({ _id: postid });
    const comment = await postModel.findByIdAndUpdate(
      {
        _id: postid,
      },
      {
        $push: {
          comments: { commentBy: userid, comment: content },
        },
      }
    );
    comment.save();
    res.sendStatus(200);
    console.log(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error found" });
  }
};

//Show Comments
export const showComments = async (req, res) => {
  const postId = req.body.postid;
  console.log(postId, "postid");
  const findComments = await postModel
    .findById({ _id: postId })
    .populate({ path: "comments", populate: { path: "commentBy" } })
    .sort({ createdAt: -1 });
  console.log(findComments, "comments found");
  res.status(200).json({ findComments });
};

//Show Posts
export const showPosts = async (req, res) => {
  try {
    const showPost = await postModel.find().populate("userId");
    // .sort({ updatedAt: -1 });

    console.log(showPost, "show posts");
    res.status(200).json({ showPost });
  } catch (error) {
    res.status(500).json({ message: "error found" });
    console.log(error);
  }
};

//Get User Posts
export const getUserPosts = async (req, res) => {
 
  try {
    const id = req.params.id;
    console.log(id, "user posts in the timeline");
    const showPost = await postModel.find({userId:id}).populate("userId");
    // .sort({ updatedAt: -1 });
    res.status(200).json({ showPost });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error found" ,error});
  }
};

//Report post
export const reportPost = async (req, res) => {
  try {
    const {postId, userId, reason} = req.body
    console.log(req.body)
    const post = await postModel.findById(postId)
    console.log(post)
    if(post.userId !== userId){
      // const report = await postModel.updateOne({_id: postId}, {$push: {report: {userId: userId, reason: reason}}})
      if(! Array.isArray( post.report))
      {
        post.report =[]
      }
      post.report.push({userId,reason})
      post.save()
      res.status(200).json("post reported successfully");
    }
    else{
      res.status(403).json("Action forbidden");
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error found" ,error});
  }
}

//delete reported post manually
export const deleteReported=async(req,res)=>{
  const postId=req.params.id;
  try {
   const response = await postModel.findByIdAndDelete(postId)
   console.log(response);
   res.status(200).json('Removed')
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
}
