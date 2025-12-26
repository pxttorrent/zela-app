import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

// --- Schemas ---

export const SignupSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres")
});

export const LoginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória")
});

export const BabySchema = z.object({
  name: z.string().min(1, "Nome do bebê é obrigatório"),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Data de nascimento inválida (formato YYYY-MM-DD esperado)"
  }),
  gender: z.string().optional(), // Permite string genérica por enquanto para compatibilidade, mas idealmente seria enum
  focusAreas: z.array(z.string()).optional()
});

export const TrackerSchema = z.object({
  type: z.enum(['feed', 'sleep', 'diaper', 'bath', 'tummy', 'pump', 'meds', 'symptom']), // Adicionei tipos extras que podem existir
  timestamp: z.number().int().positive(),
  babyId: z.union([z.string(), z.number()])
});

export const ChallengeSchema = z.object({
  challengeId: z.number().int(),
  xp: z.number().int().positive(),
  babyId: z.union([z.string(), z.number()])
});

export const ChatLogSchema = z.object({
  messageUser: z.string().min(1),
  messageBot: z.string().min(1),
  sentiment: z.string().optional(),
  babyId: z.union([z.string(), z.number()]).optional()
});

export const MilestoneSchema = z.object({
  templateId: z.number().int(),
  achievedAt: z.string().refine((date) => !isNaN(Date.parse(date)), "Data inválida"),
  notes: z.string().optional(),
  babyId: z.union([z.string(), z.number()])
});

// --- Middleware ---

export const validateBody = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues?.[0];
      const message = firstError?.message || 'Erro de validação';
      return res.status(400).json({ 
        error: message,
        details: error.issues 
      });
    }
    return res.status(400).json({ error: 'Dados inválidos' });
  }
};
