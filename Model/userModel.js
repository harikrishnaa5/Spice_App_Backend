import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        isBlocked: {
            type: Boolean,
            default: false,
          },
        profilePicture: String,
        coverPicture: String,
        about: String,
        livesIn: String,
        worksAt: String,
        relationship: String,
        country:String,
        followers: [],
        following: [],
        verified: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
)

const userModel = mongoose.model("Users", UserSchema);
export default userModel