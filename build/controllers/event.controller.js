"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addAttendeeToEvent = exports.updateEventById = exports.getEventById = exports.getAllEvents = exports.deleteEventById = exports.createEvent = void 0;
const event_model_1 = __importDefault(require("../models/event.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const emailService_1 = require("../utils/emailService");
const logger_1 = __importDefault(require("../utils/logger"));
const createEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, date, hour, location, cost, distance, capacity, category, attendees, eventImg } = req.body;
    try {
        if (!eventImg || eventImg.length === 0) {
            logger_1.default.warn('Event image is required');
            return res.status(400).json({
                ok: false,
                msg: 'La imagen del evento es obligatoria',
            });
        }
        const dbEvent = new event_model_1.default({
            name,
            date,
            hour,
            location,
            cost,
            distance,
            capacity,
            category,
            attendees,
            eventImgs: eventImg,
        });
        yield dbEvent.save();
        logger_1.default.info(`Event created successfully with ID: ${dbEvent._id}`);
        return res.status(201).json({
            ok: true,
            msg: 'Evento creado exitosamente',
            eventId: dbEvent._id.toString(),
        });
    }
    catch (error) {
        logger_1.default.error(`Error creating event: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento, por favor contacta a soporte.',
        });
    }
});
exports.createEvent = createEvent;
const getAllEvents = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const events = yield event_model_1.default.find().select('name');
        logger_1.default.info('Fetched all events');
        return res.status(200).json({
            ok: true,
            events,
        });
    }
    catch (error) {
        logger_1.default.error(`Error fetching all events: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error encontrando el evento, por favor contacta a soporte.',
        });
    }
});
exports.getAllEvents = getAllEvents;
const getEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const event = yield event_model_1.default.findById(id);
        if (!event) {
            logger_1.default.warn(`Event not found with ID: ${id}`);
            return res.status(404).json({
                ok: false,
                msg: 'Event Not Found',
            });
        }
        logger_1.default.info(`Fetched event with ID: ${id}`);
        return res.status(202).json({
            ok: true,
            msg: 'File found',
            event,
        });
    }
    catch (error) {
        logger_1.default.error(`Error fetching event by ID: ${id}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Could not get event, please try again',
        });
    }
});
exports.getEventById = getEventById;
const updateEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { name, date, hour, location, cost, distance, capacity, category } = req.body;
    try {
        const updatedData = {};
        if (name)
            updatedData.name = name;
        if (date)
            updatedData.date = date;
        if (hour)
            updatedData.hour = hour;
        if (location)
            updatedData.location = location;
        if (cost)
            updatedData.cost = cost;
        if (distance)
            updatedData.distance = distance;
        if (capacity)
            updatedData.capacity = capacity;
        if (category)
            updatedData.category = category;
        const event = yield event_model_1.default.findByIdAndUpdate(id, updatedData, { new: true });
        if (!event) {
            logger_1.default.warn(`Event not found for update with ID: ${id}`);
            return res.status(404).json({
                ok: false,
                msg: 'Event not found for update',
            });
        }
        logger_1.default.info(`Event updated successfully with ID: ${id}`);
        return res.status(200).json({
            ok: true,
            msg: 'Event updated successfully',
            event,
        });
    }
    catch (error) {
        logger_1.default.error(`Error updating event by ID: ${id}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Server error updating the event, contact support',
        });
    }
});
exports.updateEventById = updateEventById;
const deleteEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const event = yield event_model_1.default.findOneAndDelete({ _id: id });
        if (event) {
            logger_1.default.info(`Event deleted successfully with ID: ${id}`);
            return res.status(200).json({
                ok: true,
                msg: `El evento ${event.name} ha sido eliminado.`,
            });
        }
        logger_1.default.warn(`Event not found for deletion with ID: ${id}`);
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró el evento.',
        });
    }
    catch (error) {
        logger_1.default.error(`Error deleting event by ID: ${id}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor al eliminar el evento, por favor contacta a soporte.',
        });
    }
});
exports.deleteEventById = deleteEventById;
const addAttendeeToEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const idEvent = req.params.id;
    const idUser = req.body.id;
    try {
        const valEvent = yield event_model_1.default.findOne({ _id: idEvent });
        const user = yield user_model_1.default.findOne({ _id: idUser });
        if (!valEvent) {
            logger_1.default.warn(`Event not found with ID: ${idEvent}`);
            return res.status(400).json({
                ok: false,
                msg: "Event not found",
            });
        }
        if (!user) {
            logger_1.default.warn(`User not found with ID: ${idUser}`);
            return res.status(400).json({
                ok: false,
                msg: "User not found",
            });
        }
        const exists = valEvent.attendees.includes(idUser);
        if (exists) {
            logger_1.default.info(`User already in event with ID: ${idUser}`);
            return res.status(400).json({
                ok: false,
                msg: "User is already in event!",
            });
        }
        if (valEvent.capacity <= valEvent.attendees.length) {
            logger_1.default.info(`Event at capacity with ID: ${idEvent}`);
            return res.status(400).json({
                ok: false,
                msg: "Event at capacity, cannot add more",
            });
        }
        valEvent.attendees.push(idUser);
        yield valEvent.save();
        const adminEmail = 'admin@example.com';
        const adminSubject = `Nuevo asistente añadido al evento: ${valEvent.name}`;
        const adminText = `El usuario ${user.nombre} (${user.email}) se ha añadido al evento "${valEvent.name}". Capacidad restante: ${valEvent.capacity - valEvent.attendees.length}.`;
        yield (0, emailService_1.sendEmail)(adminEmail, adminSubject, adminText);
        logger_1.default.info(`Admin notified of new attendee for event with ID: ${idEvent}`);
        const userSubject = `Registro confirmado para el evento: ${valEvent.name}`;
        const userText = `Hola ${user.nombre},\n\nTe has registrado exitosamente para el evento "${valEvent.name}". ¡Nos vemos ahí!`;
        yield (0, emailService_1.sendEmail)(user.email, userSubject, userText);
        logger_1.default.info(`User notified of successful registration for event with ID: ${idEvent}`);
        return res.status(200).json({
            ok: true,
            msg: "User Added and notifications sent!",
        });
    }
    catch (error) {
        logger_1.default.error(`Error adding attendee to event with ID: ${idEvent}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Server error. Contact support',
        });
    }
});
exports.addAttendeeToEvent = addAttendeeToEvent;
