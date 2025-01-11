import express from "express";
import { z } from "zod";
import { organizationSchema, userSchema } from "../validation/schemas.js";
import Organization from "../models/organization.js";
import User from "../models/user.js";

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
