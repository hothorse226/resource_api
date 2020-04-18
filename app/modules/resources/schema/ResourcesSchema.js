import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ResourcesSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    nickName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: [true],
    },
    password: {
        type: String,
        required: false,
    },
    clientId: {
        type: Array,
        required: false,
    },
    projectId: {
        type: Array,
        required: false,
    },
    timeZone: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    note: {
        type: String,
        required: false,
    },
    position: {
        type: String,
        required: false,
    },
    timeAllocation: {
        type: String,
        required: false,
    },
    billable: {
        type: Boolean,
        required: false,
    },
    availability: [
        {
            key: String,
            _id: String,
            value: [
                {
                    from: String,
                    to: String,
                    _id: String,
                },
            ],
        },
    ],
    permission: {
        type: Number,
        required: false,
    },
    contractor_employee: {
        type: Array,
        required: false,
    },
    department: {
        type: Array,
        required: false,
    },
    jobTitle: {
        type: String,
        required: false,
    },
    skills: {
        type: Array,
        required: false,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    },
    bookable: {
        type: Boolean,
        required: false,
        default: true,
    },
    invitePerson: {
        type: Boolean,
        required: false,
        default: true,
    },
});

export default ResourcesSchema;
