import { Router } from "express";
import * as partidaCtrl from '../controllers/partides.controller.js'
import { verifyToken } from "../controllers/auth.controller.js";

const router = Router();


router.post('/', verifyToken, partidaCtrl.createPartida)
router.get('/', partidaCtrl.getPartides)
router.patch('/', verifyToken, partidaCtrl.updatePartidaById)
router.delete('/:partidaId', verifyToken, partidaCtrl.deletePartidaById)
router.post('/addParticipant', verifyToken, partidaCtrl.afegirParticipant)
router.post('/delParticipant', verifyToken, partidaCtrl.eliminarParticipant)
router.get('/:partidaId', partidaCtrl.getPartidaById)



export default router;