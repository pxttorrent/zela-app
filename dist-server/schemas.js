"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.ChallengeSchema = exports.TrackerSchema = exports.BabySchema = exports.LoginSchema = exports.SignupSchema = void 0;
var zod_1 = require("zod");
// --- Schemas ---
exports.SignupSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});
exports.LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Email inválido"),
    password: zod_1.z.string().min(1, "Senha é obrigatória")
});
exports.BabySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Nome do bebê é obrigatório"),
    birthDate: zod_1.z.string().refine(function (date) { return !isNaN(Date.parse(date)); }, {
        message: "Data de nascimento inválida (formato YYYY-MM-DD esperado)"
    }),
    gender: zod_1.z.string().optional() // Permite string genérica por enquanto para compatibilidade, mas idealmente seria enum
});
exports.TrackerSchema = zod_1.z.object({
    type: zod_1.z.enum(['feed', 'sleep', 'diaper', 'bath', 'tummy', 'pump', 'meds', 'symptom']), // Adicionei tipos extras que podem existir
    timestamp: zod_1.z.number().int().positive(),
    babyId: zod_1.z.union([zod_1.z.string(), zod_1.z.number()])
});
exports.ChallengeSchema = zod_1.z.object({
    challengeId: zod_1.z.number().int(),
    xp: zod_1.z.number().int().positive(),
    babyId: zod_1.z.union([zod_1.z.string(), zod_1.z.number()])
});
// --- Middleware ---
var validateBody = function (schema) { return function (req, res, next) {
    var _a;
    try {
        schema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            var firstError = (_a = error.issues) === null || _a === void 0 ? void 0 : _a[0];
            var message = (firstError === null || firstError === void 0 ? void 0 : firstError.message) || 'Erro de validação';
            return res.status(400).json({
                error: message,
                details: error.issues
            });
        }
        return res.status(400).json({ error: 'Dados inválidos' });
    }
}; };
exports.validateBody = validateBody;
