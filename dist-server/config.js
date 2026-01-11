"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var isProduction = process.env.NODE_ENV === 'production';
if (isProduction && !process.env.JWT_SECRET) {
    throw new Error('❌ FATAL: JWT_SECRET não definido em produção!');
}
if (isProduction && !process.env.DATABASE_URL) {
    throw new Error('❌ FATAL: DATABASE_URL não definido em produção!');
}
exports.config = {
    jwtSecret: process.env.JWT_SECRET || 'dev-only-secret-do-not-use-in-prod',
    isProduction: isProduction,
    databaseUrl: process.env.DATABASE_URL,
    jwtExpiresIn: '7d',
};
