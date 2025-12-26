"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var isProduction = process.env.NODE_ENV === 'production';
exports.config = {
    jwtSecret: process.env.JWT_SECRET || 'zela-secret-dev-key',
    isProduction: isProduction,
    databaseUrl: process.env.DATABASE_URL,
};
if (isProduction && exports.config.jwtSecret === 'zela-secret-dev-key') {
    console.warn('⚠️ WARNING: Running in production with default JWT secret. Set JWT_SECRET environment variable.');
}
