import { Router } from "express";
import * as prestecCtrl from '../controllers/prestecs.controller.js'

const router = Router();


router.post('/', prestecCtrl.createPrestec)
router.get('/', prestecCtrl.getPrestecs)
router.patch('/', prestecCtrl.updatePrestec)
router.delete('/:prestecId', prestecCtrl.deletePrestecById)


export default router;