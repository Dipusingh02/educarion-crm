import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import pkg from "validator";
const { isEmail } = pkg;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name"],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Please enter your userId"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please enter your email"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    mobile:{
    type:Number,
    required:true,

    },
    password: {
        type: String,
        required: [true, "Please enter your password"],
        minlength: [6, "Minimum password length is 6 characters"],
    },
    confirmpassword: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: ["admin", "faculty", "accounts", "Hod", "student", "parent", "classTeacher", "subjectTeacher"],
        default: "student",
    },
    country: {
        type: String,
        default: "",
        trim: true,
    },
    state: {
        type: String,
        default: "",
        trim: true,
    },
    pincode: {
        type: String,
        default: "",
        trim: true,
    },
    profilePhoto: {
        type: String,
        default: "",
        trim: true,
    },
    course:{
        type: String,
        default: "",
        trim: true,
    },
    classSection: {
        type: String,
        default: function(){
            return this.role === "student" ? "" : null;
        },
        trim: true,
    },
    subjects: {
        type: [String],  // Array of subjects, for students (multiple subjects)
        default: [],
        validate: {
            validator: function(v) {
                if (this.role === 'subjectTeacher' || this.role === 'faculty') {
                    return v.length <= 3;
                }
                return true; 
            },
            message: 'A teacher can have a maximum of 2 subjects only.',
        }
    },
    department: {
        type: String,  
        default: "",
        trim: true,
    },
    createdDatetime: {
        type: Date,
        default: Date.now,
    },
    timetable: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Timetable", 
        required: false,  
    }],
    attendance: {
        type: [{
            date: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['Present', 'Absent', 'Leave'],
                default: 'Present'
            }
        }],
        default: []
    },
    fees: {
        type: Number,
        required:function() {
            return this.role === "student";
        },  
                default: 0,
    },
    salary:{
        type: Number,
        required: function() {
            return this.role === "faculty, accounts,admin";
        },
        default:0,
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: function() {
            return this.role === "student";
        },
    },
    organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organization',
        required: true,
    },
});

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
