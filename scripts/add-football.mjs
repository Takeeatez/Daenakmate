import {readFileSync,writeFileSync} from 'node:fs';
const symbols=`<svg class="icon-defs" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs>
<symbol id="i-ball" viewBox="0 0 64 64"><circle cx="32" cy="32" r="28" fill="currentColor" stroke="currentColor" stroke-width="2"/><g fill="#075c36"><path d="m32 19 12 9-5 14H25l-5-14z"/><path d="m13 12 11 3-5 11-13 1 1-8zm38 0 6 7 1 8-13-1-5-11zM9 45l12-4 8 11-5 7-10-6zm46 0-5 8-10 6-5-7 8-11zM27 4h10l4 9-9 6-9-6z"/></g><g stroke="#075c36" stroke-width="2" fill="none"><path d="m32 19 0-6M20 28l-8-5m32 5 8-5M25 42l-6 8m20-8 6 8"/></g></symbol>
<symbol id="i-card" viewBox="0 0 32 32"><path d="M8 4h16l3 5-2 16-9 4-9-4L5 9z"/><circle cx="16" cy="13" r="4"/><path d="M10 23c1-6 11-6 12 0M11 8h10"/></symbol>
<symbol id="i-trophy" viewBox="0 0 32 32"><path d="M10 5h12v9a6 6 0 0 1-12 0zM10 8H5v4a6 6 0 0 0 6 6m11-10h5v4a6 6 0 0 1-6 6M16 20v6m-6 2h12M13 11h6"/></symbol>
<symbol id="i-shield" viewBox="0 0 32 32"><path d="m16 3 11 4v9c0 7-11 13-11 13S5 23 5 16V7z"/><path d="m11 16 4 4 7-8"/></symbol>
<symbol id="i-ticket" viewBox="0 0 32 32"><path d="M4 8h24v6a3 3 0 0 0 0 6v5H4v-5a3 3 0 0 0 0-6zM21 8v3m0 3v3m0 3v5M9 12h7m-7 5h5"/></symbol>
<symbol id="i-pitch" viewBox="0 0 32 32"><rect x="4" y="5" width="24" height="22" rx="2"/><path d="M16 5v22M4 11h5v10H4m24-10h-5v10h5"/><circle cx="16" cy="16" r="4"/></symbol>
<symbol id="i-boot" viewBox="0 0 32 32"><path d="M5 6h10l1 9 10 5 2 4H4V13zM4 24v3m7-3v3m9-3v3m7-3v3M16 15l-5 2m9 0-5 3"/></symbol>
</defs></svg>`;
const icon=id=>`<svg class="football-icon" aria-hidden="true"><use href="#i-${id}"/></svg>`;
let html=readFileSync('web/index.html','utf8');
html=html.replace('<body>','<body>'+symbols);
html=html.replace('<div class="hero-art">','<div class="hero-art"><div class="stadium-lights" aria-hidden="true"><i></i><i></i><i></i></div><div class="hero-football" aria-hidden="true">'+icon('ball')+'</div><div class="squad-badge" aria-hidden="true"><b>99</b><span>MATE<br>CM</span></div>');
html=html.replace('<span class="mini-logo">↗</span>','<span class="mini-logo">'+icon('card')+'</span>');
html=html.replace('<div class="floating"><span>✓</span>','<div class="floating"><span>'+icon('trophy')+'</span>');
html=html.replace('<b>01</b><h3>','<div class="feature-icon">'+icon('ticket')+'<b>01</b></div><h3>');
html=html.replace('<b>02</b><h3>','<div class="feature-icon">'+icon('pitch')+'<b>02</b></div><h3>');
html=html.replace('<b>03</b><h3>','<div class="feature-icon">'+icon('shield')+'<b>03</b></div><h3>');
html=html.replace('<span class="pill">BASIC</span>','<span class="pill">'+icon('card')+' BASIC</span>');
const pitch=`<div class="pass-demo"><div class="pass-demo-head"><div><span class="play-tag">PLAY THE PASS</span><p>접수부터 수령까지, 좋은 패스 한 번.</p></div><button class="motion-control" id="motion-control" aria-pressed="false" aria-label="장식 애니메이션 일시정지">Ⅱ 모션 끄기</button></div><div class="tactic-field" id="tactic-field" role="img" aria-label="접수, 확인, 수령을 연결하는 축구 전술판 애니메이션"><div class="field-lines" aria-hidden="true"><i></i><b></b><span></span></div><svg class="pass-route" viewBox="0 0 1000 260" preserveAspectRatio="none" aria-hidden="true"><path d="M120 130 Q300 25 500 75 Q700 105 880 130"/><path class="route-dot" d="M120 130 Q300 25 500 75 Q700 105 880 130"/></svg><div class="field-player player-one"><span>01</span><small>접수</small></div><div class="field-player player-two"><span>02</span><small>확인</small></div><div class="field-player player-three"><span>'+icon('trophy')+'</span><small>수령</small></div><div class="pass-ball" aria-hidden="true">'+icon('ball')+'</div><div class="goal-burst" aria-hidden="true">${Array.from({length:12},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div><div class="field-watermark" aria-hidden="true">MATE FC</div><span class="field-demo-label">서비스 흐름 예시</span></div><div class="pass-demo-foot"><div class="play-status" id="play-status" role="status" aria-live="polite">${icon('boot')}<span>버튼을 눌러 메이트의 패스를 확인해보세요.</span></div><button class="play-pass" id="play-pass">패스 플레이 <span>▶</span></button></div></div>`;
html=html.replace('<div class="steps">',pitch+'<div class="steps">');
html=html.replace('<span>01 — SELECT</span>','<span>01 — SELECT</span><div class="step-icon">'+icon('card')+'</div>').replace('<span>02 — REQUEST</span>','<span>02 — REQUEST</span><div class="step-icon">'+icon('pitch')+'</div>').replace('<span>03 — CHECK</span>','<span>03 — CHECK</span><div class="step-icon">'+icon('trophy')+'</div>');
writeFileSync('web/index.html',html);
