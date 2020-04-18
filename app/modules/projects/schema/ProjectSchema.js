import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ProjectSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    code: {
        type: String,
        required: true,
        unique: [true],
    },
    clientId: { type: Schema.Types.ObjectId, ref: 'clients' },
    color: {
        type: String,
        required: false,
    },
    note: {
        type: String,
        required: false,
    },
    billable: {
        type: Boolean,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: false,
        default: true,
    },
});

export default ProjectSchema;
