CREATE TABLE shop_settings (id INTEGER PRIMARY KEY, data TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 0, updated_at TEXT NOT NULL);
--> statement-breakpoint
CREATE TABLE orders (id TEXT PRIMARY KEY, user_id TEXT NOT NULL, customer_email TEXT NOT NULL, name TEXT NOT NULL, phone TEXT NOT NULL, service TEXT NOT NULL, coupon TEXT NOT NULL, top TEXT NOT NULL, price INTEGER NOT NULL CHECK(price >= 0), status TEXT NOT NULL CHECK(status IN ('awaiting_payment','queued','awaiting_auth','processing','completed','cancelled','refund_pending','refunded')), request_key TEXT NOT NULL, policy_version INTEGER NOT NULL, policy_snapshot TEXT NOT NULL, assigned_to TEXT, paid_at TEXT, payment_reported INTEGER NOT NULL DEFAULT 0, version INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(user_id, request_key));
--> statement-breakpoint
CREATE INDEX orders_user_created ON orders(user_id, created_at);
--> statement-breakpoint
CREATE INDEX orders_status_created ON orders(status, created_at);
--> statement-breakpoint
CREATE TABLE audit_log (id TEXT PRIMARY KEY, actor TEXT NOT NULL, action TEXT NOT NULL, order_id TEXT, detail TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
--> statement-breakpoint
CREATE INDEX audit_created ON audit_log(created_at);
