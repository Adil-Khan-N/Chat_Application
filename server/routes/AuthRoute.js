import { Router } from "express";
import { getUserInfo, login, signup } from "../controllers/AuthContoller.js";
import { verifyToken } from "../middleware/AuthMiddleWare.js";

const AuthRoutes = Router();
AuthRoutes.post("/signup",signup)
AuthRoutes.post("/login",login)
AuthRoutes.get("/user-info",verifyToken, getUserInfo)

export default AuthRoutes