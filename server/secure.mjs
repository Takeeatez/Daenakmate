// Signaling only. Game credentials travel through the browser DataChannel.
const secureFailure=(status,message)=>{throw Object.assign(new Error(message),{status})};
function secureDescription(value,type){
 if(!value||Object.keys(value).sort().join(',')!=='sdp,type'||value.type!==type||typeof value.sdp!=='string'||value.sdp.length>12000||!value.sdp.startsWith('v=0')||!value.sdp.includes('m=application ')||!value.sdp.includes('a=fingerprint:sha-256 '))secureFailure(400,'보안 연결 정보를 확인해주세요.');
 return value.sdp;
}
export async function secureRoute(request,orderId,b,{db,user,role,guest,limit,operatorEmails,ownerEmail}){
 const order=await db.prepare('SELECT * FROM orders WHERE id = ?').bind(orderId).first();
 const side=request.method==='GET'?new URL(request.url).searchParams.get('side'):b.side;
 const own=!!order&&(order.user_id===user?.id||order.customer_type==='guest'&&guest?.guest_order_id===order.id);
 const operator=!!order&&role.isAdmin&&(!order.assigned_to||order.assigned_to===user?.email||role.isOwner);
 if(!order||!['customer','operator'].includes(side)||side==='customer'&&!own||side==='operator'&&!operator)secureFailure(404,'접근할 수 없는 신청입니다.');
 if(['cancelled','refunded','completed','refund_pending'].includes(order.status))secureFailure(409,'보안 전달이 종료된 신청입니다.');
 const now=new Date().toISOString();await db.prepare('DELETE FROM secure_connections WHERE expires_at <= ?').bind(now).run();
 let room=await db.prepare('SELECT * FROM secure_connections WHERE order_id = ?').bind(orderId).first();
 if(room?.operator_email&&(!operatorEmails.includes(room.operator_email)||order.assigned_to&&room.operator_email!==order.assigned_to&&room.operator_email!==ownerEmail)){await db.prepare('DELETE FROM secure_connections WHERE order_id=?').bind(orderId).run();room=null}
 const response=()=>Response.json({session:room?{id:room.id,operator:room.operator_email||'',expiresAt:room.expires_at,...(side==='operator'?{offer:{type:'offer',sdp:room.offer}}:{answer:room.answer?{type:'answer',sdp:room.answer}:null})}:null},{headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
 if(request.method==='GET')return response();
 if(request.method!=='POST')secureFailure(405,'지원하지 않는 보안 연결 요청입니다.');
 const allowed=b.action==='start'?['action','side','description']:b.action==='answer'?['action','side','id','description']:['action','side','id'];
 if(Object.keys(b).some(k=>!allowed.includes(k)))secureFailure(400,'게임 로그인 정보는 서버로 전송할 수 없습니다.');
 if(b.action==='start'){
  if(side!=='customer')secureFailure(403,'신청자만 연결을 시작할 수 있습니다.');await limit(db,'secure-start',orderId,10,300);
  const offer=secureDescription(b.description,'offer'),id=crypto.randomUUID(),expiry=new Date(Date.now()+300000).toISOString();
  await db.prepare('INSERT INTO secure_connections (order_id,id,offer,created_at,expires_at) VALUES (?,?,?,?,?) ON CONFLICT(order_id) DO UPDATE SET id=excluded.id,offer=excluded.offer,answer=NULL,operator_email=NULL,created_at=excluded.created_at,expires_at=excluded.expires_at').bind(orderId,id,offer,now,expiry).run();
 }else{
  if(!room||b.id!==room.id)secureFailure(409,'연결이 만료됐습니다. 다시 연결해주세요.');
  if(b.action==='answer'){
   if(side!=='operator')secureFailure(403,'담당자만 연결을 수락할 수 있습니다.');const answer=secureDescription(b.description,'answer');
   const result=await db.prepare('UPDATE secure_connections SET answer=?,operator_email=? WHERE order_id=? AND id=? AND (operator_email IS NULL OR operator_email=?)').bind(answer,user.email,orderId,room.id,user.email).run();
   if(!result.meta.changes)secureFailure(409,'다른 담당자가 이미 연결했습니다.');
  }else if(b.action==='close'){
   if(side==='operator'&&room.operator_email!==user.email)secureFailure(403,'연결된 담당자만 종료할 수 있습니다.');
   await db.prepare('DELETE FROM secure_connections WHERE order_id=? AND id=?').bind(orderId,room.id).run();
  }else secureFailure(400,'보안 연결 작업을 확인해주세요.');
 }
 room=await db.prepare('SELECT * FROM secure_connections WHERE order_id = ?').bind(orderId).first();return response();
}
