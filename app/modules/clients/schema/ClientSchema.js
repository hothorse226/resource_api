import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ClientSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: false,
    },
    note: {
        type: String,
        required: false,
    },
    is_active: {
        type: Boolean,
        required: false,
        default: true,
    },
});

export default ClientSchema;
