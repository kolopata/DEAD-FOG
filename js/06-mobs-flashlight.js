// ---------- новые мобы, фонарик, подсветка ----------
let bossDone=0,hint=0,bat=100,flOn=true,flLock=false;
const RED=new THREE.Color(0xff2a2a),proj=[],marks=[],sGeo=new THREE.SphereGeometry(.2,8,6),sMat=new THREE.MeshBasicMaterial({color:0x9aff3a}),mGeo=new THREE.OctahedronGeometry(.28);
const KINDS={spitter:{hp:40,hg:9,sp:2,sg:.05,dmg:8,rw:20,r:.4},jumper:{hp:45,hg:10,sp:2,sg:.04,dmg:9,rw:22,r:.4},ghost:{hp:50,hg:10,sp:2.6,sg:.07,dmg:9,rw:25,r:.4},boss:{hp:1800,hg:350,sp:3.6,sg:.03,dmg:25,rw:400,r:1.1}};
function place(g){for(let t=0;t<20;t++){const s=Math.floor(rnd()*4),o=(rnd()*2-1)*(A-1.5),q=A-1.5;g.position.set(s<2?o:(s==2?-q:q),0,s<2?(s==0?-q:q):o);if(Math.hypot(g.position.x-cam.position.x,g.position.z-cam.position.z)>14)break}}
function spawnWave(){
 const w=S.wave;if(w%5===0&&!bossDone){bossDone=1;return spawnM(S.wave===30?'succubus':'boss')}
 const o=[['zombie',1]];if(w>=2)o.push(['monkey',.55]);if(w>=3)o.push(['spitter',.45]);if(w>=4)o.push(['jumper',.45]);if(w>=5)o.push(['ghost',.4]);if(w>=6)o.push(['radio',.4]);
 let r=rnd()*o.reduce((a,b)=>a+b[1],0),k='zombie';for(const q of o){if(r<q[1]){k=q[0];break}r-=q[1]}
 spawnM(k);
}
function spawnK(k){
 const g=new THREE.Group(),parts=[],add=(...a)=>{const m=box(a[0],a[1],a[2],a[3],a[4],a[5],a[6],g,a[7]);parts.push(m);return m},K=KINDS[k];
 const e={k,hp:K.hp+S.wave*K.hg,sp:K.sp+S.wave*K.sg,dmg:K.dmg,rw:K.rw,r:K.r,bs:1,ph:Math.random()*6,at:0,ac:2+Math.random()*3,cs:0,g,parts};e.mhp=e.hp;
 const eyes=(y,z,c,sx)=>{add(.07,.05,.02,c,-sx,y,z,c);add(.07,.05,.02,c,sx,y,z,c)};
 if(k==='spitter'){
  add(.7,.7,.45,0x6b7a2e,0,.9,0);add(.2,.6,.2,0x2a2f1a,-.18,.3,0);add(.2,.6,.2,0x2a2f1a,.18,.3,0);add(.14,.14,.5,0x7d8f3a,-.45,1,.2);add(.14,.14,.5,0x7d8f3a,.45,1,.2);
  add(.5,.42,.5,0x8fa347,0,1.5,.05).userData.head=1;add(.3,.12,.1,0x2a4010,0,1.38,.3,0x66ff22);eyes(1.58,.3,0xffff00,.14);
 }else if(k==='jumper'){
  add(.45,.6,.3,0x8a3a3a,0,.95,0);add(.14,.8,.14,0x5a2020,-.14,.4,-.05);add(.14,.8,.14,0x5a2020,.14,.4,-.05);add(.1,.1,.8,0xa04a4a,-.3,.9,.35);add(.1,.1,.8,0xa04a4a,.3,.9,.35);
  add(.3,.3,.3,0xb55a5a,0,1.45,.1).userData.head=1;eyes(1.5,.26,0xffee00,.08);
 }else if(k==='ghost'){
  add(.7,1.2,.4,0x8fb4ff,0,1.1,0,0x274a88);add(.12,.12,.7,0xaac8ff,-.45,1.3,.3,0x274a88);add(.12,.12,.7,0xaac8ff,.45,1.3,.3,0x274a88);
  add(.4,.4,.4,0xcfe0ff,0,1.95,0,0x335599).userData.head=1;add(.08,.14,.02,0x000000,-.1,1.97,.21);add(.08,.14,.02,0x000000,.1,1.97,.21);
  parts.forEach(m=>{m.material.transparent=true;m.material.opacity=.55});
 }else{
  add(.7,.9,.4,0x5a2a2a,0,1.1,0);add(.24,.75,.24,0x1e1e26,-.17,.38,0);add(.24,.75,.24,0x1e1e26,.17,.38,0);add(.2,.2,.8,0x7a3a3a,-.5,1.4,.35);add(.2,.2,.8,0x7a3a3a,.5,1.4,.35);
  add(.45,.45,.45,0x8a4a4a,0,1.8,0).userData.head=1;add(.09,.35,.09,0xddd5c0,-.17,2.15,0);add(.09,.35,.09,0xddd5c0,.17,2.15,0);eyes(1.84,.23,0xffaa00,.12);
  e.bs=2.2;
 }
 detail(e);parts.forEach(m=>m.userData.e=e);g.rotation.order='YXZ';place(g);g.scale.setScalar(e.bs);scene.add(g);enemies.push(e);
 if(k==='boss')sfx('roar');
}
function spit(e,p){const m=new THREE.Mesh(sGeo,sMat);m.position.set(e.g.position.x,1.5,e.g.position.z);const dx=p.x-m.position.x,dy=1.2-m.position.y,dz=p.z-m.position.z,l=Math.hypot(dx,dy,dz)||1;scene.add(m);proj.push({m,v:new THREE.Vector3(dx/l,dy/l,dz/l).multiplyScalar(11),t:3,dmg:e.dmg});sfx('spit')}
function updProj(dt,p){
 for(let i=proj.length-1;i>=0;i--){const q=proj[i],pp=q.m.position;q.t-=dt;pp.addScaledVector(q.v,dt);let dead=q.t<=0||pp.y<.05;
  if(!dead&&Math.hypot(pp.x-p.x,pp.z-p.z)<.7&&pp.y<2){damage(q.dmg);burst(pp,[0x9aff3a,0x4a8a10],8,3,1);dead=true}
  if(!dead)for(const c of C)if(Math.abs(pp.x-c.x)<c.w&&Math.abs(pp.z-c.z)<c.d&&pp.y<2.5){dead=true;burst(pp,[0x9aff3a],5,2,.5);break}
  if(!dead&&(Math.abs(pp.x)>A||Math.abs(pp.z)>A))dead=true;
  if(dead){scene.remove(q.m);proj.splice(i,1)}}
}
function updK(e,dt,t,p){
 if(!e.k)return false;
 const g=e.g,q=g.position,dx=p.x-q.x,dz=p.z-q.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d;
 let mx=ux,mz=uz,sp=e.sp,go=true,reach=1.3;
 g.rotation.y=Math.atan2(dx,dz);e.at-=dt;if(e.k==='monkey'){const zz=Math.sin(t*4+e.ph)*.8;mx+=-uz*zz;mz+=ux*zz;q.y=Math.abs(Math.sin(t*8+e.ph))*.3}animE(e,dt,t);
 if(e.k==='spitter'){
  if(d<7){mx=-ux;mz=-uz;sp*=.8}else if(d<11){const s=Math.sin(e.ph+t*.5)>0?1:-1;mx=-uz*s;mz=ux*s;sp*=.6}
  e.ac-=dt;if(e.ac<=0&&d<22){e.ac=2+Math.random()*1.3;spit(e,p)}
  g.rotation.z=Math.sin(t*4+e.ph)*.06;
 }else if(e.k==='jumper'){
  if(e.air){q.x+=e.vx*dt;q.z+=e.vz*dt;e.vy-=20*dt;q.y+=e.vy*dt;g.rotation.x=-.5;go=false;
   if(q.y<=0){q.y=0;e.air=0;g.rotation.x=0;if(d<1.5)damage(e.dmg*1.15);e.ac=4+Math.random()*2.5}}
  else if(e.jt>0){go=false;e.jt-=dt;g.rotation.x=.5;if(e.jt<=0){g.rotation.x=0;e.air=1;e.vy=7.5;const sv=Math.min(d/.75,12);e.vx=ux*sv;e.vz=uz*sv;sfx('spit')}}
  else{e.ac-=dt;if(e.ac<=0&&d>4&&d<10){e.jt=.45;sfx('screech')}}
 }else if(e.k==='ghost'){
  q.y=.5+Math.sin(t*2+e.ph)*.25;const o=.4+.2*Math.sin(t*5+e.ph);e.parts.forEach(m=>m.material.opacity=o);
 }else if(e.k==='boss'||e.k==='succubus'){const r=bossAI(e,dt,ux,uz,d);go=r.go;mx=r.mx;mz=r.mz;sp=r.sp;reach=r.reach;if(r.ry!==undefined)g.rotation.y=r.ry
 }else if(e.k==='radio'){e.rt=(e.rt||0)-dt;e.aura.scale.setScalar(5+Math.sin(t*3)*.12);if(d<5.2){warn('☢ РАДИАЦИЯ! УЙДИТЕ ИЗ ЗЕЛЁНОЙ ЗОНЫ',.35,'#66ff66');if(e.rt<=0){e.rt=.45;rad(1.6);sfx('geiger')}}
 }
 if(go&&d>reach*.75){q.x+=mx*sp*dt;q.z+=mz*sp*dt}
 if(e.k==='ghost'){q.x=Math.max(-A+.6,Math.min(A-.6,q.x));q.z=Math.max(-A+.6,Math.min(A-.6,q.z))}else if(e.k==='boss'||e.k==='succubus'){let ty=0;for(const c of C)if(Math.abs(q.x-c.x)<c.w+.6&&Math.abs(q.z-c.z)<c.d+.6)ty=Math.max(ty,c.h);q.y+=(ty-q.y)*Math.min(1,dt*7);q.x=Math.max(-A+1.2,Math.min(A-1.2,q.x));q.z=Math.max(-A+1.2,Math.min(A-1.2,q.z))}else resolve(q,e.r);
 if(d<reach&&e.at<=0&&!e.air){e.at=.9;damage(e.dmg)}
 if(e.hit>0){e.hit-=dt;if(e.hit<=0)g.scale.setScalar(e.bs)}
 return true;
}
function lastMobs(t){
 const b=enemies.find(e=>e.k==='boss'||e.k==='succubus');$('bb').hidden=true;$('bn').style.display='none';for(const e of enemies)if(e.k==='boss'||e.k==='succubus')bar3d(e);for(let i=barL.length-1;i>=0;i--){const e=barL[i];if(!enemies.includes(e)){for(const kk in e.bar)scene.remove(e.bar[kk]);barL.splice(i,1)}}for(let i=rings.length-1;i>=0;i--)if(!enemies.includes(rings[i].e)){scene.remove(rings[i].m);rings.splice(i,1)}if(b)$('bf').style.width=Math.max(0,b.hp/b.mhp*100)+'%';
 for(let i=marks.length-1;i>=0;i--)if(!enemies.includes(marks[i].e)){scene.remove(marks[i].m);marks[i].m.material.dispose();marks.splice(i,1)}
 if(!(waveOn&&toSpawn===0&&enemies.length>0&&enemies.length<=3))return;
 if(!hint){hint=1;toast('Последние монстры подсвечены красным!')}
 const k=.5+.5*Math.sin(t*6);
 for(const e of enemies){
  if(e.k==='boss'||e.k==='succubus')continue;if(!e.mk){const m=new THREE.Mesh(mGeo,new THREE.MeshBasicMaterial({color:0xff3030,fog:false,depthTest:false,transparent:true,opacity:.9}));m.renderOrder=999;scene.add(m);e.mk=m;marks.push({e,m})}
  e.mk.position.set(e.g.position.x,e.g.position.y+(2.4*(e.bs||1))+Math.sin(t*4)*.12,e.g.position.z);e.mk.rotation.y=t*2;e.mk.scale.setScalar(Math.max(1,cam.position.distanceTo(e.g.position)/12));
  if(!(e.k==='boss'||e.k==='succubus'))for(const m of e.parts){if(m.userData.oe===undefined)m.userData.oe=m.material.emissive.getHex();m.material.emissive.setHex(m.userData.oe).lerp(RED,k*.55)}
 }
}
function updFl(dt){
 if(flOn&&!flLock){bat-=dt*(infFl()?0:4);if(bat<=0){bat=0;flLock=true;flOn=false;toast('Фонарик сел! Ждите зарядку')}}
 else if(!flOn&&!nvOn){bat=Math.min(100,bat+dt*3);if(flLock&&bat>=25){flLock=false;toast('Фонарик снова доступен')}}
 fl.intensity=flOn?(bat<20?(Math.random()<.3?.4:1)*(.5+bat/20*1.7):2.2)*(Math.random()<.02?.5:1):0;
 $('fbf').style.width=bat+'%';$('fbf').style.background=flLock?'#a82424':'#e0c27a';
}
