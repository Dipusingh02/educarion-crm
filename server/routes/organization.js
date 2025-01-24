import express from "express";
import { z } from "zod";
import { organizationSchema, userSchema } from "../validation/schemas.js";
import Organization from "../models/organization.js";
import User from "../models/user.js";
import * as authService from '../services/authService.js';

const router = express.Router();
 
router.post("/register-organization", async (req, res) => {
    try {
        const data = organizationSchema.parse(req.body);

        const existingOrganization = await Organization.findOne({ email: data.email });
        if (existingOrganization) {
            return res.status(400).json({ error: "Organization already exists" });
        }

        const organization = new Organization(data);
        const savedOrganization = await organization.save();

        res.status(201).json({ message: "Organization registered successfully", organization: savedOrganization });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
});
router.get("/organization", async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.get("/organization/:id", async (req, res) => {
    try {
        const organization = await Organization.findById(req.params.id);
        if (!organization) {
            return res.status(404).json({ error: "Organization not found" });
        }
        res.status(200).json(organization);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post("/login-organisation", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if email and password are provided
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required." });
        }

        // Find organization by email
        const existingOrganization = await Organization.findOne({ email });
        if (!existingOrganization) {
            return res.status(400).json({ error: "Organization not found." });
        }

        // Verify password
        const isPasswordMatch = await authService.comparePassword(password, existingOrganization.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ error: "Invalid password." });
        }

        // Generate token
        const token = await authService.generateToken(existingOrganization._id, process.env.JWT_SECRET_KEY);

        // Respond with success
        res.status(200).json({
            message: "Organization logged in successfully.",
            token,
            organizationId: existingOrganization._id,
            name: existingOrganization.name,
            role: existingOrganization.role,
        });
    } catch (error) {
        // Log and handle internal server errors
        console.error("Error during login:", error.message);
        res.status(500).json({ error: "Internal server error." });
    }
});


router.post("/organisation/register-user-admin", async (req, res) => {
    try {
        const data = userSchema.parse(req.body);

        const existingUser = await User.findOne({ username: data.username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        if (data.confirmpassword && data.password !== data.confirmpassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        data.role = "admin"; 

        const user = new User(data);
        
        const savedUser = await user.save();

        res.status(201).json({ message: "User registered successfully", user: savedUser });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return res.status(400).json({ errors: error.errors });
        }
        res.status(500).json({ error: error.message });
    }
});


export default router;
