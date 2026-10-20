import {TestDB} from './test-db.mjs';
const db=new TestDB('.sites-runtime/local-orders.sqlite');
const now=new Date().toISOString(),rows=[['DM-AAA000000001','fixture-member-a','회원 예시 A','member-a@example.test','01000000000','queued',900],['DM-AAA000000002','fixture-member-a','회원 예시 A','member-a@example.test','01000000000','completed',1500],['DM-BBB000000001','fixture-member-b','회원 예시 B','member-b@example.test','01011111111','awaiting_payment',900]];
for(const[id,user,name,email,phone,status,price]of rows)await db.prepare('INSERT INTO orders (id,user_id,customer_email,name,phone,service,coupon,top,price,status,request_key,policy_version,policy_snapshot,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,user,email,name,phone,'basic','none','yes',price,status,crypto.randomUUID(),1,'{}',now,now).run();
console.log('Local member examples only; production database unchanged.');
