import { Router } from "express";
import * as prestecCtrl from '../controllers/prestecs.controller.js'
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();


router.post('/', verifyToken, prestecCtrl.createPrestec)
//router.post('/', async (req,res) =>{ console.log (req.body)})
router.get('/', prestecCtrl.getPrestecs)
router.patch('/', verifyToken, prestecCtrl.updatePrestec)
router.delete('/:prestecId', verifyToken, prestecCtrl.deletePrestecById)


export default router;