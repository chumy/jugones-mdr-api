import { Router } from "express";
import * as jocCtrl from '../controllers/jocs.controllers.js'

const router = Router();


router.post('/', jocCtrl.createJoc)
router.get('/', jocCtrl.getJocs)
router.get('/:jocId', jocCtrl.getJocById)
router.patch('/', jocCtrl.updateJoc)
router.delete('/:jocId', jocCtrl.deleteJocById)
router.get('/bgg/:jocId', jocCtrl.getBggInfo)


export default router;