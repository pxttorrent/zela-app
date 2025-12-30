import { relations } from "drizzle-orm";
import {
  boolean,
  date,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const categoryEnum = pgEnum("category", [
  "motor",
  "cognitivo",
  "nutricao",
  "sono",
  "afeto",
  "saude",
  "saude_mae",
]);

export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  isOnboarded: boolean("is_onboarded").default(false),
  points: integer("points").default(0),
  streak: integer("streak").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const babies = pgTable("babies", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  name: text("name").notNull(),
  birthDate: date("birth_date").notNull(),
  gender: text("gender"),
  photoColor: text("photo_color").default("bg-rose-200"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: categoryEnum("category").notNull(),
  minAgeWeeks: integer("min_age_weeks").notNull(),
  maxAgeWeeks: integer("max_age_weeks").notNull(),
  xp: integer("xp").default(10),
});

export const userChallenges = pgTable("user_challenges", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id)
    .notNull(),
  babyId: integer("baby_id")
    .references(() => babies.id)
    .notNull(),
  challengeId: integer("challenge_id")
    .references(() => challenges.id)
    .notNull(),
  status: text("status").default("completed"),
  completedAt: timestamp("completed_at").defaultNow(),
  feedback: text("feedback"),
});

export const vaccineTemplates = pgTable("vaccine_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  daysFromBirth: integer("days_from_birth").notNull(),
  isMandatory: boolean("is_mandatory").default(true),
});

export const babyVaccines = pgTable("baby_vaccines", {
  id: serial("id").primaryKey(),
  babyId: integer("baby_id")
    .references(() => babies.id)
    .notNull(),
  templateId: integer("template_id")
    .references(() => vaccineTemplates.id)
    .notNull(),
  dueDate: date("due_date").notNull(),
  status: text("status").default("pending"),
  takenAt: date("taken_at"),
});

export const usersRelations = relations(users, ({ many }) => ({
  babies: many(babies),
  userChallenges: many(userChallenges),
}));

export const babiesRelations = relations(babies, ({ one, many }) => ({
  user: one(users, {
    fields: [babies.userId],
    references: [users.id],
  }),
  userChallenges: many(userChallenges),
  vaccines: many(babyVaccines),
}));

export const challengesRelations = relations(challenges, ({ many }) => ({
  userChallenges: many(userChallenges),
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
  user: one(users, {
    fields: [userChallenges.userId],
    references: [users.id],
  }),
  baby: one(babies, {
    fields: [userChallenges.babyId],
    references: [babies.id],
  }),
  challenge: one(challenges, {
    fields: [userChallenges.challengeId],
    references: [challenges.id],
  }),
}));

export const vaccineTemplatesRelations = relations(
  vaccineTemplates,
  ({ many }) => ({
    babyVaccines: many(babyVaccines),
  }),
);

export const babyVaccinesRelations = relations(babyVaccines, ({ one }) => ({
  baby: one(babies, {
    fields: [babyVaccines.babyId],
    references: [babies.id],
  }),
  template: one(vaccineTemplates, {
    fields: [babyVaccines.templateId],
    references: [vaccineTemplates.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Baby = typeof babies.$inferSelect;
export type NewBaby = typeof babies.$inferInsert;

export type Challenge = typeof challenges.$inferSelect;
export type NewChallenge = typeof challenges.$inferInsert;

export type UserChallenge = typeof userChallenges.$inferSelect;
export type NewUserChallenge = typeof userChallenges.$inferInsert;

export type VaccineTemplate = typeof vaccineTemplates.$inferSelect;
export type NewVaccineTemplate = typeof vaccineTemplates.$inferInsert;

export type BabyVaccine = typeof babyVaccines.$inferSelect;
export type NewBabyVaccine = typeof babyVaccines.$inferInsert;
