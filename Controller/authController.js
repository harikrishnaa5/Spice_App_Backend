import userModel from "../Model/userModel.js";
import bcrypt from "bcrypt";
import Jwt from "jsonwebtoken";
import nodemailer from 'nodemailer'
import otpVerificationModel from "../Model/otpVerificationModel.js";

export const registerUser = async (req, res) => {
  // const { username, password, firstname, lastname } = req.body;
console.log(req.body,'----------------here--- ctrlpll')
  const salt = await bcrypt.genSalt(10);
  const hashedPAssword = await bcrypt.hash(req.body.password, salt);
  req.body.password = hashedPAssword;
  const newUser = new userModel(req.body);
  const { username } = req.body;
  console.log(username,'---------email')

  try {
    const oldUser = await userModel.findOne({ username });
    if (oldUser) {
      return res
        .status(400)
        .json({ message: "username is already registered" });
    }
    const user = await newUser.save();

    //otp verification
    const otpSend = await sendOtpVerificaionEmail(user, res)

    const token = Jwt.sign(
      { username: user.username, id: user._id },
      process.env.JWT_KEY,
      { expiresIn: "2d" }
    );
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Login User
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await userModel.findOne({ username: username });
    if (user) {
      if(user.isBlocked)
      {
      return res.status(401).json("user blocked");
      }
      const checkPassword = await bcrypt.compare(password, user.password);
      if (!checkPassword) {
        res.status(200).json("wrong password");
      } else {
        const token = Jwt.sign(
          { username: user.username, id: user._id },
          process.env.JWT_KEY,
          { expiresIn: "48h" }
        );
        res.status(200).json({ user, token });
      }
    } else {
      res.status(404).json("user does not exist");
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//send otp

const sendOtpVerificaionEmail = async ({ _id, username }, res) => {
  console.log(_id,username,'id and user name at sendotpverifunction.............')
  const email = process.env.EMAIL
  const password = process.env.NODEMAILER_PASS
  console.log(email,password,'email and password at otpverify................')
  return new Promise(async (resolve, reject) => {

      try {

          const otp = `${Math.floor(1000 + Math.random() * 9000)}`
          const transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                  user: process.env.EMAIL,
                  pass: process.env.NODEMAILER_PASS
              }
             
          });

          console.log(_id,username,'id and user namea at sendotpverifunction22222222222.............')
          const mailOptions = {
              
              from: process.env.EMAIL,
              to: username,
              subject: 'Subject',
              text: 'Email content',
              html: `<p>The OTP to verify your emai is <b>${otp}</b>. Ignore this mail if this is not done by you. </p>`
          };

          transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                  console.log(error);
              } else {
                  console.log('Email sent: ' + info.response);
                  
              }
          });

          resolve({
              status: "pending",
              message: "verification otp mail is send",
              data: {
                  userId: _id,
                  email: username
              }
          })
          const saltRound = 10;
          const hashedOtp = await bcrypt.hash(otp, saltRound);
          const newOtpVerification = await new otpVerificationModel({
              userId: _id,
              otp: hashedOtp,
              createdAt: Date.now(),
              expiresAt: Date.now() + 3600000,
          });
          await newOtpVerification.save();
          await transporter.sendMail(mailOptions);


      } catch (error) {
          reject({
              status: "otp send failed",
              message: error.message
          })
      }
  })
}


//otp email verification

export const otpVerify = async(req,res)=>{
  
  try {
      let {userId,otp} = req.body
      // console.log(userId,otp, 'userid and otp at authcontroller')
      if(!userId || !otp){
          throw Error('Empty otp details are not allowed')
      }
      else{
          const otpVerificationData = await otpVerificationModel.find({userId})
          console.log(otpVerificationData, "otp verification data")
          if(otpVerificationData){
              const {expiresAt} = otpVerificationData[0];
              const hashedOtp = otpVerificationData[0].otp;
              console.log(hashedOtp,'hashed otp')

              if(expiresAt < Date.now()){
                  await otpVerificationModel.deleteMany({userId})
                  throw new Error("OTP expires. Please request again")
              }
              else{
                  console.log(otp,hashedOtp,'otp,hashedotp')
                  const vaildOtp =  await bcrypt.compare(otp, hashedOtp)
                  if(!vaildOtp){
                      throw new Error(" Invalied otp. check and Enter correct OTP")
                  }
                  else{
                      console.log('else case otp valid')
                      await userModel.updateOne({_id:userId}, {verified:true});
                      await otpVerificationModel.deleteMany({userId})
                      const user = await userModel.findOne({_id:userId})
                      console.log(user,'user at otpverify....')
                      
                      const token = Jwt.sign({
                          username: user.username, id: user._id
                      }, process.env.JWT_KEY, { expiresIn: '24h' })
                      
                      res.status(200).json({ user, token })
                      
                     
                  }

              }
          }
      }
  } catch (error) {
      res.json({
          status:"Failed",
          message: error.message
      })
  }
}
