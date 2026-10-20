CREATE TABLE members (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE COLLATE NOCASE, display_name TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '', password_hash TEXT NOT NULL, password_salt TEXT NOT NULL, password_iterations INTEGER NOT NULL, created_at TEXT NOT NULL, last_login_at TEXT NOT NULL, policy_version INTEGER NOT NULL DEFAULT 0);
--> statement-breakpoint
CREATE TABLE auth_sessions (token_hash TEXT PRIMARY KEY, member_id TEXT, guest_order_id TEXT, created_at TEXT NOT NULL, expires_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX auth_sessions_expiry ON auth_sessions(expires_at);
--> statement-breakpoint
CREATE INDEX auth_sessions_member ON auth_sessions(member_id);
--> statement-breakpoint
CREATE TABLE auth_rate_limits (key TEXT PRIMARY KEY, attempts INTEGER NOT NULL DEFAULT 0, window_start INTEGER NOT NULL);
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN customer_type TEXT NOT NULL DEFAULT 'member';
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN guest_password_hash TEXT;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN guest_password_salt TEXT;
--> statement-breakpoint
ALTER TABLE orders ADD COLUMN guest_password_iterations INTEGER;
--> statement-breakpoint
CREATE UNIQUE INDEX orders_guest_request_key ON orders(request_key) WHERE customer_type = 'guest';
