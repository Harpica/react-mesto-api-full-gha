import dotenv from 'dotenv';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || '';
export const CLIENT_URL = NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:3000';
export const PORT = process.env.APP_PORT || 3000;
export const DATABASE_PORT = process.env.DATABASE_PORT || 27017;
export const DATABASE_NAME = process.env.DATABASE_NAME || 'mestodb';
export const JWT_KEY = process.env.JWT_KEY || 'secret key';
