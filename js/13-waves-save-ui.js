// ---------- волны ----------
function nextWave(){
 enemies.slice().forEach(e=>scene.remove(e.g));enemies.length=0;
 dying.forEach(d=>scene.remove(d.g));dying.length=0;proj.forEach(q=>scene.remove(q.m));proj.length=0;drops.forEach(d=>scene.remove(d.m));drops.length=0;gren.forEach(q=>scene.remove(q.m));gren.length=0;S.wave++;toSpawn=S.wave%5===0?1:4+S.wave*3;const mi=Math.min(5,Math.floor((S.wave-1)/5));if(mi!==curMap){buildMap(mi);warn(MAPS[mi].n,3.5,'#e0c27a');toastL(MAPS[mi].intro,6000)}bossDone=0;hint=0;bat=100;flLock=false;flOn=true;spT=0;waveOn=true;resume();sfx('wave');if(S.wave%5===0)warn('☠ ВОЛНА БОССА — '+bossName(S.wave),3.5);
}
function endWave(){
 waveOn=false;S.money+=25+S.wave*10;P.hp=Math.min(maxHp(),P.hp+maxHp()*.3);save(true);ui(S.wave>=30?'win':'shop');
}
function damage(n){if(DEV.god)return;P.hp-=n;shk=1;sfx('hurt');$('vg').style.opacity=1;setTimeout(()=>$('vg').style.opacity=0,150);
 if(P.hp<=0){P.hp=0;waveOn=false;ui('dead')}}

// ---------- сохранения ----------
const hasSave=()=>{try{return !!localStorage.getItem(KEY)}catch(e){return false}};
function save(auto){
 try{localStorage.setItem(KEY,JSON.stringify({...S,money:DEV.inf?DEV.bak:S.money,hp:P.hp,wave:S.wave-(waveOn?1:0)}));toast(auto?'Автосохранение':'Игра сохранена')}
 catch(e){toast('Сохранение недоступно')}
}
function loadGame(){
 try{const d=JSON.parse(localStorage.getItem(KEY));if(!d)return toast('Нет сохранения');
  S={...fresh(),...d};DEV.bak=S.money;P.hp=Math.min(d.hp||maxHp(),maxHp());waveOn=false;enemies.slice().forEach(e=>scene.remove(e.g));enemies.length=0;setGun();ui('shop')}
 catch(e){toast('Ошибка загрузки')}
}
function newGame(){S=fresh();DEV.bak=0;if(DEV.inf)S.money=999999;P.hp=100;setGun();nextWave()}
let tt;function toast(t){$('msg').textContent=t;clearTimeout(tt);tt=setTimeout(()=>$('msg').textContent='',1800)}

// ---------- интерфейс ----------
function ui(mode){
 st=mode;document.exitPointerLock&&document.exitPointerLock();firing=false;spinV=0;if(spG)spG.gain.value=0;if(nvOn)setNv(false);if(DEV.inf)S.money=999999;
 $('ov').style.display='flex';$('hud').hidden=mode==='menu';
 let h='<h1>Мёртвый туман</h1>';
 if(mode==='menu'){
  h+='<p>Зомби и обезьяны выходят из тумана волнами.<br>Зарабатывайте деньги, прокачивайтесь, покупайте оружие.</p>'
   +'<button class="go" onclick="newGame()">Новая игра</button><button onclick="bestiary()">Бестиарий</button>'+(hasSave()?'<button class="go" onclick="loadGame()">Продолжить</button>':'')
   +'<p class="s">WASD — движение, Shift — бег, мышь — прицел, ЛКМ — огонь<br>1–5, колесо мыши или Q/E — оружие, F — фонарик, N — ПНВ, G — граната, M — звук, Esc — пауза и магазин</p>';
 }else if(mode==='win'){h+='<p>Суккуб повержена, врата ада закрылись. Вы пережили все 30 волн!</p><button class=go onclick=newGame()>Новая игра</button><button class=go onclick=contGame()>Продолжить (бесконечный режим)</button>'}else if(mode==='dead'){
  h+='<p>Вы погибли на волне '+S.wave+'.</p><button class="go" onclick="newGame()">Начать заново</button>'+(hasSave()?'<button class="go" onclick="loadGame()">Загрузить сохранение</button>':'');
 }else{
  h+='<p>'+(mode==='shop'?'Волна '+S.wave+' пройдена.':'Пауза.')+' Деньги: <b style="color:#e0c27a">'+Math.floor(S.money)+'$</b></p><h2>Характеристики</h2>';
  for(const k in UPS){const c=UPS[k][1]*(1+S.up[k]);h+=`<button ${S.money<c?'disabled':''} onclick="buyUp('${k}')">${UPS[k][0]} (ур. ${S.up[k]}) — ${c}$</button>`}
  h+='<h2>Оружие</h2>';
  WEAP.forEach((w,i)=>{h+=S.own[i]?`<button ${S.cur===i?'disabled':''} onclick="equip(${i})">${i+1}. ${w.n}${S.cur===i?' ✔':''}</button>`
   :`<button ${S.money<w.c?'disabled':''} onclick="buyW(${i})">${i+1}. ${w.n} — ${w.c}$</button>`});
  h+=EQ()+'<h2>Игра</h2><button onclick="save()">Сохранить</button><button onclick="loadGame()" '+(hasSave()?'':'disabled')+'>Загрузить</button>'
   +'<br><button class="go" onclick="'+(mode==='shop'?'nextWave()':'resume()')+'">'+(mode==='shop'?'Начать волну '+(S.wave+1):'Продолжить')+'</button>';
 }
 $('pn').innerHTML=h;
}
function buyUp(k){const c=UPS[k][1]*(1+S.up[k]);if(S.money<c)return;S.money-=c;S.up[k]++;sfx('buy');if(k==='hp')P.hp+=25;ui(st)}
function buyW(i){if(S.money<WEAP[i].c)return;S.money-=WEAP[i].c;S.own[i]=1;S.cur=i;setGun();sfx('buy');ui(st)}
function equip(i){S.cur=i;setGun();ui(st)}
function resume(){initAudio();st='play';$('ov').style.display='none';$('hud').hidden=false;R.domElement.requestPointerLock&&R.domElement.requestPointerLock()}

// ---------- ввод ----------
addEventListener('keydown',e=>{keys[e.code]=1;devKey(e);if(e.code==='KeyF'&&st==='play'&&!flLock){flOn=!flOn;sfx('click')}if(e.code==='KeyG')throwG();if(e.code==='KeyN'&&st==='play'&&S.nv&&!flLock){setNv(!nvOn);sfx('click')}if(e.code==='KeyM'){muted=!muted;if(mg)mg.gain.value=muted?0:.55;toast(muted?'Звук выключен':'Звук включён')}if(st==='play'&&/^(Digit|Numpad)[1-5]$/.test(e.code)){const i=+e.code.slice(-1)-1;if(S.own[i]&&S.cur!==i){S.cur=i;setGun()}}if(st==='play'&&e.code==='KeyQ')cycleW(-1);if(st==='play'&&e.code==='KeyE')cycleW(1);});
addEventListener('keyup',e=>keys[e.code]=0);
addEventListener('mousemove',e=>{if(st!=='play'||!document.pointerLockElement)return;yaw-=e.movementX*.0022;pitch=Math.max(-1.4,Math.min(1.4,pitch-e.movementY*.0022))});
addEventListener('mousedown',e=>{if(st==='play'&&e.button===0){if(!document.pointerLockElement)R.domElement.requestPointerLock();firing=true}});
addEventListener('mouseup',()=>firing=false);
document.addEventListener('pointerlockchange',()=>{if(!document.pointerLockElement&&st==='play')ui('pause')});
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()});
