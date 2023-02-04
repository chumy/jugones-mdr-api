import { Router } from "express";
import * as jocCtrl from '../controllers/jocs.controllers.js'
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();


router.post('/', verifyToken ,jocCtrl.createJoc)
router.get('/', jocCtrl.getJocs)
router.get('/:jocId', jocCtrl.getJocById)
router.patch('/', verifyToken, jocCtrl.updateJoc)
router.delete('/:jocId', verifyToken, jocCtrl.deleteJocById)
router.get('/bgg/:jocId', jocCtrl.getBggInfo)


export default router;