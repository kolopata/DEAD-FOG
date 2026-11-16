// ---------- обвесы, гранаты, ПНВ, дроп, бестиарий, модели v2 ----------
const ATT={
 comp:{n:'Компенсатор',slot:'b',c:250,d:'разброс −35%, отдача −15%',spread:.65,kick:.85},
 lbar:{n:'Длинный ствол',slot:'b',c:400,d:'урон +15%, разброс −15%',dmg:1.15,spread:.85},
 grip:{n:'Верт. рукоятка',slot:'g',c:250,d:'отдача −40%',kick:.6},
 laser:{n:'Лазерный целеуказатель',slot:'g',c:300,d:'разброс −20%, красная точка',spread:.8,laser:1},
 flash:{n:'Мощный аккумулятор',slot:'m',c:500,d:'бесконечные фонарик и ПНВ',inf:1},
 trig:{n:'Облегчённый спуск',slot:'m',c:450,d:'скорострельность +20%',rate:1.2}};
const ATTK=Object.keys(ATT);
function eqIds(i){const E=S.eq[i]||{};return [E.b,E.g,E.m].filter(Boolean)}
function effW(i){const w=WEAP[i],r={...w,km:1};let sm=1,dm=1,rm=1;for(const id of eqIds(i)){const a=ATT[id];sm*=a.spread||1;dm*=a.dmg||1;rm*=a.rate||1;r.km*=a.kick||1}r.s=w.s*sm;r.d=w.d*dm;r.r=w.r/rm;return r}
function infFl(){return eqIds(S.cur).some(id=>ATT[id].inf)}
function attVis(i){const g=GUNS[i];if(!g)return;(g.userData.av||[]).forEach(m=>g.remove(m));g.userData.av=[];const E=S.eq[i]||{},mz=g.userData.mf.position.z;
 const add=(w,h,d,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);g.add(m);g.userData.av.push(m)};
 if(E.b==='comp')add(.05,.05,.1,0x111111,0,.01,mz+.04);if(E.b==='lbar')add(.04,.04,.18,0x222222,0,.01,mz+.02);
 if(E.g==='grip')add(.04,.12,.05,0x222222,0,-.1,mz*.45);if(E.g==='laser')add(.03,.03,.08,0xaa1111,.05,-.02,mz*.4);
 if(E.m==='flash')add(.05,.05,.1,0xd8c060,-.05,.07,mz*.5);if(E.m==='trig')add(.03,.04,.04,0x66aaff,.04,-.05,.05)}
function refreshAtt(){GUNS.forEach((g,i)=>attVis(i))}
let dot,gcd=0,nvOn=false;
function updAtt(){const on=eqIds(S.cur).some(id=>ATT[id].laser);
 if(!dot){dot=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:0xff2020,fog:false}));dot.visible=false;scene.add(dot)}
 dot.visible=on&&swT<=0;if(!dot.visible)return;
 cam.getWorldDirection(v3);ray.set(cam.position,v3);ray.far=60;const h=ray.intersectObjects(obsMeshes.concat(...enemies.map(e=>e.parts)),false)[0];
 if(h)dot.position.copy(h.point);else dot.position.copy(cam.position).addScaledVector(v3,40)}
function workshop(wi){
 if(wi===undefined)wi=S.cur;if(DEV.inf)S.money=999999;const E=S.eq[wi]||(S.eq[wi]={});
 let h=`<h1 style=font-size:30px>Мастерская</h1><p>Деньги: <b style=color:#e0c27a>${Math.floor(S.money)}$</b></p>`;
 WEAP.forEach((w,i)=>{if(S.own[i])h+=`<button ${i===wi?'disabled':''} onclick=workshop(${i})>${i+1}. ${w.n}</button>`});
 const SL={b:'Ствол',g:'Рукоять / прицел',m:'Модуль'};
 for(const sl in SL){h+=`<h2>${SL[sl]}</h2>`;ATTK.forEach((id,i)=>{const a=ATT[id];if(a.slot!==sl)return;const own=S.att[wi+':'+id],on=E[sl]===id;
  h+=(on?`<button onclick=attTog(${wi},${i})>✔ ${a.n} — снять</button>`:own?`<button onclick=attTog(${wi},${i})>${a.n} — поставить</button>`:`<button ${S.money<a.c?'disabled':''} onclick=attBuy(${wi},${i})>${a.n} — ${a.c}$</button>`)+` <span class=s>${a.d}</span><br>`})}
 $('pn').innerHTML=h+`<button class=go onclick=ui(st)>Назад</button>`}
function attTog(wi,i){const id=ATTK[i],a=ATT[id],E=S.eq[wi]||(S.eq[wi]={});E[a.slot]=E[a.slot]===id?null:id;refreshAtt();workshop(wi)}
function attBuy(wi,i){const id=ATTK[i],a=ATT[id];if(S.money<a.c)return;S.money-=a.c;S.att[wi+':'+id]=1;(S.eq[wi]||(S.eq[wi]={}))[a.slot]=id;sfx('buy');refreshAtt();workshop(wi)}
function EQ(){return '<h2>Снаряжение</h2><button '+(S.money<220||S.gr>=5?'disabled':'')+' onclick=buyGr()>Граната (у вас '+S.gr+') — 220$</button>'+(S.nv?'<button disabled>ПНВ ✔</button>':'<button '+(S.money<700?'disabled':'')+' onclick=buyNv()>Прибор ночного видения — 700$</button>')+'<br><button onclick=workshop()>Мастерская (обвесы)</button><button onclick=bestiary()>Бестиарий</button>'}
function buyGr(){if(S.money<220||S.gr>=5)return;S.money-=220;S.gr++;sfx('buy');ui(st)}
function buyNv(){if(S.money<700)return;S.money-=700;S.nv=1;sfx('buy');ui(st)}
const BEST=[
 {k:'zombie',n:'Зомби',w:1,hp:'55 (+12 за волну)',sp:'медленный',dmg:10,rw:10,d:'Бредёт к вам по прямой и бьёт в ближнем бою. Тупой, но живучий.'},
 {k:'monkey',n:'Бешеная обезьяна',w:2,hp:'30 (+8)',sp:'очень быстрый',dmg:6,rw:15,d:'Бегает зигзагами и подпрыгивает, попасть сложно. Хрупкая.'},
 {k:'spitter',n:'Плюющийся',w:3,hp:'40 (+9)',sp:'медленный',dmg:8,rw:20,d:'Держится на дистанции 7–11 м, обходит по кругу и плюёт кислотой. Прячьтесь за укрытиями.'},
 {k:'jumper',n:'Прыгун',w:4,hp:'45 (+10)',sp:'средний',dmg:14,rw:22,d:'Подкрадывается и делает длинный прыжок, при приземлении бьёт сильнее.'},
 {k:'ghost',n:'Призрак',w:5,hp:'50 (+10)',sp:'средний',dmg:9,rw:25,d:'Парит и проходит сквозь стены и ящики. Полупрозрачный, мерцает.'},
 {k:'boss',n:'Мясник (босс)',w:5,hp:'600 (+130)',sp:'медленный, рывок ×3.8',dmg:25,rw:200,d:'Каждая 5-я волна. Перешагивает препятствия, замирает и несётся рывком. Даёт много дропа.'}];
function bestiary(){let h='<h1 style=font-size:30px>Бестиарий</h1>';
 for(const b of BEST){const s=S.seen[b.k];h+=`<div class=bc ${s?'':'style=opacity:.55'}><b>${b.n}</b> <span class=s>${s?'встречен · убито: '+(S.kills[b.k]||0):'не встречен · с волны '+b.w}</span><br>Здоровье: ${b.hp} · Скорость: ${b.sp} · Урон: ${b.dmg} · Награда: ${b.rw}$<br><i>${b.d}</i></div>`}
 $('pn').innerHTML=h+'<button class=go onclick=ui(st)>Назад</button>'}
// гранаты
const gren=[],drops=[],fxX=[],GGeo=new THREE.SphereGeometry(.11,10,8),GMat=new THREE.MeshLambertMaterial({color:0x2a3a22,emissive:0x110000});
function throwG(){if(st!=='play'||S.gr<=0||gcd>0)return;S.gr--;gcd=1.5;const m=new THREE.Mesh(GGeo,GMat.clone());cam.getWorldDirection(v3);m.position.copy(cam.position).addScaledVector(v3,.6);m.position.y-=.2;scene.add(m);gren.push({m,v:v3.clone().multiplyScalar(14).add(new THREE.Vector3(0,3.5,0)),t:1.8});sfx('click')}
function boom(p){
 sfx('boom');shk=1.6;burst(p,[0xffa030,0xff5010,0x333333,0xffe090],40,9,5);
 const s=new THREE.Mesh(new THREE.SphereGeometry(1,12,10),new THREE.MeshBasicMaterial({color:0xffa040,transparent:true,opacity:.8,fog:false}));s.position.copy(p);scene.add(s);fxX.push({m:s,t:.35});
 for(const e of enemies.slice()){const d=Math.hypot(e.g.position.x-p.x,e.g.position.z-p.z);if(d>5)continue;e.hp-=((1-d/5)*110+10)*((e.k==='boss'||e.k==='succubus')?.35:1);e.hit=.1;e.g.scale.setScalar(1.15*(e.bs||1));if(e.hp<=0)killE(e,0)}
 const pd=cam.position.distanceTo(p);if(pd<5)damage(Math.round((1-pd/5)*40));
}
function updGren(dt){
 gcd-=dt;
 for(let i=gren.length-1;i>=0;i--){const q=gren[i],pp=q.m.position;q.t-=dt;q.v.y-=18*dt;
  const nx=pp.x+q.v.x*dt,nz=pp.z+q.v.z*dt;let bx=false,bz=false;
  for(const c of C)if(pp.y<c.h){if(Math.abs(nx-c.x)<c.w&&Math.abs(pp.z-c.z)<c.d)bx=true;if(Math.abs(pp.x-c.x)<c.w&&Math.abs(nz-c.z)<c.d)bz=true}
  if(Math.abs(nx)>A-.5)bx=true;if(Math.abs(nz)>A-.5)bz=true;
  if(bx)q.v.x*=-.4;else pp.x=nx;if(bz)q.v.z*=-.4;else pp.z=nz;
  pp.y+=q.v.y*dt;if(pp.y<.11){pp.y=.11;q.v.y*=-.35;q.v.x*=.7;q.v.z*=.7}
  q.m.material.emissive.setHex(Math.floor(q.t*6)%2?0x550000:0);
  if(q.t<=0){boom(pp.clone());scene.remove(q.m);q.m.material.dispose();gren.splice(i,1)}}
 for(let i=fxX.length-1;i>=0;i--){const f=fxX[i];f.t-=dt;f.m.scale.setScalar(1+(.35-f.t)*20);f.m.material.opacity=Math.max(0,f.t/.35*.8);if(f.t<=0){scene.remove(f.m);f.m.material.dispose();f.m.geometry.dispose();fxX.splice(i,1)}}
}
// ПНВ
function setNv(on){nvOn=on;const M=MAPS[curMap]||MAPS[0];amb.color.setHex(on?0x55ff77:M.amb[0]);amb.intensity=on?2.6:M.amb[1];scene.fog.density=on?.04:M.fog[1];scene.fog.color.setHex(on?0x061206:M.fog[0]);$('nv').style.display=on?'block':'none'}
function updNv(dt){if(nvOn){if(!infFl())bat-=dt*2.5;if(bat<=0){bat=0;flLock=true;flOn=false;setNv(false);toast('Аккумулятор сел!')}}}
// дроп
function mkDrop(ty){
 const g=new THREE.Group(),B=c=>new THREE.MeshBasicMaterial({color:c,fog:false}),add=(geo,m,sx,sy,sz,x,y,z)=>{const o=new THREE.Mesh(geo,m);o.scale.set(sx,sy,sz);o.position.set(x,y,z);g.add(o)};
 if(ty==='hp'){add(G.bx,B(0xeeeeee),.34,.26,.2,0,0,0);add(G.bx,B(0xff2020),.22,.07,.215,0,0,0);add(G.bx,B(0xff2020),.07,.22,.215,0,0,0)}
 else if(ty==='money'){const cg=new THREE.CylinderGeometry(.14,.14,.05,12);for(let i=0;i<3;i++)add(cg,B(0xffd040),1,1,1,0,(i-1)*.06,0)}
 else if(ty==='gren'){add(G.sph,B(0x66dd44),.3,.3,.3,0,0,0);add(G.bx,B(0xdddddd),.08,.08,.08,0,.17,0)}
 else{add(G.bx,B(0xffe040),.2,.32,.14,0,0,0);add(G.bx,B(0x222222),.1,.05,.1,0,.18,0)}
 return g}
function dropAt(e){const n=(e.k==='boss'||e.k==='succubus')?5:(Math.random()<.4?1:0);for(let i=0;i<n;i++){const r=Math.random(),ty=r<.42?'hp':r<.82?'money':r<.92?'gren':'bat',m=mkDrop(ty),sx=i?(Math.random()-.5)*4:0,sz=i?(Math.random()-.5)*4:0;m.position.set(Math.max(-A+1,Math.min(A-1,e.g.position.x+sx)),.6,Math.max(-A+1,Math.min(A-1,e.g.position.z+sz)));scene.add(m);drops.push({m,t:12,ty})}}
function updDrops(dt,t){
 for(let i=drops.length-1;i>=0;i--){const d=drops[i],m=d.m,p=cam.position;d.t-=dt;m.rotation.y+=dt*2;m.position.y=.6+Math.sin(t*3+i)*.1;m.visible=d.t>3||Math.floor(t*8)%2===0;
  if(Math.hypot(m.position.x-p.x,m.position.z-p.z)<1.5){let tx;
   if(d.ty==='hp'){P.hp=Math.min(maxHp(),P.hp+30);tx='+30 HP'}else if(d.ty==='money'){const v=20+S.wave*5;S.money+=v;tx='+'+v+'$'}else if(d.ty==='gren'){S.gr=Math.min(5,S.gr+1);tx='+граната'}else{bat=Math.min(100,bat+40);tx='+заряд'}
   sfx('pick');pop(m.position.clone(),tx,true);scene.remove(m);drops.splice(i,1);continue}
  if(d.t<=0){scene.remove(m);drops.splice(i,1)}}
}
// модели v2
KINDS.zombie={hp:55,hg:12,sp:2.3,sg:.08,dmg:10,rw:10,r:.45};KINDS.monkey={hp:30,hg:8,sp:4,sg:.12,dmg:6,rw:15,r:.35};
const sphL=new THREE.SphereGeometry(.5,8,6),skC={};
function skin(k,c1,c2,c3,fur){if(skC[k])return skC[k];
 const c=document.createElement('canvas');c.width=c.height=128;const x=c.getContext('2d'),R=Math.random;
 x.fillStyle=c1;x.fillRect(0,0,128,128);
 for(let i=0;i<500;i++){x.fillStyle='rgba(0,0,0,'+R()*.25+')';x.fillRect(R()*128,R()*128,1+R()*2,fur?1+R()*8:1+R()*2)}
 if(!fur){x.strokeStyle=c2;x.lineWidth=1;for(let i=0;i<14;i++){let px=R()*128,py=R()*128;x.beginPath();x.moveTo(px,py);for(let s=0;s<7;s++){px+=(R()-.5)*20;py+=(R()-.5)*20;x.lineTo(px,py)}x.stroke()}}
 for(let i=0;i<7;i++){const px=R()*128,py=R()*128,r=5+R()*14,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,c3);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2)}
 return skC[k]=new THREE.CanvasTexture(c)}
