// ---------- v3: локации, боссы, радиация ----------
let curMap=-1,warnT=0,auraT;
const rings=[],fMat=new THREE.MeshBasicMaterial({color:0xff7a20}),ceil=new THREE.Mesh(new THREE.PlaneGeometry(A*2,A*2),new THREE.MeshLambertMaterial({color:0x888888}));
ceil.rotation.x=Math.PI/2;ceil.position.y=6.5;ceil.visible=false;scene.add(ceil);
KINDS.radio={hp:90,hg:14,sp:1.5,sg:.05,dmg:8,rw:30,r:.45};KINDS.succubus={hp:12000,hg:0,sp:4.2,sg:0,dmg:30,rw:2000,r:.7};
function toastL(t,ms){$('msg').textContent=t;clearTimeout(tt);tt=setTimeout(()=>$('msg').textContent='',ms)}
function warn(t,d,c){const w=$('warn');w.textContent=t;w.style.color=c||'#ff3030';w.style.display='block';warnT=d||1.5}
function updWarn(dt){if(DEV.inf)S.money=999999;if(warnT>0){warnT-=dt;if(warnT<=0)$('warn').style.display='none'}}
function rad(n){if(DEV.god)return;P.hp-=n;const v=$('vg');v.style.boxShadow='inset 0 0 160px 40px #2f2';v.style.opacity=.7;setTimeout(()=>{v.style.opacity=0;v.style.boxShadow=''},250);if(P.hp<=0){P.hp=0;waveOn=false;ui('dead')}}
function bossName(w){return {5:'Мясник',10:'Палач бункера',15:'Мутант-исполин',20:'Король костей',25:'Падший инквизитор',30:'Суккуб — Владычица ада'}[w]||'Мясник'}
function contGame(){ui('shop')}
const MAPS=[
 {n:'Заброшенная деревня',intro:'Глава 1. Туман накрыл деревню, и мёртвые встали из могил.',fl:0,indoor:0,fog:[0x0a0707,.075],amb:[0x2a3a2a,.5],moon:.3,wall:0x2c2a27,h:4,cnt:34,sh:[[1,2.4,1,2.4,.9,2.2,[0x4a3a28,0x3e3326,0x2f3a2c],0,3],[3,8,.6,.6,2.6,2.6,[0x37332e],0,1.3],[5,9,.3,.3,1.1,1.1,[0x5a4a30],0,.8]]},
 {n:'Подземный бункер',intro:'Глава 2. Вы спустились в бункер. Здесь пахнет ржавчиной и смертью.',fl:1,indoor:1,fog:[0x070908,.08],amb:[0x2a3a30,.55],moon:0,wall:0x3a3f3a,h:6,cnt:30,sh:[[1,2.2,1,2.2,1,1.8,[0x3a4a3a,0x4a4a3a],0,3],[.9,.9,.9,.9,6,6,[0x55585a],0,1.5],[3,6,.6,.6,1.2,1.2,[0x5a5f55],0,1.2]]},
 {n:'Секретная лаборатория',intro:'Глава 3. Здесь всё началось. Учёные создали нечто ужасное.',fl:2,indoor:1,fog:[0x0b1210,.07],amb:[0x4a6a5a,.7],moon:0,wall:0x9aa6a6,h:6,cnt:28,sh:[[2,3.4,1,1.2,1,1.1,[0xb8c0c0],0,2],[1.3,1.3,1.3,1.3,3.2,3.2,[0x66ffaa],0x114422,1.6,1],[3,7,.5,.5,2.6,2.6,[0x8a9696],0,1.2]]},
 {n:'Катакомбы',intro:'Глава 4. Под лабораторией древние катакомбы. Кости хрустят под ногами.',fl:3,indoor:1,fog:[0x0a0908,.085],amb:[0x3a3028,.5],moon:0,wall:0x4a463c,h:6,cnt:32,sh:[[2.2,2.4,1,1.1,.9,.9,[0x5a5648],0,2],[1,1,1,1,6,6,[0x4a463c],0,1.6],[3,7,.6,.6,2.4,2.4,[0x3a372e],0,1.4]]},
 {n:'Проклятый собор',intro:'Глава 5. Выход ведёт через собор, оскверняемый тьмой.',fl:4,indoor:1,fog:[0x0c0508,.07],amb:[0x4a2a38,.6],moon:0,wall:0x2a1a20,h:6,cnt:26,sh:[[3,4.5,.6,.6,.9,.9,[0x3a2418],0,3],[1.1,1.1,1.1,1.1,6,6,[0x4a4048],0,1.5],[1.6,2.4,1,1.4,1,1,[0x2a2028],0,1]]},
 {n:'Врата ада',intro:'Финал. Врата ада открыты. На последней волне вас ждёт Суккуб.',fl:5,indoor:0,fog:[0x1a0504,.06],amb:[0x6a2a1a,.6],moon:.15,wall:0x1a1014,h:5,cnt:14,sh:[[1.2,2,1.2,2,2,4,[0x1a1014,0x24121a],0x330800,3],[3,5,.6,.6,2.4,2.4,[0x22141a],0x220600,1]]}
];
function floorTex2(v){
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d'),R=Math.random;
 x.fillStyle=['#2a2519','#3a3d38','#c9d1cf','#2b2a25','#1d1416','#120a0a'][v];x.fillRect(0,0,512,512);
 for(let i=0;i<9000;i++){x.fillStyle='rgba(0,0,0,'+R()*.3+')';x.fillRect(R()*512,R()*512,1+R()*3,1+R()*3)}
 const blot=(n,a,b,col)=>{for(let i=0;i<n;i++){const px=R()*512,py=R()*512,r=a+R()*b,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,col+'.6)');g.addColorStop(1,col+'0)');x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2)}};
 const grid=(s,col)=>{x.strokeStyle=col;x.lineWidth=2;for(let i=0;i<=512;i+=s){x.beginPath();x.moveTo(i,0);x.lineTo(i,512);x.moveTo(0,i);x.lineTo(512,i);x.stroke()}};
 blot(22,20,60,'rgba(0,0,0,');
 if(v===0){blot(30,20,50,'rgba(40,55,20,');blot(12,14,40,'rgba(110,8,8,')}
 if(v===1){grid(128,'rgba(0,0,0,.7)');x.fillStyle='rgba(210,175,20,.6)';for(let i=-20;i<512;i+=40){x.beginPath();x.moveTo(i,0);x.lineTo(i+20,0);x.lineTo(i+40,22);x.lineTo(i+20,22);x.fill()}blot(14,16,40,'rgba(120,55,20,');blot(8,10,30,'rgba(100,8,8,')}
 if(v===2){grid(64,'rgba(70,80,80,.8)');blot(14,14,40,'rgba(60,200,80,');blot(10,10,36,'rgba(120,8,8,')}
 if(v===3){x.strokeStyle='rgba(0,0,0,.8)';x.lineWidth=2;for(let j=0;j<8;j++){const o=j%2?32:0;for(let i=-1;i<9;i++)x.strokeRect(i*64+o,j*64,64,64)}blot(18,16,40,'rgba(40,70,30,')}
 if(v===4){for(let i=0;i<8;i++)for(let j=0;j<8;j++)if((i+j)%2){x.fillStyle='rgba(120,10,15,.4)';x.fillRect(i*64,j*64,64,64)}blot(16,14,44,'rgba(140,6,6,')}
 if(v===5){blot(20,20,60,'rgba(255,70,10,');x.strokeStyle='rgba(255,120,30,.95)';x.lineWidth=2.5;x.shadowColor='#f60';x.shadowBlur=10;for(let i=0;i<20;i++){let px=R()*512,py=R()*512,a=R()*7;x.beginPath();x.moveTo(px,py);for(let s=0;s<10;s++){a+=(R()-.5)*1.4;px+=Math.cos(a)*16;py+=Math.sin(a)*16;x.lineTo(px,py)}x.stroke()}x.shadowBlur=0}
 else{x.strokeStyle='rgba(0,0,0,.9)';x.lineWidth=1.5;for(let i=0;i<14;i++){let px=R()*512,py=R()*512,a=R()*7;x.beginPath();x.moveTo(px,py);for(let s=0;s<14;s++){a+=(R()-.5)*1.2;px+=Math.cos(a)*14;py+=Math.sin(a)*14;x.lineTo(px,py)}x.stroke()}}
 if(v===0||v===3||v===4){x.strokeStyle='rgba(185,178,150,.55)';x.lineWidth=3;x.lineCap='round';for(let i=0;i<8;i++){const px=R()*480+16,py=R()*480+16,a=R()*7;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*18,py+Math.sin(a)*18);x.stroke()}
  for(let i=0;i<3;i++){const px=R()*480+16,py=R()*480+16;x.fillStyle='rgba(190,185,160,.6)';x.beginPath();x.arc(px,py,7,0,7);x.fill();x.fillStyle='#000';x.fillRect(px-4,py-2,3,3);x.fillRect(px+1,py-2,3,3)}}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,6);return t}
function skyHell(){const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d'),R=Math.random;
 const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#120206');g.addColorStop(.45,'#4a0a08');g.addColorStop(.52,'#ff4a10');g.addColorStop(.56,'#3a0a04');g.addColorStop(1,'#080202');x.fillStyle=g;x.fillRect(0,0,1024,512);
 for(let i=0;i<120;i++){x.fillStyle='rgba('+(20+R()*40|0)+',0,0,'+(.2+R()*.3)+')';x.beginPath();x.ellipse(R()*1024,60+R()*180,50+R()*130,8+R()*22,0,0,7);x.fill()}
 const sg=x.createRadialGradient(600,170,5,600,170,160);sg.addColorStop(0,'rgba(255,200,80,1)');sg.addColorStop(.25,'rgba(255,90,20,.8)');sg.addColorStop(1,'rgba(255,40,0,0)');x.fillStyle=sg;x.fillRect(430,0,340,340);
 for(let i=0;i<300;i++){x.fillStyle='rgba(255,'+(100+R()*100|0)+',30,'+R()+')';x.fillRect(R()*1024,100+R()*260,1.5,1.5)}
 x.fillStyle='#050101';for(let i=0;i<40;i++){const bx=R()*1024;x.beginPath();x.moveTo(bx,262);x.lineTo(bx+10+R()*10,262-20-R()*70);x.lineTo(bx+26,262);x.fill()}
 x.fillRect(0,260,1024,252);return new THREE.CanvasTexture(c)}
function buildMap(i){
 const M=MAPS[i],H=M.h;curMap=i;
 obsMeshes.forEach(m=>{scene.remove(m);m.geometry.dispose();m.material.dispose()});obsMeshes.length=0;C.length=0;
 [[0,-A,A,.5],[0,A,A,.5],[-A,0,.5,A],[A,0,.5,A]].forEach(([x,z,w,d])=>obsMeshes.push(box(w*2,H,d*2,M.wall,x,H/2,z,scene)));
 let sd=17+i*31;const lr=()=>(sd=(sd*16807)%2147483647)/2147483647,tot=M.sh.reduce((a,s)=>a+s[8],0);
 for(let n=0;n<M.cnt;n++){
  let r=lr()*tot,s=M.sh[0];for(const q of M.sh){if(r<q[8]){s=q;break}r-=q[8]}
  const w0=s[0]+lr()*(s[1]-s[0]),d0=s[2]+lr()*(s[3]-s[2]),h=s[4]+lr()*(s[5]-s[4]),x=(lr()*2-1)*(A-3),z=(lr()*2-1)*(A-3);
  if(Math.hypot(x,z)<5)continue;
  const rot=lr()<.5,W=rot?w0:d0,D=rot?d0:w0,col=s[6][Math.floor(lr()*s[6].length)];let m;
  if(s[9]){m=new THREE.Mesh(new THREE.CylinderGeometry(W/2,W/2,h,14),new THREE.MeshLambertMaterial({color:col,emissive:s[7]||0,transparent:true,opacity:.75}));m.position.set(x,h/2,z);scene.add(m)}
  else m=box(W,h,D,col,x,h/2,z,scene,s[7]);
  obsMeshes.push(m);C.push({x,z,w:W/2,d:D/2,h});
 }
 ground.material.map=floorTex2(M.fl);ground.material.needsUpdate=true;
 ceil.visible=!!M.indoor;ceil.position.y=H+.5;ceil.material.map=floorTex2(M.fl);ceil.material.needsUpdate=true;
 sky.visible=!M.indoor;if(!M.indoor){sky.material.map=i===5?skyHell():skyTex();sky.material.needsUpdate=true}
 moonL.intensity=M.moon;scene.background.setHex(M.fog[0]);setNv(nvOn);cam.position.set(0,1.6,0);
}
function auraTex(){if(auraT)return auraT;const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d'),g=x.createRadialGradient(128,128,0,128,128,128);
 g.addColorStop(0,'rgba(90,255,90,.08)');g.addColorStop(.7,'rgba(90,255,90,.22)');g.addColorStop(.93,'rgba(140,255,120,.55)');g.addColorStop(.97,'rgba(200,255,180,.9)');g.addColorStop(1,'rgba(90,255,90,0)');x.fillStyle=g;x.fillRect(0,0,256,256);return auraT=new THREE.CanvasTexture(c)}
BEST[0].sp='быстрее прежнего';BEST[5].n='Боссы (каждая 5-я волна)';BEST[5].hp='1800 (+350 за волну)';BEST[5].rw=400;BEST[5].d='Выходит один, без свиты. Рывок, удар по земле (красный круг — зона поражения) и залпы. В ярости атакует чаще. Перешагивает препятствия.';
BEST.push({k:'radio',n:'Радиоактивный',w:6,hp:'90 (+14)',sp:'медленный',dmg:'8 + излучение',rw:30,d:'Излучает зелёную зону радиусом 5 м, внутри которой постоянно идёт небольшой урон. Не подпускайте, расстреливайте издалека.'},{k:'succubus',n:'Суккуб — Владычица ада',w:30,hp:'12000',sp:'быстрый',dmg:30,rw:2000,d:'Финальный босс. Пикирование, пламенный взрыв по области и залпы огня. Крылатая, с хвостом и рогами.'});
// ---------- боссы ----------
const BN={boss:['РЫВОК','УДАР ПО ЗЕМЛЕ — БЕГИТЕ ОТ БОССА','ЗАЛП КИСЛОТОЙ'],succubus:['ПИКИРОВАНИЕ','ПЛАМЕННЫЙ ВЗРЫВ — БЕГИТЕ ОТ СУККУБА','ЗАЛП ОГНЯ']};
function mkRing(e,R){const m1=new THREE.MeshBasicMaterial({color:0xff2020,transparent:true,opacity:.9,depthWrite:false,fog:false,side:THREE.DoubleSide}),m2=new THREE.MeshBasicMaterial({color:0xff2020,transparent:true,opacity:.3,depthWrite:false,fog:false,side:THREE.DoubleSide});
 const rg=new THREE.Mesh(new THREE.RingGeometry(.96,1,48),m1),inn=new THREE.Mesh(new THREE.CircleGeometry(1,40),m2),grp=new THREE.Group();
 rg.rotation.x=inn.rotation.x=-Math.PI/2;rg.scale.setScalar(R);inn.scale.setScalar(.01);grp.add(rg,inn);grp.position.set(e.g.position.x,.07,e.g.position.z);scene.add(grp);e.ring={grp,inn,R};rings.push({e,m:grp})}
function slam(e){const q=e.g.position,R=e.ring?e.ring.R:8;if(Math.hypot(cam.position.x-q.x,cam.position.z-q.z)<R)damage(Math.round(e.dmg*1.6));
 burst(new THREE.Vector3(q.x,.3,q.z),[0x886644,0x553322,0xffaa44],45,9,3);shk=1.6;sfx('boom');
 if(e.ring){scene.remove(e.ring.grp);e.ring=null;const ix=rings.findIndex(r=>r.e===e);if(ix>=0)rings.splice(ix,1)}}
function volley(e,n){const q=e.g.position,a0=Math.random()*6;for(let i=0;i<n;i++){const a=a0+i/n*Math.PI*2,m=new THREE.Mesh(sGeo,e.k==='succubus'?fMat:sMat);m.scale.setScalar(1.6);m.position.set(q.x,1.4,q.z);scene.add(m);proj.push({m,v:new THREE.Vector3(Math.cos(a)*9,0,Math.sin(a)*9),t:3.5,dmg:Math.round(e.dmg*.5)})}sfx('spit')}
function artStart(e,n){e.st=e.st||[];const p=cam.position;
 for(let i=0;i<n;i++){const ox=i?(Math.random()-.5)*9:0,oz=i?(Math.random()-.5)*9:0,x=Math.max(-A+2,Math.min(A-2,p.x+ox)),z=Math.max(-A+2,Math.min(A-2,p.z+oz));
  const m1=new THREE.MeshBasicMaterial({color:0xff3010,transparent:true,opacity:.9,depthWrite:false,fog:false,side:THREE.DoubleSide}),m2=new THREE.MeshBasicMaterial({color:0xff3010,transparent:true,opacity:.28,depthWrite:false,fog:false,side:THREE.DoubleSide});
  const rg=new THREE.Mesh(new THREE.RingGeometry(.94,1,32),m1),inn=new THREE.Mesh(new THREE.CircleGeometry(1,28),m2),grp=new THREE.Group();
  rg.rotation.x=inn.rotation.x=-Math.PI/2;rg.scale.setScalar(3);inn.scale.setScalar(.01);grp.add(rg,inn);grp.position.set(x,.08,z);scene.add(grp);
  e.st.push({x,z,t:1.2+i*.3,T:1.2+i*.3,inn,grp})}}
function updStrikes(e,dt){if(!e.st)return;for(let i=e.st.length-1;i>=0;i--){const s=e.st[i];s.t-=dt;s.inn.scale.setScalar(Math.max(.01,3*(1-s.t/s.T)));
  if(s.t<=0){if(Math.hypot(cam.position.x-s.x,cam.position.z-s.z)<3)damage(Math.round(e.dmg*1.1));burst(new THREE.Vector3(s.x,.3,s.z),[0xff6a20,0xffd060,0x442211],26,7,3);shk=Math.max(shk,.6);sfx('boom');scene.remove(s.grp);e.st.splice(i,1)}}}
function aimVolley(e){const q=e.g.position,p=cam.position,y0=2.2*(e.bs||1)*.6;
 for(let i=-2;i<=2;i++){const dx=p.x-q.x,dz=p.z-q.z,l=Math.hypot(dx,dz)||1,a=Math.atan2(dz,dx)+i*.14,vy=(1.2-y0)/l*16;
  const m=new THREE.Mesh(sGeo,e.k==='succubus'?fMat:sMat);m.scale.setScalar(1.4);m.position.set(q.x,y0,q.z);scene.add(m);proj.push({m,v:new THREE.Vector3(Math.cos(a)*16,vy,Math.sin(a)*16),t:3,dmg:Math.round(e.dmg*.45)})}sfx('spit')}
function bossAI(e,dt,ux,uz,d){
 const sc=e.k==='succubus',N=BN[e.k]||BN.boss,o={go:true,mx:ux,mz:uz,sp:e.sp*(e.rage?1.25:1)*(d>14?1.6:1),reach:sc?2.2:2.8};
 e.ac-=dt;updStrikes(e,dt);
 if(!e.rage&&e.hp<e.mhp*(sc?.5:.4)){e.rage=1;warn('⚠ ЯРОСТЬ! АТАКИ УЧАЩАЮТСЯ',2);sfx('roar')}
 if(e.cs===0){
  if(e.ac<=0){const r=Math.random(),far=d>9,gap=(e.rage?1.2:2.2)+Math.random()*1.5;
   if(far&&r<.4){e.cs=6;e.tl=.7;warn('⚠ ПРИЦЕЛЬНЫЙ ЗАЛП!',.8)}
   else if(r<.7&&(far||r<.2)){artStart(e,e.rage?7:5);warn('⚠ ОБСТРЕЛ ПО ВАМ — ДВИГАЙТЕСЬ!',1.3);e.ac=gap}
   else if(r<.8&&d>4){e.cs=1;e.tl=.8;warn('⚠ '+N[0]+'!',.9)}
   else if(r<.92&&d<12){e.cs=3;e.tl=1.3;mkRing(e,sc?9:8);warn('⚠ '+N[1]+'!',1.4)}
   else if(S.wave>=10||sc){e.cs=5;e.tl=.9;warn('⚠ '+N[2]+'!',1)}
   else e.ac=.8;
   if(e.cs)sfx('roar')}
 }else if(e.cs===1){o.go=false;e.tl-=dt;e.g.position.x+=(Math.random()-.5)*.04;if(e.tl<=0){e.cs=2;e.tl=1.1;e.dx=ux;e.dz=uz}}
 else if(e.cs===2){o.mx=e.dx;o.mz=e.dz;o.sp=e.sp*3.2;o.ry=Math.atan2(e.dx,e.dz);e.tl-=dt;if(e.tl<=0){e.cs=4;e.tl=.4}}
 else if(e.cs===3){o.go=false;e.tl-=dt;if(e.ring)e.ring.inn.scale.setScalar(Math.max(.01,e.ring.R*(1-e.tl/1.3)));if(e.tl<=0){slam(e);e.cs=4;e.tl=.4}}
 else if(e.cs===4){o.go=false;e.tl-=dt;if(e.tl<=0){e.cs=0;e.ac=(e.rage?1.2:2.2)+Math.random()*1.5}}
 else if(e.cs===5){o.go=false;e.tl-=dt;if(e.tl<=0){volley(e,sc?18:12);e.cs=4;e.tl=.4}}
 else if(e.cs===6){o.go=false;e.tl-=dt;if(e.tl<=0){aimVolley(e);e.cs=4;e.tl=.4}}
 return o}
