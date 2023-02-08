import mongoose from "mongoose";

const AdminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    }
  },
  { timestamps: true }
);

const AdminModel = mongoose.model("admin", AdminSchema);
export default AdminModel;
