import mongoose from "mongoose";

const timetableSchema = new mongoose.Schema({
    day: {
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    startTime: {
        type: String,  
        required: true,
    },
    endTime: {
        type: String, 
        required: true,
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",  
        required: true,
    },
    classSection: {
        type: String,  
        required: true,
    }
});

export default mongoose.model("Timetable", timetableSchema);
