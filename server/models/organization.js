import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Organization name is required"],
        trim: true,
    },
    address: {
        type: String,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    createdDatetime: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model("Organization", organizationSchema);
