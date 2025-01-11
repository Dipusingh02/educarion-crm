import { z } from "zod";

// Validation for Organization Registration
export const organizationSchema = z.object({
    name: z.string().min(1, "Organization name is required"),
    address: z.string().optional(),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
});

// Validation for User Registration
export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    mobile:z.number().min(10,"Number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmpassword: z.string().optional(),
    role: z.enum([
        "admin",
        "faculty",
        "accounts",
        "Hod",
        "student",
        "parent",
        "classTeacher",
        "subjectTeacher",
    ]),
    country: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    profilePhoto: z.string().optional(),
    class: z.string().optional(),
    subject: z.string().optional(),
    fees: z.number().optional(),
    parent: z.string().optional(),
    salary:z.string().optional(),

});
