CREATE TABLE IF NOT EXISTS "active_lessons" (
	"id" serial PRIMARY KEY NOT NULL,
	"lesson_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_lessons_evaluations" RENAME COLUMN "lesson_id" TO "active_lesson_id";--> statement-breakpoint
ALTER TABLE "user_lessons_evaluations" DROP CONSTRAINT "user_lessons_evaluations_lesson_id_lessons_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "active_lessons" ADD CONSTRAINT "active_lessons_lesson_id_lessons_id_fk" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_lessons_evaluations" ADD CONSTRAINT "user_lessons_evaluations_active_lesson_id_active_lessons_id_fk" FOREIGN KEY ("active_lesson_id") REFERENCES "public"."active_lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
