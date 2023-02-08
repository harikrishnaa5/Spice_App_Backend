import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import AuthRoute from "./Routes/AuthRoute.js";
import userRoute from "./Routes/userRoute.js";
import postRoute from "./Routes/postRoute.js";
import uploadRoute from "./Routes/uploadRoute.js";
import chatRoute from "./Routes/chatRoute.js";
import messageRoute from "./Routes/messageRoute.js";
import AuthAdminRoute from './Routes/AuthAdminRoute.js';
import AdminRoute from './Routes/AdminRoute.js'
import {createServer} from 'http'
import {Socket,Server} from 'socket.io'
//Routes

const app = express();
//to server images for public
app.use(express.static("public"));
app.use("/images", express.static("images"));

//Middleware
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

dotenv.config();
const httpServer = createServer(app)


const io = new Server(httpServer, {
  cors: {
    methods:["GET","POST"],
    origin: "http://localhost:3000"
  },
});
console.log("socket Started at Port 8800");
let activeUsers = [];

io.on("connection", (socket) => {
  //Add New User
  socket.on("new-user-add", (newUserId) => {
    //if user is not added previosly
    if (!activeUsers.some((user) => user.userId === newUserId)) {
      activeUsers.push({
        userId: newUserId,
        socketId: socket.id,
      });
    }
    console.log("Connected Users", activeUsers);
    io.emit("get-users", activeUsers);
  });

  //Send Message
  socket.on("send-message", (data) => {
    console.log(data,"dddddddddddddddddddddd")
    const { receieverId } = data;
    const user = activeUsers.find((user) => user.userId === receieverId);
    console.log("reciever ID", receieverId,activeUsers);
    console.log("datauser", user);
    if (user) {
      io.to(user.socketId).emit("recieve-message", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    console.log("User Disconnected", activeUsers);
    io.emit("get-users", activeUsers);
  });
});
// mongoose
//   .connect(process.env.MONGO_DB, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() =>
//     app.listen(process.env.PORT, () =>
//       console.log("Connected to DataBase -chethas7")
//     )
//   )
mongoose
.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(()=>{
  
  httpServer.listen(process.env.PORT,()=>{

    
    console.log("listening  port",process.env.PORT);
  })
})
  .catch((error) => console.log(error));

//usage of Routes
app.use("/", AuthRoute);
app.use("/user", userRoute);
app.use("/posts", postRoute);
app.use("/upload", uploadRoute);
app.use("/chat", chatRoute);
app.use("/message", messageRoute);

//admin
app.use('/auth-admin',AuthAdminRoute)
app.use('/admin',AdminRoute)
