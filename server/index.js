import mongoose from 'mongoose';
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js'; 
import authorganisationRoutes from './routes/organization.js';
import bodyParser from "body-parser";

const app = express();

dotenv.config({ path: "./config/.env" });
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.options('*', cors());
app.use('/', authRoutes); // Use the routes
app.use('/', authorganisationRoutes); // Use the routes

const port = process.env.PORT || 5000;
const connection = process.env.CONNECTION_STRING;

mongoose.connect(connection)
.then(() => {
    console.log('DB connected');
})
.catch((error) => {
    console.log('Database is not connected:', error.message);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
