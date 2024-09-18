import express from 'express';
import validateFields from '../middlewares/validationResult';
import { 
    createEvent, 
    getAllEvents, 
    deleteEventById, 
    getEventById, 
    updateEventById, 
    requestToJoinEvent, 
    addAttendeeByAdmin 
} from '../controllers/event.controller';

const router = express.Router();

router.post('/create-event', createEvent);
router.get('/get-all-events', validateFields, getAllEvents);
router.delete('/del-event/:id', validateFields, deleteEventById);
router.get('/get-event/:id', getEventById);
router.put('/update-event/:id', updateEventById);
router.post('/events/:id/request', requestToJoinEvent);
router.put('/events/:id/add', addAttendeeByAdmin);
export default router;