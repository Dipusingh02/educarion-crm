import User from "../models/user.js"
import { hashedPassword } from "./authService.js"

export const createUser = async(userData) =>{
    const {name,username,password,role} = userData;
    const allowedRoles = ["admin", "faculty", "accounts", "Hod", "student", "parent", "classTeacher", "subjectTeacher"];
    if (!allowedRoles.includes(role)) {
        return res.status(400).json({ error: "Invalid role specified" });
    }
    const existingUser =await User.findOne({username});
if(existingUser){
    return res.status(400).json({
        error:"User already exists"
    })
}
const hashedPassword = await hashedPassword(password);
const user =new User({
    name,username,password:hashedPassword,role
});
await user.save();
}

export const getUserByUsername = async (username) => {
    return await User.findOne({ username });
};

export const updateUser = async (userId, updateData) => {
    return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

export const deleteUser = async (userId) => {
    return await User.findByIdAndDelete(userId);
};

export const createStudent = async (studentData) => {
    const { name, username, email, mobile, password, course, classSection } = studentData;
    const hashedPassword = await hashPassword(password);
    const student = new User({
        name,
        username,
        email,
        mobile,
        password: hashedPassword,
        role: "student",
        course,
        classSection,
    });

    await student.save();

};
export const createFaculty = async (facultyData) => {
    const { name, username, password, department, subject, salary } = facultyData;

    const hashedPassword = await hashPassword(password);
    const faculty = new User({
        name,
        username,
        password: hashedPassword,
        role: "faculty",
        department,
        subject,
        salary,
    });

    await faculty.save();
  
};

