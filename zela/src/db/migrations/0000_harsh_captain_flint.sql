CREATE TYPE "public"."category" AS ENUM('motor', 'cognitivo', 'nutricao', 'sono', 'afeto', 'saude_mae');--> statement-breakpoint
CREATE TABLE "babies" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"birth_date" date NOT NULL,
	"gender" text,
	"photo_color" text DEFAULT 'bg-rose-200',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "baby_vaccines" (
	"id" serial PRIMARY KEY NOT NULL,
	"baby_id" integer NOT NULL,
	"template_id" integer NOT NULL,
	"due_date" date NOT NULL,
	"status" text DEFAULT 'pending',
	"taken_at" date
);
--> statement-breakpoint
CREATE TABLE "challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"category" "category" NOT NULL,
	"min_age_weeks" integer NOT NULL,
	"max_age_weeks" integer NOT NULL,
	"xp" integer DEFAULT 10
);
--> statement-breakpoint
CREATE TABLE "user_challenges" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"baby_id" integer NOT NULL,
	"challenge_id" integer NOT NULL,
	"status" text DEFAULT 'completed',
	"completed_at" timestamp DEFAULT now(),
	"feedback" text
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"full_name" text,
	"is_onboarded" boolean DEFAULT false,
	"points" integer DEFAULT 0,
	"streak" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "vaccine_templates" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"days_from_birth" integer NOT NULL,
	"is_mandatory" boolean DEFAULT true
);
--> statement-breakpoint
ALTER TABLE "babies" ADD CONSTRAINT "babies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baby_vaccines" ADD CONSTRAINT "baby_vaccines_baby_id_babies_id_fk" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baby_vaccines" ADD CONSTRAINT "baby_vaccines_template_id_vaccine_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."vaccine_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_baby_id_babies_id_fk" FOREIGN KEY ("baby_id") REFERENCES "public"."babies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_challenges" ADD CONSTRAINT "user_challenges_challenge_id_challenges_id_fk" FOREIGN KEY ("challenge_id") REFERENCES "public"."challenges"("id") ON DELETE no action ON UPDATE no action;