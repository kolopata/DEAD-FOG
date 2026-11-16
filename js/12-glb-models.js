// ---------- GLB-модели ----------
const KL=['zombie','monkey','spitter','jumper','ghost','radio','boss','succubus'],KN={zombie:'Зомби',monkey:'Обезьяна',spitter:'Плюющийся',jumper:'Прыгун',ghost:'Призрак',radio:'Радиоактивный',boss:'Босс',succubus:'Суккуб'},KH={zombie:1.9,monkey:1.1,spitter:1.9,jumper:1.9,ghost:2.1,radio:1.9,boss:1.9,succubus:1.9};
const GLBS={},barL=[];let GCFG={};
try{GCFG=JSON.parse(localStorage.getItem('deadfog_glbcfg')||'{}')}catch(e){}
function gcSave(){try{localStorage.setItem('deadfog_glbcfg',JSON.stringify(GCFG))}catch(e){}}
function idb(cb){try{const r=indexedDB.open('deadfog_models',1);r.onupgradeneeded=()=>r.result.createObjectStore('m');r.onsuccess=()=>cb(r.result);r.onerror=()=>{}}catch(e){}}
function idbPut(k,v){idb(db=>{try{db.transaction('m','readwrite').objectStore('m').put(v,k)}catch(e){}})}
function idbDel(k){idb(db=>{try{db.transaction('m','readwrite').objectStore('m').delete(k)}catch(e){}})}
function idbAll(){idb(db=>{try{const q=db.transaction('m','readonly').objectStore('m').openCursor();q.onsuccess=()=>{const c=q.result;if(c){parseGlb(c.key,c.value.buf,c.value.name,false);c.continue()}}}catch(e){}})}
function parseGlb(k,buf,name,save,done){
 try{new THREE.GLTFLoader().parse(buf,'',gl=>{
  const root=new THREE.Group(),m=gl.scene;root.add(m);
  const box=new THREE.Box3().setFromObject(m),sz=box.getSize(new THREE.Vector3()),cen=box.getCenter(new THREE.Vector3()),s=KH[k]/(sz.y||1);
  m.scale.setScalar(s);m.position.set(-cen.x*s,-box.min.y*s,-cen.z*s);
  GLBS[k]={root,clips:gl.animations||[],name};
  if(save)idbPut(k,{buf,name});
  if(done)done(true)},()=>{if(done)done(false)})}catch(e){if(done)done(false)}}
function spawnG(k){
 const K=KINDS[k],G0=GLBS[k],c=GCFG[k]||{sc:1,yaw:0},g=new THREE.Group(),R=Math.random,bsb=k==='boss'?2.1:k==='succubus'?1.5:1;
 const e={k,monkey:k==='monkey',hp:K.hp+S.wave*K.hg,sp:K.sp+S.wave*K.sg,dmg:K.dmg,rw:K.rw,r:K.r,bs:bsb*(c.sc||1),ph:R()*6,at:0,ac:2+R()*3,cs:0,g,parts:[],lm:1,arm:0,sw:.1,h0:0};e.mhp=e.hp;S.seen[k]=1;
 if(k==='boss')e.bn=bossName(S.wave);if(k==='succubus')e.bn=bossName(30);
 const mdl=THREE.SkeletonUtils.clone(G0.root);mdl.rotation.y=(c.yaw||0)*Math.PI/180;g.add(mdl);
 if(G0.clips.length){const mx=new THREE.AnimationMixer(mdl),cl=G0.clips.find(a=>/walk|run|move/i.test(a.name))||G0.clips.find(a=>!/idle|death|die|dead/i.test(a.name))||G0.clips[0];mx.clipAction(cl).play();e.mx=mx}
 const H=KH[k],hb=new THREE.MeshLambertMaterial({visible:false}),bx=new THREE.Mesh(G.bx,hb.clone()),hd=new THREE.Mesh(G.sph,hb.clone());
 bx.scale.set(.6,H*.55,.45);bx.position.y=H*.42;hd.scale.setScalar(H*.2);hd.position.y=H*.88;hd.userData.head=1;g.add(bx,hd);e.parts.push(bx,hd);
 if(k==='radio'){const a=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({map:auraTex(),transparent:true,depthWrite:false,fog:false}));a.rotation.x=-Math.PI/2;a.position.y=.06;a.scale.setScalar(5);g.add(a);e.aura=a}
 e.parts.forEach(m=>m.userData.e=e);g.rotation.order='YXZ';place(g);g.scale.setScalar(e.bs);scene.add(g);enemies.push(e);
 if(k==='boss'||k==='succubus')sfx('roar');else if(k==='monkey')sfx('screech');
}
function bar3d(e){
 if(!e.bar){const mk=(c,w,h)=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({color:c,fog:false,depthTest:false,transparent:true}));s.center.set(0,.5);s.scale.set(w,h,1);scene.add(s);return s};
  const cv=document.createElement('canvas');cv.width=512;cv.height=64;const x=cv.getContext('2d');x.font='bold 36px Courier New';x.textAlign='center';x.fillStyle='#e8c24a';x.shadowColor='#000';x.shadowBlur=6;x.fillText(e.bn||'БОСС',256,44);
  const tx=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(cv),fog:false,depthTest:false,transparent:true}));scene.add(tx);
  e.bar={bd:mk(0x7a1c1c,1,1),bg:mk(0x1a0606,1,1),fg:mk(0xd4a017,1,1),tx};e.bar.bd.renderOrder=996;e.bar.bg.renderOrder=997;e.bar.fg.renderOrder=998;tx.renderOrder=999;barL.push(e)}
 const W=4,k=Math.max(1,cam.position.distanceTo(e.g.position)/12),hw=W*k/2,rx=Math.cos(yaw),rz=-Math.sin(yaw),y=e.g.position.y+2.4*(e.bs||1)+.9*k,px=e.g.position.x,pz=e.g.position.z,B=e.bar;
 B.bd.scale.set((W+.12)*k,.24*k,1);B.bd.position.set(px-rx*(hw+.06*k),y,pz-rz*(hw+.06*k));
 B.bg.scale.set(W*k,.16*k,1);B.bg.position.set(px-rx*hw,y,pz-rz*hw);
 B.fg.scale.set(Math.max(.001,W*k*Math.max(0,e.hp/e.mhp)),.12*k,1);B.fg.position.copy(B.bg.position);
 B.tx.scale.set(3.6*k,.45*k,1);B.tx.position.set(px,y+.38*k,pz);
}
function devModels(){
 let h='<h2>Модели .glb (замена процедурных)</h2><p class=s>Загрузите свой .glb для любого монстра. Модель масштабируется до роста около 1,9 м, лицом по оси +Z. Сохраняется в браузере.</p>';
 KL.forEach((k,i)=>{const g=GLBS[k],c=GCFG[k]||{sc:1,yaw:0};
  h+=`<div class=bc><b>${KN[k]}</b> <span class=s>${g?'GLB: '+g.name:'процедурная'}</span><br><label class=fl>Загрузить .glb<input type=file accept=.glb hidden onchange=devPick(this,${i})></label>`
  +(g?`<button onclick=devGlbSet(${i},0)>Сброс</button><button onclick=devGlbSet(${i},1)>Размер −</button><button onclick=devGlbSet(${i},2)>Размер +</button><button onclick=devGlbSet(${i},3)>Повернуть 90°</button> <span class=s>×${(c.sc||1).toFixed(2)}, ${c.yaw||0}°</span>`:'')+`</div>`});
 return h}
function devPick(inp,i){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=()=>parseGlb(KL[i],r.result,f.name,true,ok=>{toast(ok?'Модель загружена: '+KN[KL[i]]:'Не удалось прочитать .glb');devWin()});r.readAsArrayBuffer(f)}
function devGlbSet(i,a){const k=KL[i];
 if(a===0){delete GLBS[k];delete GCFG[k];idbDel(k)}
 else{const c=GCFG[k]||(GCFG[k]={sc:1,yaw:0});if(a===1)c.sc=Math.max(.3,(c.sc||1)*.9);if(a===2)c.sc=(c.sc||1)*1.1;if(a===3)c.yaw=((c.yaw||0)+90)%360}
 gcSave();devWin()}
idbAll();
