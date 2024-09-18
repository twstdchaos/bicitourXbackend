import { Request, Response } from "express";
import Events from "../models/event.model";
import Users from "../models/user.model";
import { sendEmail } from "../utils/emailService";
import logger from "../utils/logger";

const createEvent = async (req: Request, res: Response): Promise<Response> => {
    const { name, date, hour, location, cost, distance, capacity, category, attendees, eventImg } = req.body;
    try {
        if (!eventImg || eventImg.length === 0) {
            logger.warn('Event image is required');
            return res.status(400).json({
                ok: false,
                msg: 'La imagen del evento es obligatoria',
            });
        }
        const dbEvent = new Events({
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
        await dbEvent.save();
        logger.info(`Event created successfully with ID: ${dbEvent._id}`);
        return res.status(201).json({
            ok: true,
            msg: 'Evento creado exitosamente',
            eventId: dbEvent._id.toString(),
        });
    } catch (error) {
        logger.error(`Error creating event: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error al crear el evento, por favor contacta a soporte.',
        });
    }
};

const getAllEvents = async (_req: Request, res: Response): Promise<Response> => {
    try {
        const events = await Events.find();
        logger.info('Fetched all events');
        return res.status(200).json({
            ok: true,
            events,
        });
    } catch (error) {
        logger.error(`Error fetching all events: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error encontrando el evento, por favor contacta a soporte.',
        });
    }
};

const getEventById = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    try {
        const event = await Events.findById(id);
        if (!event) {
            logger.warn(`Event not found with ID: ${id}`);
            return res.status(404).json({
                ok: false,
                msg: 'Event Not Found',
            });
        }
        logger.info(`Fetched event with ID: ${id}`);
        return res.status(202).json({
            ok: true,
            msg: 'File found',
            event,
        });
    } catch (error) {
        logger.error(`Error fetching event by ID: ${id}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Could not get event, please try again',
        });
    }
};

const updateEventById = async (req: Request, res: Response): Promise<Response> => {
    const id = req.params.id;
    const { name, date, hour, location, cost, distance, capacity, category } = req.body;
    try {
        const updatedData: Partial<typeof req.body> = {};
        if (name) updatedData.name = name;
        if (date) updatedData.date = date;
        if (hour) updatedData.hour = hour;
        if (location) updatedData.location = location;
        if (cost) updatedData.cost = cost;
        if (distance) updatedData.distance = distance;
        if (capacity) updatedData.capacity = capacity;
        if (category) updatedData.category = category;
        const event = await Events.findByIdAndUpdate(id, updatedData, { new: true });
        if (!event) {
            logger.warn(`Event not found for update with ID: ${id}`);
            return res.status(404).json({
                ok: false,
                msg: 'Event not found for update',
            });
        }
        logger.info(`Event updated successfully with ID: ${id}`);
        return res.status(200).json({
            ok: true,
            msg: 'Event updated successfully',
            event,
        });
    } catch (error) {
        logger.error(`Error updating event by ID: ${id}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Server error updating the event, contact support',
        });
    }
};

const deleteEventById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    try {
        const event = await Events.findOneAndDelete({ _id: id });
        if (event) {
            logger.info(`Event deleted successfully with ID: ${id}`);
            return res.status(200).json({
                ok: true,
                msg: `El evento ${event.name} ha sido eliminado.`,
            });
        }
        logger.warn(`Event not found for deletion with ID: ${id}`);
        return res.status(400).json({
            ok: false,
            msg: 'No se encontró el evento.',
        });
    } catch (error) {
        logger.error(`Error deleting event by ID: ${id}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Error en el servidor al eliminar el evento, por favor contacta a soporte.',
        });
    }
};

const requestToJoinEvent = async (req: Request, res: Response): Promise<Response> => {
    const idEvent = req.params.id;
    const idUser = req.body.id;

    try {
        const valEvent = await Events.findOne({ _id: idEvent });
        const user = await Users.findOne({ _id: idUser });

        if (!valEvent) {
            logger.warn(`Event not found with ID: ${idEvent}`);
            return res.status(400).json({
                ok: false,
                msg: "Event not found",
            });
        }

        if (!user) {
            logger.warn(`User not found with ID: ${idUser}`);
            return res.status(400).json({
                ok: false,
                msg: "User not found",
            });
        }

        if (valEvent.capacity <= valEvent.attendees.length) {
            logger.info(`Event at capacity with ID: ${idEvent}`);
            return res.status(400).json({
                ok: false,
                msg: "Event is at capacity, cannot add more attendees.",
            });
        }

        const adminEmail = user.email;
        const adminSubject = `Solicitud de registro al evento: ${valEvent.name}`;
        const adminText = `El usuario ${user.nombre} (${user.email}) ha solicitado unirse al evento "${valEvent.name}". ID de usuario: ${idUser}.`;
        await sendEmail(adminEmail, adminSubject, adminText);
        logger.info(`Admin notified of user request to join event with ID: ${idEvent}`);

        return res.status(200).json({
            ok: true,
            msg: "User request sent to admin!",
        });
    } catch (error) {
        logger.error(`Error processing request to join event with ID: ${idEvent}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Server error. Contact support',
        });
    }
};


const addAttendeeByAdmin = async (req: Request, res: Response): Promise<Response> => {
    const idEvent = req.params.id;
    const idUser = req.body.id;

    try {
        const valEvent = await Events.findOne({ _id: idEvent });
        const user = await Users.findOne({ _id: idUser });

        if (!valEvent) {
            logger.warn(`Event not found with ID: ${idEvent}`);
            return res.status(400).json({
                ok: false,
                msg: "Event not found",
            });
        }

        if (!user) {
            logger.warn(`User not found with ID: ${idUser}`);
            return res.status(400).json({
                ok: false,
                msg: "User not found",
            });
        }

        const exists = valEvent.attendees.includes(idUser);
        if (exists) {
            logger.info(`User already in event with ID: ${idUser}`);
            return res.status(400).json({
                ok: false,
                msg: "User is already in event!",
            });
        }

        if (valEvent.capacity <= valEvent.attendees.length) {
            logger.info(`Event at capacity with ID: ${idEvent}`);
            return res.status(400).json({
                ok: false,
                msg: "Event at capacity, cannot add more",
            });
        }

        valEvent.attendees.push(idUser);
        await valEvent.save();

        const adminEmail = 'admin@example.com';
        const adminSubject = `Asistente añadido al evento: ${valEvent.name}`;
        const adminText = `El usuario ${user.nombre} (${user.email}) ha sido añadido al evento "${valEvent.name}". Capacidad restante: ${valEvent.capacity - valEvent.attendees.length}.`;
        await sendEmail(adminEmail, adminSubject, adminText);
        logger.info(`Admin notified of new attendee for event with ID: ${idEvent}`);

        const userSubject = `Registro confirmado para el evento: ${valEvent.name}`;
        const userText = `Hola ${user.nombre},\n\nTe has registrado exitosamente para el evento "${valEvent.name}". ¡Nos vemos ahí!`;
        await sendEmail(user.email, userSubject, userText);
        logger.info(`User notified of successful registration for event with ID: ${idEvent}`);

        return res.status(200).json({
            ok: true,
            msg: "User Added and notifications sent!",
        });
    } catch (error) {
        logger.error(`Error adding attendee to event with ID: ${idEvent}, Error: ${error}`);
        return res.status(500).json({
            ok: false,
            msg: 'Server error. Contact support',
        });
    }
};
export {
    createEvent,
    deleteEventById,
    getAllEvents,
    getEventById,
    updateEventById,
    requestToJoinEvent,
    addAttendeeByAdmin
};
