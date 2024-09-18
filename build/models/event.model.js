"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const eventSchema = new mongoose_1.Schema({
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
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Users',
        }],
    eventImgs: [{
            type: String,
            required: true,
        }],
});
const Events = (0, mongoose_1.model)('Events', eventSchema);
exports.default = Events;
