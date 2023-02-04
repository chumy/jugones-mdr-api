import {config} from 'dotenv'

config()

export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE; 
export const DB_HOST = process.env.DB_HOST;
export const DB_PORT = process.env.DB_PORT;
export const SECRET = process.env.SECRET;
export const PORT = process.env.PORT;
export const ROLE_ADMIN = process.env.ROLE_ADMIN;
export const ROLE_RESPONSABLE= process.env.ROLE_RESPONSABLE;
export const ROLE_SOCI= process.env.ROLE_SOCI;
export const ROLE_USER= process.env.ROLE_USER;