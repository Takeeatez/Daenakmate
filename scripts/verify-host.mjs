import readline from 'node:readline';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
const lines=readline.createInterface({input:process.stdin,terminal:false});
process.stdout.write('Ready for private Site service credential on stdin.\n');
for await(const line of lines){const token=JSON.parse(line).token;const origin='https://nakchal-mate-demo.handyflame.chatgpt.site';const headers={'OAI-Sites-Authorization':'Bearer '+token};for(const path of ['/api/config','/api/me','/api/admin/orders']){const r=await fetch(origin+path,{headers});let body;try{body=await r.json()}catch{body={}}console.log(JSON.stringify({path,status:r.status,storageReady:body.storageReady,acceptingOrders:body.acceptingOrders,missing:body.missing,authenticated:!!body.user}));}break}lines.close();
