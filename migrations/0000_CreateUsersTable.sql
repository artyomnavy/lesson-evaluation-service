CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(30) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
