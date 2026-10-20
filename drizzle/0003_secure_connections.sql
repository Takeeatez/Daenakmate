ALTER TABLE orders ADD COLUMN uses_otp INTEGER NOT NULL DEFAULT 0;
--> statement-breakpoint
CREATE TABLE secure_connections (order_id TEXT PRIMARY KEY, id TEXT NOT NULL UNIQUE, offer TEXT NOT NULL, answer TEXT, operator_email TEXT, created_at TEXT NOT NULL, expires_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX secure_connections_expiry ON secure_connections(expires_at);
