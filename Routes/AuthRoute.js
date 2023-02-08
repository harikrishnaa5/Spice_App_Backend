import express from "express"
import { loginUser, otpVerify, registerUser } from "../Controller/authController.js"


const router = express.Router()

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/otpverify',otpVerify)

export default router