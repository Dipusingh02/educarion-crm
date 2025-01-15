import axios from 'axios';
import dotenv from 'dotenv';
import { useNavigate } from 'react-router-dom';

const api = axios.create({
    baseURL:process.env.REACT_APP_API_URL
});