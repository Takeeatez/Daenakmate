import {spawnSync} from 'node:child_process';
import {resolve} from 'node:path';
export class TestDB{
constructor(file){this.file=resolve(file)}
execute(queries,schema){const r=spawnSync('python',['-X','utf8','scripts/sqlite-bridge.py'],{input:JSON.stringify({file:this.file,queries,schema}),encoding:'utf8'});let out;try{out=JSON.parse(r.stdout)}catch{throw Error('SQLite bridge failed: '+r.stderr)}if(r.status){console.error('SQLite test error:',out.error);throw Error(out.error);}return out.results}
prepare(sql){let args=[];const self=this;return{bind(...a){args=a;return this},async first(){return self.execute([{sql,args}])[0].results[0]||null},async all(){return self.execute([{sql,args}])[0]},async run(){return self.execute([{sql,args}])[0]},get sql(){return sql},get args(){return args}}}
async batch(statements){return this.execute(statements.map(x=>({sql:x.sql,args:x.args})))}
}
