import { z } from "zod";

export const createBabySchema = z.object({
  name: z.string().trim().min(2, "Nome é obrigatório"),
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida")
    .refine((value) => {
      const date = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(date.getTime());
    }, "Data inválida"),
  gender: z.enum(["boy", "girl"], { message: "Selecione o gênero" }),
});

export type CreateBabySchemaInput = z.infer<typeof createBabySchema>;

