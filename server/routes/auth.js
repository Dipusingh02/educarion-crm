import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import User from '../models/user.js';
import { applyMiddleware } from '../middleware/auth.js';
import {requireAdmin} from '../middleware/auth.js';
import { upload } from '../middleware/fileUpload.js';
import { userSchema } from '../validation/schemas.js';

const router = express.Router();
dotenv.config();


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

router.post("/admin/register-user", applyMiddleware, requireAdmin,async (req, res) => {
    const { name, username, password, role } = req.body;
    try {

        const allowedRoles = ["admin", "faculty", "accounts", "Hod", "student", "parent", "classTeacher", "subjectTeacher"];
        if (!allowedRoles.includes(role)) {
            return res.status(400).json({ error: "Invalid role specified" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const saltValue = 10;
        const hashedPassword = await bcrypt.hash(password, saltValue);

        const user = new User({
            name,
            username,
            password: hashedPassword,
            role,
        });

        await user.save();
        res.status(201).json({ message: "User Created Successfully" });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ error: "Error, user not created" });
    }
});

// Route: Upload Excel File and Auto-Fill Data
router.post("/admin/upload-excel-register-user", applyMiddleware,requireAdmin, upload.single("file"), async (req, res) => {
    try {
        const filePath = req.file.path;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

        let createdCount = 0;
        let skippedCount = 0;

        for (const row of data) {
            const { name, username, password, role } = row;

            if (!name || !username || !password || !role) {
                skippedCount++;
                console.log(`Skipping row with missing fields: ${JSON.stringify(row)}`);
                continue;
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                skippedCount++;
                console.log(`User with email ${username} already exists, skipping...`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                username,
                password: hashedPassword,
                role,
            });

            await newUser.save();
            createdCount++;
        }

        res.status(200).json({
            message: "Excel data processed successfully",
            createdCount,
            skippedCount,
        });
    } catch (error) {
        console.error("Error processing Excel file:", error.message);
        res.status(500).json({ error: "Error processing Excel file" });
    }
});

// Route: User Registration based individual user factuly or student
// student registration
router.post("/admin/register/student", applyMiddleware,requireAdmin, async (req, res) => {
    const { name, username,email,mobile, password, course, classSection} = req.body;
    try{
        const existingUser =await User.findOne({username});
        if(existingUser){
            return res.status(400).json({error: "User already exists"});
        }
        const saltValue = 10;
        const hashedPassword = await bcrypt.hash(password, saltValue);
        const user = new User({
            name,
            username,
            email,
            mobile,
            password: hashedPassword,
            role: "student",
            course,
            classSection,
            });
            await user.save();
            res.status(201).json({message: "Student Created Successfully"});
    }catch(error){
        console.error("Error creating student:", error.message);
        res.status(500).json({error: "Error, student not created"});

    }
});
router.post("/admin/register/faculty", applyMiddleware,requireAdmin, async (req, res) => {
    const {name, username, password, department, subject,salary,} = req.body;
    try{
        const existingUser = await User.findOne({username});
        if(existingUser){
            return res.status(400).json({
                error:"User already exists"
            })}
            const saltValue = 10;
            const hashedPassword = await bcrypt.hash(password, saltValue);
            const user = new User({
                name, 
                username,
                password:hashedPassword,
                roles: roles || ["faculty"],
                department,
                subject,
                salary,
            });
                await user.save();
                res.status(201).json({
                    message:"Faculty Created Successfully"
                });

    }catch(error){
        console.error("Error creating faculty:", error.message);
        res.status(500).json({error: "Error, faculty not created"});
    }
});



router.post("/login", async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).send("Please fill all the fields");
        }

        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).send("User not found");
        }

        console.log("Existing User Password: ", existingUser.password);
        console.log("Input Password: ", password);

        const matchPassword = await bcrypt.compare(password, existingUser.password);
        console.log("Match Password: ", matchPassword);

        if (!matchPassword) {
            return res.status(400).json({ message: "Invalid Password" });
        }

        const userId = existingUser._id;
        const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({
            message: "User logged in successfully",
            token: accessToken,
            userId,
            name: existingUser.name
        });
    } catch (error) {
        res.status(403).json({ message: "Invalid email or password", error: error.message });
    }
});
// Forget Password route
router.post("/forget-password", async (req, res) => {
    const { username, newPassword } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const saltValue = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltValue);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to reset password", error: error.message });
    }
});

router.post("/forget-password-linkusername", async (req, res) => {
    const { username } = req.body;

    try {
        // Find the user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate reset token
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "15m" });
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Send reset link (if email exists)
        if (user.email) {
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: user.email, // Use the user's email
                subject: "Reset Your Password",
                text: `Click the link to reset your password: ${resetLink}`,
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).json({ message: "Password reset link sent successfully" });
        }

        // If email is not available
        return res.status(400).json({ message: "User has no registered email to send reset link." });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(500).json({ message: "Failed to send reset link", error: error.message });
    }
});


// profile update by the user 



export default router;
