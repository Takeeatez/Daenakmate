// Decorative football motion; no game action or order side effect.
const playPass=document.querySelector('#play-pass');
const tacticField=document.querySelector('#tactic-field');
const playStatus=document.querySelector('#play-status span');
const motionButton=document.querySelector('#motion-control');
let playTimers=[];
let motionOff=matchMedia('(prefers-reduced-motion: reduce)').matches;
function updateMotion(){document.body.classList.toggle('motion-off',motionOff);motionButton.setAttribute('aria-pressed',String(motionOff));motionButton.setAttribute('aria-label',motionOff?'장식 애니메이션 켜기':'장식 애니메이션 일시정지');motionButton.textContent=motionOff?'▶ 모션 켜기':'Ⅱ 모션 끄기'}
try{const preference=localStorage.getItem('daenakmate-motion');if(preference!==null)motionOff=preference==='off'}catch{}
updateMotion();motionButton.onclick=()=>{motionOff=!motionOff;updateMotion();try{localStorage.setItem('daenakmate-motion',motionOff?'off':'on')}catch{}};
playPass.onclick=()=>{playTimers.forEach(clearTimeout);playTimers=[];tacticField.classList.remove('is-playing');void tacticField.offsetWidth;tacticField.classList.add('is-playing');playPass.disabled=true;playStatus.textContent='신청';const finish=()=>{playStatus.textContent='수령';playPass.disabled=false;playPass.innerHTML='다시 플레이 <span>↻</span>'};if(motionOff||matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return}playTimers.push(setTimeout(()=>playStatus.textContent='입금 확인',1100));playTimers.push(setTimeout(finish,2750))};
