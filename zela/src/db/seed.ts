import { inArray } from "drizzle-orm";

import { db } from "./index";
import {
  categoryEnum,
  challenges,
  vaccineTemplates,
  type Challenge,
  type VaccineTemplate,
} from "./schema";

type VaccineSeed = Omit<VaccineTemplate, "id" | "isMandatory"> & {
  isMandatory?: boolean | null;
};

type ChallengeSeed = Omit<Challenge, "id">;

const vaccineSeed: VaccineSeed[] = [
  {
    name: "BCG",
    description: "Protege contra formas graves de tuberculose.",
    daysFromBirth: 0,
    isMandatory: true,
  },
  {
    name: "Hepatite B (1ª dose)",
    description: "Primeira dose ao nascer.",
    daysFromBirth: 0,
    isMandatory: true,
  },
  {
    name: "Penta (1ª dose)",
    description: "DTP + Hib + Hepatite B.",
    daysFromBirth: 60,
    isMandatory: true,
  },
  {
    name: "VIP (Poliomielite) (1ª dose)",
    description: "Vacina inativada contra poliomielite.",
    daysFromBirth: 60,
    isMandatory: true,
  },
  {
    name: "Rotavírus (1ª dose)",
    description: "Protege contra gastroenterite por rotavírus.",
    daysFromBirth: 60,
    isMandatory: true,
  },
];

const challengeSeed: ChallengeSeed[] = [
  {
    title: "Tummy Time",
    description: "Coloque o bebê de barriga para baixo por 2–3 minutos supervisionados.",
    category: "motor",
    minAgeWeeks: 0,
    maxAgeWeeks: 4,
    xp: 10,
  },
  {
    title: "Conversa Olho no Olho",
    description: "Faça contato visual e converse com o bebê por 2 minutos.",
    category: "cognitivo",
    minAgeWeeks: 0,
    maxAgeWeeks: 4,
    xp: 10,
  },
  {
    title: "Massagem Perninhas",
    description: "Faça uma massagem suave nas perninhas por 1–2 minutos.",
    category: "afeto",
    minAgeWeeks: 0,
    maxAgeWeeks: 4,
    xp: 10,
  },
];

async function seedVaccines() {
  const names = vaccineSeed.map((v) => v.name);
  const existing = await db
    .select({ name: vaccineTemplates.name })
    .from(vaccineTemplates)
    .where(inArray(vaccineTemplates.name, names));
  const existingSet = new Set(existing.map((v) => v.name));

  const toInsert = vaccineSeed
    .filter((v) => !existingSet.has(v.name))
    .map((v) => ({
      name: v.name,
      description: v.description ?? null,
      daysFromBirth: v.daysFromBirth,
      isMandatory: v.isMandatory ?? true,
    }));

  if (toInsert.length > 0) {
    await db.insert(vaccineTemplates).values(toInsert);
  }
}

async function seedChallenges() {
  const titles = challengeSeed.map((c) => c.title);
  const existing = await db
    .select({ title: challenges.title })
    .from(challenges)
    .where(inArray(challenges.title, titles));
  const existingSet = new Set(existing.map((c) => c.title));

  const toInsert = challengeSeed.filter((c) => !existingSet.has(c.title));

  if (toInsert.length > 0) {
    await db.insert(challenges).values(toInsert);
  }
}

async function validateCategoryEnum() {
  const categories = categoryEnum.enumValues;
  const invalid = challengeSeed
    .map((c) => c.category)
    .filter((cat) => !categories.includes(cat));

  if (invalid.length > 0) {
    throw new Error(`Invalid challenge categories: ${invalid.join(", ")}`);
  }
}

async function main() {
  await validateCategoryEnum();
  await seedVaccines();
  await seedChallenges();
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
