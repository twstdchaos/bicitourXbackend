"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_controller_1 = require("../controllers/event.controller");
const validationResult_1 = __importDefault(require("../middlewares/validationResult"));
const router = express_1.default.Router();
router.post('/create-event', event_controller_1.createEvent);
router.get('/get-all-events', validationResult_1.default, event_controller_1.getAllEvents);
router.delete('/del-event/:id', validationResult_1.default, event_controller_1.deleteEventById);
router.get('/get-event/:id', event_controller_1.getEventById);
router.put('/update-event/:id', event_controller_1.updateEventById);
router.put('/events/:id/reg', event_controller_1.addAttendeeToEvent);
exports.default = router;
