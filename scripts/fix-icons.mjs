import {readFileSync,writeFileSync} from 'node:fs';
let html=readFileSync('web/index.html','utf8');for(const name of ['trophy','ball'])html=html.replaceAll("'+icon('"+name+"')+'",`<svg class="football-icon" aria-hidden="true"><use href="#i-${name}"/></svg>`);writeFileSync('web/index.html',html);
