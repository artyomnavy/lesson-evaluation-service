ALTER TABLE "user_lessons_evaluations" RENAME TO "user_active_lessons_evaluations";--> statement-breakpoint
ALTER TABLE "user_active_lessons_evaluations" DROP CONSTRAINT "user_lessons_evaluations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_active_lessons_evaluations" DROP CONSTRAINT "user_lessons_evaluations_active_lesson_id_active_lessons_id_fk";
--> statement-breakpoint
ALTER TABLE "user_active_lessons_evaluations" DROP CONSTRAINT "user_lessons_evaluations_evaluation_id_evaluations_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_active_lessons_evaluations" ADD CONSTRAINT "user_active_lessons_evaluations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_active_lessons_evaluations" ADD CONSTRAINT "user_active_lessons_evaluations_active_lesson_id_active_lessons_id_fk" FOREIGN KEY ("active_lesson_id") REFERENCES "public"."active_lessons"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_active_lessons_evaluations" ADD CONSTRAINT "user_active_lessons_evaluations_evaluation_id_evaluations_id_fk" FOREIGN KEY ("evaluation_id") REFERENCES "public"."evaluations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
