ALTER TABLE "user_lessons_evaluations" ALTER COLUMN "evaluation_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "evaluations" ADD COLUMN "updated_at" timestamp DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE "user_lessons_evaluations" ADD COLUMN "created_at" timestamp DEFAULT now();