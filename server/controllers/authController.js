import * as userService from '../services/userService.js';
import * as authService from '../services/authService.js';

export const loginUser = async (req, res) => {
    const { username, password } = req.body;
try{
    if(!username || !password){
        return res.status(400).json({error:"Username and password required"});
    }
    const existingUser = await userService.getUserByUsername(username);
    if(!existingUser){
        return res.status(400).json({error:"User not found"});
    }
    const IsPasswordMatch = await authService.comparePassword(password, existingUser.password);
    if(!IsPasswordMatch){
        return res.status(400).json({error:"Invalid Password"});
    }
    const token = await authService.generateToken(existingUser._id,process.env.JWT_SECRET_KEY);
    res.status(200).json({
        message: "User logged in successfully",
        token,
        userId: existingUser._id,
        name: existingUser.name,
        role: existingUser.role,
    });
} catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal server error" });

}
}

