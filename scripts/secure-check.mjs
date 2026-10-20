import assert from 'node:assert/strict';
import {mkdtempSync,rmSync,readFileSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {tmpdir} from 'node:os';
import {TestDB} from './test-db.mjs';
import {handleApi,defaults} from '../server/api.mjs';
const dir=mkdtempSync(join(tmpdir(),'mate-secure-')),db=new TestDB(join(dir,'db.sqlite')),env={DB:db,OWNER_EMAIL:'owner@example.test'};
for(const migration of ['0000_live_orders','0001_members_guests','0002_order_requests','0003_secure_connections'])db.execute([],resolve('drizzle/'+migration+'.sql'));
const config={...defaults,terms:'LOCAL TEST',privacy:'LOCAL TEST',refund:'LOCAL TEST',pricingConfirmed:true,acceptingOrders:true,supportContact:'LOCAL',hours:'LOCAL',bankName:'LOCAL',bankAccount:'LOCAL',bankHolder:'LOCAL',operators:['operator@example.test']};delete config.version;
db.execute([{sql:'INSERT INTO shop_settings (id,data,version,updated_at) VALUES (1,?,1,?)',args:[JSON.stringify(config),new Date().toISOString()]}]);
async function call(who,path,method='GET',data,cookie=''){const headers={};if(who){headers['oai-authenticated-user-id']=who;headers['oai-authenticated-user-email']=who+'@example.test'}if(cookie)headers.cookie=cookie;if(method!=='GET'){headers.origin='https://mate.test';headers['content-type']='application/json'}const r=await handleApi(new Request('https://mate.test'+path,{method,headers,...(data?{body:JSON.stringify(data)}:{})}),env);return{status:r.status,data:await r.json(),cookie:r.headers.get('set-cookie')?.split(';')[0]||''}}
const offer={type:'offer',sdp:'v=0\r\nm=application 9 UDP/DTLS/SCTP webrtc-datachannel\r\na=fingerprint:sha-256 00:11\r\n'},answer={...offer,type:'answer'},base={requestKey:crypto.randomUUID(),name:'LOCAL TEST',phone:'01012345678',login:'once',service:'basic',coupon:'none',top:'yes',consent:true,policyVersion:1,usesOtp:true};
try{
const order=await call('customer','/api/orders','POST',base);assert.equal(order.status,201);assert.equal(order.data.order.usesOtp,true);const id=order.data.order.id,path='/api/secure/'+id;
assert.equal((await call(null,path+'?side=customer')).status,404);assert.equal((await call('stranger',path+'?side=customer')).status,404);assert.equal((await call('customer',path+'?side=operator')).status,404);
assert.equal((await call('customer',path,'POST',{action:'start',side:'customer',description:offer,gamePassword:'NEVER-STORE'})).status,400);
assert.equal((await call('customer','/api/orders','POST',{...base,requestKey:crypto.randomUUID(),gamePassword:'NEVER-STORE'})).status,400);
const started=await call('customer',path,'POST',{action:'start',side:'customer',description:offer});assert.equal(started.status,200);assert.equal('offer'in started.data.session,false);const roomId=started.data.session.id;
assert.equal((await call('operator',path+'?side=operator')).data.session.offer.sdp,offer.sdp);
assert.equal((await call('operator',path,'POST',{action:'answer',side:'operator',id:roomId,description:answer})).status,200);
assert.equal((await call('owner',path,'POST',{action:'answer',side:'operator',id:roomId,description:answer})).status,409);
assert.equal((await call('customer',path+'?side=customer')).data.session.operator,'operator@example.test');
await db.prepare('UPDATE orders SET assigned_to=? WHERE id=?').bind('owner@example.test',id).run();assert.equal((await call('customer',path+'?side=customer')).data.session,null);
await db.prepare('UPDATE orders SET assigned_to=NULL WHERE id=?').bind(id).run();const restart=await call('customer',path,'POST',{action:'start',side:'customer',description:offer});assert.notEqual(restart.data.session.id,roomId);
assert.equal((await call('operator',path,'POST',{action:'answer',side:'operator',id:roomId,description:answer})).status,409);
await db.prepare('UPDATE secure_connections SET expires_at=? WHERE order_id=?').bind('2000-01-01T00:00:00.000Z',id).run();assert.equal((await call('customer',path+'?side=customer')).data.session,null);
const guest=await call(null,'/api/guest/orders','POST',{...base,requestKey:crypto.randomUUID(),lookupPassword:'Local-lookup-123!'});assert.equal(guest.status,201);const guestPath='/api/secure/'+guest.data.order.id;
assert.equal((await call(null,guestPath,'POST',{action:'start',side:'customer',description:offer},guest.cookie)).status,200);assert.equal((await call('customer',guestPath+'?side=customer')).status,404);
const guestRoom=(await call(null,guestPath+'?side=customer','GET',null,guest.cookie)).data.session;assert.equal((await call(null,guestPath,'POST',{action:'close',side:'customer',id:guestRoom.id},guest.cookie)).status,200);
const columns=db.execute([{sql:'PRAGMA table_info(secure_connections)',args:[]}])[0].results.map(c=>c.name);assert.deepEqual(columns,['order_id','id','offer','answer','operator_email','created_at','expires_at']);assert.equal(readFileSync(db.file).includes(Buffer.from('NEVER-STORE')),false);
assert.equal(db.execute([{sql:'SELECT COUNT(*) AS n FROM secure_connections',args:[]}])[0].results[0].n,0);
console.log('PASS: OTP order metadata, member/guest isolation, operator-only signaling, single receiver lease, stale session rejection, revocation, expiry, cleanup, and credential rejection.');
}finally{const absolute=resolve(dir);assert.ok(absolute.startsWith(resolve(tmpdir()))&&absolute.includes('mate-secure-'));rmSync(absolute,{recursive:true,force:true})}
