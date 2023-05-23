import dotenv from 'dotenv';

dotenv.config();

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
export const PORT = process.env.APP_PORT || 3000;
export const DATABASE_PORT = process.env.DATABASE_PORT || 27017;
export const DATABASE_NAME = process.env.DATABASE_NAME || 'mestodb';
export const JWT_KEY = process.env.JWT_KEY || 'secret key';
