import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BookingSchema = new Schema({
    resource_id: { type: Schema.Types.ObjectId, ref: 'resources' },
    booking_type: {
        type: Number,
        required: true,
    },
    time_from: {
        type: String,
        required: true,
    },
    time_end: {
        type: String,
        required: true,
    },
    hours_per_day: {
        type: Number,
        required: true,
    },
    client_id: { type: Schema.Types.ObjectId, ref: 'clients' },
    project_id: { type: Schema.Types.ObjectId, ref: 'projects' },
    time_off_reason: {
        type: String,
        required: false,
    },
    billable: {
        type: Number,
        required: false,
    },
    detail: {
        type: String,
        required: false,
    },
    booker_id: { type: Schema.Types.ObjectId, ref: 'resources' },
});

export default BookingSchema;
