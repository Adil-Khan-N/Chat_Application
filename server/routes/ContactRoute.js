import { Router } from "express";
import { verifyToken } from "../middleware/AuthMiddleWare.js";
import { searchContacts } from "../controllers/ContactController.js";

const contactsRoutes = Router();

contactsRoutes.post("/search", verifyToken, searchContacts);

export default contactsRoutes;