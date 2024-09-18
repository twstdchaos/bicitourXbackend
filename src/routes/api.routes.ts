import { Router } from 'express'
const router = Router()
import user from './user.routes'
import event from './event.routes'

router.use('/api', user)
router.use('/api', event)


export default router