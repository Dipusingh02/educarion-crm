import * as userService from '../services/userService.js';
import XLSX from 'xlsx';
import fs from 'fs';
// Register a new user
export const registerUser = async (req, res) => {
    const { name, username, password, role } = req.body;

    try {
        const result = await userService.createUser({ name, username, password, role });
        res.status(201).json({ result });
    } catch (error) {
        console.error("Error creating user:", error.message);
        res.status(500).json({ error: "Error, user not created" });
    }
};

// Get a user by username
export const getUser = async (req, res) => {
    const username = req.params.username;

    try {
        const result = await userService.getUserByUsername(username);
        res.status(200).json({ result });
    } catch (error) {
        console.error("Error getting user:", error.message);
        res.status(500).json({ error: "Error, user not found" });
    }
};

// Update a user
export const updateUser = async (req, res) => {
    const userId = req.params.userId;
    const updateData = req.body;

    try {
        const result = await userService.updateUser(userId, updateData);
        res.status(200).json({ result });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({ error: "Error, user not updated" });
    }
};

// Delete a user
export const deleteUser = async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await userService.deleteUser(userId);
        res.status(200).json({ result });
    } catch (error) {
        console.error("Error deleting user:", error.message);
        res.status(500).json({ error: "Error, user not deleted" });
    }
};

// Register a new student
export const registerStudent = async (req, res) => {
    const studentData = req.body;

    try {
        const result = await userService.createStudent(studentData);
        res.status(201).json({ result });
    } catch (error) {
        console.error("Error creating student:", error.message);
        res.status(500).json({ error: "Error, student not created" });
    }
};

// Register a new faculty
export const registerFaculty = async (req, res) => {
    const facultyData = req.body;

    try {
        const result = await userService.createFaculty(facultyData);
        res.status(201).json({ result });
    } catch (error) {
        console.error("Error creating faculty:", error.message);
        res.status(500).json({ error: "Error, faculty not created" });
    }
};

export const uploadExcelRegisterUser = async (req, res) => {
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

            const existingUser = await userService.getUserByUsername(username);
            if (existingUser) {
                skippedCount++;
                console.log(`User with username ${username} already exists, skipping...`);
                continue;
            }

            const hashedPassword = await userService.hashPassword(password);
            await userService.createUser({ name, username, password: hashedPassword, role });
            createdCount++;
        }

        fs.unlinkSync(filePath);
        res.status(200).json({
            message: "Excel data processed successfully",
            createdCount,
            skippedCount,
        });
    } catch (error) {
        console.error("Error processing Excel file:", error.message);
        res.status(500).json({ error: "Error processing Excel file" });
    }
};