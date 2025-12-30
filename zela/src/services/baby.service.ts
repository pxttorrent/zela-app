import { addDays, format, parseISO } from "date-fns";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  babies,
  babyVaccines,
  users,
  vaccineTemplates,
  type Baby,
  type NewBaby,
} from "@/db/schema";

export type CreateBabyInput = Pick<NewBaby, "name" | "birthDate" | "gender">;
export type EnsureUserInput = Pick<
  typeof users.$inferInsert,
  "id" | "email" | "fullName"
>;

function buildDueDate(birthDate: string, daysFromBirth: number): string {
  const date = addDays(parseISO(birthDate), daysFromBirth);
  return format(date, "yyyy-MM-dd");
}

export async function ensureUser(input: EnsureUserInput) {
  await db
    .insert(users)
    .values({
      id: input.id,
      email: input.email,
      fullName: input.fullName ?? null,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        email: input.email,
        fullName: input.fullName ?? null,
      },
    });
}

export async function createBaby(userId: string, data: CreateBabyInput): Promise<Baby> {
  return db.transaction(async (tx) => {
    const [baby] = await tx
      .insert(babies)
      .values({
        userId,
        name: data.name,
        birthDate: data.birthDate,
        gender: data.gender ?? null,
      })
      .returning();

    if (!baby) {
      throw new Error("Failed to create baby");
    }

    const templates = await tx.select().from(vaccineTemplates);

    if (templates.length > 0) {
      const vaccinesToInsert = templates.map((template) => ({
        babyId: baby.id,
        templateId: template.id,
        dueDate: buildDueDate(baby.birthDate, template.daysFromBirth),
        status: "pending",
        takenAt: null,
      }));

      await tx.insert(babyVaccines).values(vaccinesToInsert);
    }

    await tx
      .update(users)
      .set({ isOnboarded: true })
      .where(eq(users.id, userId));

    return baby;
  });
}
