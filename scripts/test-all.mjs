import {spawnSync} from 'node:child_process';
for (const file of ['build.mjs','live-check.mjs','accounts-check.mjs','secure-check.mjs']) {
  const result=spawnSync(process.execPath,['scripts/'+file],{stdio:'inherit'});
  if(result.error){console.error(result.error.message);process.exit(1)}
  if(result.status!==0)process.exit(result.status||1);
}
