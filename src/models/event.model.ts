import { Schema, model } from 'mongoose';
const eventSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    hour: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    distance: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    attendees: [{
        type: Schema.Types.ObjectId,
        ref: 'Users',
    }],
    eventImgs: [{
        type: String,
        required: true,
    }],
});
const Events = model('Events', eventSchema);
export default Events;
