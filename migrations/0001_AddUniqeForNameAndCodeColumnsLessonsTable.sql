ALTER TABLE "lessons" ADD CONSTRAINT "lessons_name_unique" UNIQUE("name");--> statement-breakpoint
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_code_unique" UNIQUE("code");