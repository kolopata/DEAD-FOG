// ---------- окно разработчика (тильда x3) ----------
const DEV={inf:0,god:0,bak:0};let dvT=[];
function devKey(e){if(e.code!=='Backquote')return;const n=performance.now();dvT=dvT.filter(x=>n-x<1200);dvT.push(n);if(dvT.length>=3){dvT=[];if(st==='play')ui('pause');devWin()}}
function devWin(){
 const on=v=>v?'<b style=color:#6f6>ВКЛ</b>':'<b style=color:#f66>ВЫКЛ</b>';
 $('pn').innerHTML=`<h1 style=font-size:30px;color:#e33>Режим разработчика</h1><p class=s>Текущая волна: ${S.wave}${waveOn?' (идёт)':''}</p>`
 +`<button onclick=devTog('inf')>Бесконечные деньги: ${on(DEV.inf)}</button><button onclick=devTog('god')>Бессмертие: ${on(DEV.god)}</button><br>`
 +`<h2>Выбор волны (1–30)</h2><input id=dw type=number min=1 max=30 value=${Math.min(30,S.wave+1)}> <button onclick=devWaveIn()>Установить</button><br>`
 +[1,5,10,15,20,25,30].map(n=>`<button onclick=devWave(${n})>${n}</button>`).join('')
 +`<p class=s>После выбора откроется магазин. Волна стартует кнопкой «Начать волну».<br>Тильда три раза подряд открывает это окно снова.</p>`
 +devModels()+`<button onclick=devOff()>Выключить все читы</button><button class=go onclick=ui(st)>Закрыть</button>`}
function devTog(k){
 if(k==='inf'){if(!DEV.inf){DEV.bak=S.money;S.money=999999;DEV.inf=1}else{DEV.inf=0;S.money=DEV.bak}}
 else DEV.god=DEV.god?0:1;
 devWin()}
function devOff(){if(DEV.inf){DEV.inf=0;S.money=DEV.bak}DEV.god=0;devWin()}
function devWaveIn(){devWave(+document.getElementById('dw').value||1)}
function devWave(n){
 n=Math.max(1,Math.min(30,n|0));S.wave=n-1;waveOn=false;toSpawn=0;
 enemies.slice().forEach(e=>scene.remove(e.g));enemies.length=0;dying.forEach(d=>scene.remove(d.g));dying.length=0;
 P.hp=maxHp();ui('shop');toast('Следующая волна: '+n)}
