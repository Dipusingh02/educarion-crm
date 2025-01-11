import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const hashedPassword =async(password)=>{
    const saltValue=10;
    return await bcrypt.hash(password,saltValue);
}

export const comparePassword =async(password,hashedPassword)=>{
    return await bcrypt.compare(password,hashedPassword);
}

export const generateToken = (payload, secret, options = { expiresIn: '1h' }) => {
    return jwt.sign(payload, secret, options);
};

export const verifyToken =(token,secret)=>{
    return jwt.verify(token,secret);
}