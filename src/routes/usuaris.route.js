import { Router } from "express";
import * as userCtrl from '../controllers/usuaris.controller.js'

const router = Router();


router.post('/', userCtrl.createUser)
router.get('/', userCtrl.getUsers)
router.patch('/', userCtrl.updateUserById)



export default router;