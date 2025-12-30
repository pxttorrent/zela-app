"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

import { createBaby, ensureUser } from "@/services/baby.service";
import { createBabySchema, type CreateBabySchemaInput } from "@/server/baby.schemas";

export async function createBabyAction(input: CreateBabySchemaInput) {
  const bypassUserId = process.env.DEV_BYPASS_AUTH_USER_ID;
  const bypassEmail = process.env.DEV_BYPASS_AUTH_EMAIL;

  let userId: string | null = null;

  try {
    const res = await auth();
    userId = res.userId;
  } catch {
    userId = null;
  }

  if (!userId && bypassUserId) {
    userId = bypassUserId;
  }

  if (!userId) {
    throw new Error("Unauthorized");
  }

  let email: string | undefined;
  let fullName: string | null | undefined;

  if (bypassEmail) {
    email = bypassEmail;
  } else {
    try {
      const user = await currentUser();
      email = user?.primaryEmailAddress?.emailAddress;
      fullName = user?.fullName ?? null;
    } catch {
      email = undefined;
      fullName = null;
    }
  }

  if (!email) {
    throw new Error("Missing user email");
  }

  await ensureUser({
    id: userId,
    email,
    fullName: fullName ?? null,
  });

  const data = createBabySchema.parse(input);
  const baby = await createBaby(userId, data);

  return { babyId: baby.id };
}
