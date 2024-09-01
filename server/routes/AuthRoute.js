





import { Router } from "express";
import { getUserInfo, login, signup, updateProfile, addProfileImage, removeProfileImage, logout } from "../controllers/AuthContoller.js";
import { verifyToken } from "../middleware/AuthMiddleWare.js";
import multer from "multer";


const AuthRoutes = Router();

const upload = multer({ dest: "uploads/profiles/" });

AuthRoutes.post("/signup",signup)
AuthRoutes.post("/login",login)
AuthRoutes.get("/user-info",verifyToken, getUserInfo)
AuthRoutes.post("/update-profile",verifyToken,updateProfile)
AuthRoutes.post("/add-profile-image", verifyToken, upload.single("profile-image"), addProfileImage);
AuthRoutes.delete("/remove-profile-image",verifyToken,removeProfileImage)
AuthRoutes.post("/logout",logout)


export default AuthRoutes

