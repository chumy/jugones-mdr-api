import { Router } from "express";
import * as userCtrl from '../controllers/usuaris.controller.js'
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();


router.post('/', verifyToken, userCtrl.createUser)
router.get('/', userCtrl.getUsers)
router.patch('/', verifyToken, userCtrl.updateUserById)



export default router;