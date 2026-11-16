// ---------- модели v3 ----------
const BP=[null,['#4a3030','#200808','rgba(255,90,10,.6)',0xff8800,0x111111,0],['#3c4038','#101010','rgba(120,120,40,.6)',0xffcc00,0x2a3a2a,0],['#3a7a3a','#103a10','rgba(80,255,60,.6)',0x66ff66,0x2a2a10,0x115511],['#c8c0a0','#4a4030','rgba(60,50,30,.6)',0xff3030,0x2a2418,0],['#6a5060','#2a1020','rgba(160,40,200,.6)',0xaa44ff,0x3a1020,0x220844]];
function spawnM(k){if(GLBS[k])return spawnG(k);
 const K=KINDS[k],g=new THREE.Group(),parts=[],L={},R=Math.random,bv=Math.min(5,Math.max(1,Math.round(S.wave/5)));
 const e={k,monkey:k==='monkey',hp:K.hp+S.wave*K.hg,sp:K.sp+S.wave*K.sg,dmg:K.dmg,rw:K.rw,r:K.r,bs:1,ph:R()*6,at:0,ac:2+R()*3,cs:0,g,parts,L,lm:1,arm:0,sw:.1};e.mhp=e.hp;S.seen[k]=1;
 const mt=(c,em,map,tr)=>new THREE.MeshLambertMaterial({color:c,emissive:em||0,map:map||null,transparent:!!tr,opacity:tr?0.55:1});
 const el=(p,w,h,d,m,x,y,z,hd,geo)=>{const o=new THREE.Mesh(geo||G.sph,m);o.scale.set(w,h,d);o.position.set(x,y,z);p.add(o);parts.push(o);if(hd)o.userData.head=1;return o};
 const sg=(p,w,l,d,m,x,y,z)=>el(p,w,l,d,m,x,y-l/2,z,0,G.cy);
 const gr=(p,x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);p.add(q);return q};
 const tooth=(p,n,w,y,z,dn,m,len)=>{for(let i=0;i<n;i++){const o=new THREE.Mesh(G.cone,m);o.scale.set(.025,len,.025);o.position.set((i-(n-1)/2)*w/n,y,z);if(dn)o.rotation.x=Math.PI;p.add(o)}};
 const cm=mt(0x2a2420);
 const human=o=>{
  const H=o.H||1,F=o.fat||0,hh=.45+.5*H,sk=mt(0xffffff,o.em||0,o.sk),dk=mt(0x120a0a),bn=mt(0xd8d0b0),cl=mt(o.cl||0x2a2a22),bl=mt(0x6a0606,0x200000),ey=mt(o.ey,o.ey),cw=o.claw||.12,sx=.19+.22*F;
  for(const sd of [-1,1]){
   const lg=gr(g,sd*.16,hh,0),kn=gr(lg,0,-.46*H,0);
   sg(lg,.21,.46*H,.21,sk,0,0,0);sg(kn,.16,.46*H,.16,sk,0,0,0);el(kn,.13,.07,.24,dk,0,-.47*H,.07,0,sphL);
   if(sd<0){L.legL=lg;L.kneeL=kn}else{L.legR=lg;L.kneeR=kn}
  }
  const tor=L.tor=gr(g,0,hh,0);tor.rotation.x=o.hunch||.2;
  el(tor,.36,.22,.24,sk,0,0,0);el(tor,.38+F,.36+F*.8,.26+F*.6,sk,0,.3,0);el(tor,.5+F*.6,.4,.3+F*.3,sk,0,.66,0);
  for(let i=0;i<5;i++)el(tor,.26*(1+F),.022,.06,bn,0,.5+i*.075,.08+F*.05,0,sphL);
  el(tor,.18,.24,.06,bl,.08,.55,.09+F*.05,0,sphL);
  for(let i=0;i<6;i++)el(tor,.05,.05,.04,bn,0,.15+i*.1,-.09,0,sphL);
  for(const sd of [-1,1])el(tor,.08,.3,.03,cl,sd*.14,.55,.1+F*.05,0,sphL);
  const nk=gr(tor,0,.8,.02);sg(nk,.12,.14,.12,sk,0,0,0);
  const hd=L.head=gr(tor,0,.88,.05);
  el(hd,.3,.34,.32,sk,0,.12,0,1);
  for(const sd of [-1,1]){el(hd,.1,.08,.05,dk,sd*.09,.17,.115,0,sphL);el(hd,.04,.04,.03,ey,sd*.09,.17,.135,0,sphL)}
  el(hd,.05,.06,.04,dk,0,.08,.125,0,sphL);tooth(hd,6,.17,0,.11,1,toothM,.05);
  const jw=L.jaw=gr(hd,0,-.02,.04);el(jw,.2,.08,.22,sk,0,-.04,.05,0,sphL);el(jw,.1,.03,.12,bl,0,-.01,.07,0,sphL);tooth(jw,5,.15,0,.13,0,toothM,.05);
  for(let i=0;i<6;i++){const o2=el(hd,.02,.28,.02,dk,(i-2.5)*.045,.12,-.16,0,G.cy);o2.rotation.x=.25}
  for(const sd of [-1,1]){
   const ar=gr(tor,sd*sx,.78,0),el2=gr(ar,0,-.34*H,0);
   sg(ar,.14,.34*H,.14,sk,0,0,0);sg(el2,.11,.32*H,.11,sk,0,0,0);el(el2,.1,.14,.06,sk,0,-.35*H,0,0,sphL);
   for(let i=-1;i<=1;i++){const f=new THREE.Mesh(G.cone,cm);f.scale.set(.02,cw,.02);f.position.set(i*.03,-.4*H-cw/2,0);f.rotation.x=Math.PI;el2.add(f)}
   if(sd<0){L.armL=ar;L.elL=el2}else{L.armR=ar;L.elR=el2}
  }
  return sx;
 };
 if(k==='zombie'){human({sk:skin('z','#55664a','#3a2a44','rgba(110,10,10,.8)'),ey:0xff2020,cl:0x3a342a,hunch:.3,claw:.1});e.arm=-1.35;e.sw=.1;e.lm=.8}
 else if(k==='radio'){human({sk:skin('r','#3a7a3a','#103a10','rgba(120,255,80,.7)'),ey:0x88ff66,cl:0xb8a020,hunch:.25,claw:.1,em:0x14801a});
  el(L.tor,.22,.4,.2,mt(0xb8a020,0x302800),0,.5,-.2,0,G.cy);const gm=mt(0x88ff66,0x44ff44);for(let i=0;i<5;i++)el(L.tor,.1,.1,.1,gm,(R()-.5)*.4,.25+R()*.5,.08,0,sphL);
  const a=new THREE.Mesh(new THREE.CircleGeometry(1,40),new THREE.MeshBasicMaterial({map:auraTex(),transparent:true,depthWrite:false,fog:false}));a.rotation.x=-Math.PI/2;a.position.y=.06;a.scale.setScalar(5);g.add(a);e.aura=a;e.arm=-1.1;e.lm=.8}
 else if(k==='spitter'){human({sk:skin('s','#7a8a3a','#3a4a10','rgba(60,120,10,.8)'),ey:0xddff00,cl:0x2a3320,fat:.35,hunch:.1,claw:.08});
  const gm=mt(0xb8e040,0x446600);for(let i=0;i<6;i++)el(L.tor,.13,.13,.13,gm,(R()-.5)*.5,.2+R()*.5,.1,0,sphL);el(L.tor,.18,.18,.18,gm,-.18,.9,.06,0,sphL);e.arm=-.9;e.lm=.6}
 else if(k==='jumper'){human({sk:skin('j','#8a2a2a','#4a0a0a','rgba(200,40,40,.8)'),ey:0xffee00,H:1.25,hunch:.8,claw:.2,cl:0x1a1010});e.arm=-.5;e.sw=.5;e.lm=1.3}
 else if(k==='boss'){const p=BP[bv];const sx=human({sk:skin('b'+bv,p[0],p[1],p[2]),ey:p[3],cl:p[4],em:p[5],fat:.25,hunch:.25,claw:.2});
  const iron=mt(0x1c1c20),bn2=mt(0xd8d0b0);
  for(const sd of [-1,1]){el(L.tor,.22,.14,.22,iron,sd*(sx+.06),.84,0);const sp=new THREE.Mesh(G.cone,bn2);sp.scale.set(.07,.3,.07);sp.position.set(sd*(sx+.1),.98,0);sp.rotation.z=-sd*.5;L.tor.add(sp);
   const hn=new THREE.Mesh(G.cone,bn2);hn.scale.set(.09,.4,.09);hn.position.set(sd*.14,.38,0);hn.rotation.z=-sd*.4;L.head.add(hn)}
  el(L.tor,.22,.22,.06,mt(0xff6a10,0xff4400),0,.62,.1,0,sphL);e.bs=2.1+.05*bv;e.arm=-1.1;e.lm=.7;e.bn=bossName(S.wave)}
 else if(k==='monkey'){
  const fur=mt(0xffffff,0,skin('m','#4a3220','#000','rgba(0,0,0,.4)',1)),fc=mt(0xc99a78),dk=mt(0x120a0a),ey=mt(0xff2020,0xff0000);
  const tor=L.tor=gr(g,0,.62,0);tor.rotation.x=.55;
  el(tor,.4,.5,.32,fur,0,.2,0);el(tor,.32,.3,.26,fur,0,-.08,0);
  const hd=L.head=gr(tor,0,.5,.08);hd.rotation.x=-.5;
  el(hd,.3,.28,.28,fur,0,.1,0,1);el(hd,.17,.12,.2,fc,0,.03,.18,0,sphL);el(hd,.28,.05,.08,dk,0,.17,.1,0,sphL);
  for(const sd of [-1,1]){el(hd,.055,.045,.03,ey,sd*.08,.12,.125,0,sphL);el(hd,.1,.12,.04,fc,sd*.16,.1,-.02,0,sphL)}
  tooth(hd,2,.13,-.03,.26,1,toothM,.1);
  const jw=L.jaw=gr(hd,0,-.04,.08);el(jw,.15,.06,.18,fc,0,-.02,.07,0,sphL);tooth(jw,2,.13,.01,.15,0,toothM,.1);
  for(const sd of [-1,1]){
   const ar=gr(tor,sd*.2,.4,0),el2=gr(ar,0,-.42,0);
   sg(ar,.11,.42,.11,fur,0,0,0);sg(el2,.09,.42,.09,fur,0,0,0);el(el2,.12,.06,.16,fc,0,-.44,.05,0,sphL);
   if(sd<0){L.armL=ar;L.elL=el2}else{L.armR=ar;L.elR=el2}
   const lg=gr(g,sd*.14,.52,0),kn=gr(lg,0,-.26,0);sg(lg,.14,.26,.14,fur,0,0,0);sg(kn,.11,.28,.11,fur,0,0,0);el(kn,.1,.06,.2,fc,0,-.29,.05,0,sphL);
   if(sd<0){L.legL=lg;L.kneeL=kn}else{L.legR=lg;L.kneeR=kn}
  }
  L.tail=[];let tp=gr(tor,0,-.2,-.08);tp.rotation.x=2.2;for(let i=0;i<4;i++){sg(tp,.06,.2,.06,fur,0,0,0);const nx=gr(tp,0,-.2,0);L.tail.push(nx);tp=nx}
  e.arm=-.25;e.sw=.9;e.lm=1.2;
 }else if(k==='succubus'){
  const sk=mt(0xffffff,0x2a0508,skin('su','#c46a74','#6a1020','rgba(140,20,40,.5)')),lea=mt(0x2a0f18),lea2=mt(0x5a1a2c),gold=mt(0xc9a23a,0x3a2a00),ey=mt(0xff3020,0xff1000),hair=mt(0x1a0508),wm=mt(0x3a0a18,0x200008);
  for(const sd of [-1,1]){
   const lg=gr(g,sd*.2,1,0),kn=gr(lg,0,-.5,0);
   sg(lg,.27,.5,.27,sk,0,0,0);sg(lg,.3,.45,.3,lea,0,-.05,0);sg(kn,.2,.5,.2,sk,0,0,0);sg(kn,.23,.5,.23,lea,0,0,0);el(kn,.2,.1,.32,lea2,0,-.5,.08,0,sphL);
   if(sd<0){L.legL=lg;L.kneeL=kn}else{L.legR=lg;L.kneeR=kn}
  }
  const tor=L.tor=gr(g,0,1,0);
  el(tor,.62,.34,.4,sk,0,0,0);for(const sd of [-1,1])el(tor,.32,.32,.32,sk,sd*.15,-.02,-.17);
  el(tor,.82,.34,.72,lea2,0,-.04,-.02,0,G.cy);el(tor,.84,.05,.74,gold,0,.12,-.02,0,G.cy);
  el(tor,.3,.32,.26,sk,0,.28,0);el(tor,.34,.3,.3,lea,0,.3,0,0,G.cy);el(tor,.37,.03,.33,gold,0,.45,0,0,G.cy);
  el(tor,.42,.3,.27,sk,0,.64,0);
  for(const sd of [-1,1]){el(tor,.25,.25,.25,sk,sd*.11,.6,.13);el(tor,.28,.28,.28,lea2,sd*.11,.6,.14);el(tor,.1,.1,.1,gold,sd*.11,.6,.27,0,sphL);el(tor,.16,.14,.16,lea2,sd*.22,.76,0)}
  el(tor,.46,.07,.3,lea,0,.76,0,0,G.cy);
  const nk=gr(tor,0,.84,0);sg(nk,.1,.14,.1,sk,0,0,0);
  const hd=L.head=gr(tor,0,.92,.02);el(hd,.24,.28,.25,sk,0,.12,0,1);
  for(const sd of [-1,1]){el(hd,.055,.035,.03,ey,sd*.07,.15,.105,0,sphL);const hn=new THREE.Mesh(G.cone,gold);hn.scale.set(.07,.4,.07);hn.position.set(sd*.11,.32,0);hn.rotation.z=-sd*.6;hn.rotation.x=-.3;hd.add(hn)}
  el(hd,.1,.03,.04,mt(0x8a1020),0,0,.095,0,sphL);tooth(hd,2,.07,-.01,.09,1,toothM,.05);
  for(let i=0;i<10;i++)sg(hd,.05,.7+R()*.3,.05,hair,(i-4.5)*.03,.26,-.12-R()*.05);
  for(const sd of [-1,1]){
   const ar=gr(tor,sd*.2,.72,0),el2=gr(ar,0,-.34,0);
   sg(ar,.12,.34,.12,sk,0,0,0);sg(el2,.12,.32,.12,lea2,0,0,0);el(el2,.1,.13,.06,sk,0,-.36,0,0,sphL);
   for(let i=-1;i<=1;i++){const f=new THREE.Mesh(G.cone,cm);f.scale.set(.02,.14,.02);f.position.set(i*.03,-.47,0);f.rotation.x=Math.PI;el2.add(f)}
   if(sd<0){L.armL=ar;L.elL=el2}else{L.armR=ar;L.elR=el2}
   const w=gr(tor,sd*.1,.66,-.16);w.rotation.y=sd*.5;el(w,1.5,.95,.04,wm,sd*.8,.3,0);el(w,1.4,.05,.05,lea,sd*.75,.62,0);
   if(sd<0)L.wingL=w;else L.wingR=w;
  }
  L.tail=[];let tp=gr(tor,0,0,-.3);tp.rotation.x=2;for(let i=0;i<5;i++){sg(tp,.07-i*.008,.22,.07-i*.008,sk,0,0,0);const nx=gr(tp,0,-.22,0);L.tail.push(nx);tp=nx}
  const spd=new THREE.Mesh(G.cone,lea2);spd.scale.set(.14,.2,.04);spd.position.set(0,-.1,0);spd.rotation.x=Math.PI;tp.add(spd);
  e.arm=-.5;e.sw=.25;e.lm=.9;e.bs=1.5;e.bn=bossName(30);
 }else{
  const w1=mt(0x9fb8ff,0x1a3a88,null,1),w2=mt(0xcfe0ff,0x335599,null,1),dk=mt(0x000000,0,null,1);
  const tor=L.tor=gr(g,0,.9,0);
  el(tor,.5,.7,.4,w1,0,.5,0);
  for(let i=0;i<5;i++){const o=el(tor,.3,.9,.2,w1,(i-2)*.14,-.2,(i%2?.05:-.05),0,G.cone);o.rotation.x=Math.PI}
  const hd=L.head=gr(tor,0,1.0,0);el(hd,.3,.36,.3,w2,0,0,0,1);
  for(const sd of [-1,1])el(hd,.09,.12,.04,dk,sd*.08,.04,.12,0,sphL);el(hd,.12,.18,.04,dk,0,-.12,.12,0,sphL);
  for(const sd of [-1,1]){
   const ar=gr(tor,sd*.24,.75,0),el2=gr(ar,0,-.5,0);sg(ar,.06,.5,.06,w2,0,0,0);sg(el2,.05,.5,.05,w2,0,0,0);
   for(let i=-1;i<=1;i++){const f=new THREE.Mesh(G.cone,cm);f.scale.set(.015,.15,.015);f.position.set(i*.025,-.58,0);f.rotation.x=Math.PI;el2.add(f)}
   if(sd<0){L.armL=ar;L.elL=el2}else{L.armR=ar;L.elR=el2}
  }
  e.arm=-1.1;e.sw=.15;e.lm=0;
 }
 e.h0=L.tor?L.tor.rotation.x:0;
 parts.forEach(m=>m.userData.e=e);g.rotation.order='YXZ';place(g);g.scale.setScalar(e.bs);scene.add(g);enemies.push(e);
 if(k==='boss'||k==='succubus')sfx('roar');else if(k==='monkey')sfx('screech');
}
function animE(e,dt,t){
 if(e.mx)e.mx.update(dt*(e.k==='monkey'?1.4:1));const L=e.L;if(!L)return;
 const k=e.k,bs=k==='boss'||k==='succubus',cs=e.cs||0,mv=(bs&&(cs===1||cs===3||cs===4||cs===5||cs===6))?0:1;
 const w=e.wp=(e.wp||0)+dt*(e.sp*1.9+1.2+(cs===2?8:0)),s=Math.sin(w);
 if(L.legL){L.legL.rotation.x=s*.55*e.lm*mv;L.legR.rotation.x=-s*.55*e.lm*mv;L.kneeL.rotation.x=Math.max(0,-s)*.7*mv;L.kneeR.rotation.x=Math.max(0,s)*.7*mv}
 if(bs&&L.armL){
  const T=cs===0?[e.arm+s*.3,e.arm-s*.3,e.h0,Math.sin(w*.5)*.15,0]:cs===1?[.7,.7,e.h0+.7,0,0]:cs===2?[.9,.9,e.h0+.9,0,0]:cs===3?[-2.9,-2.9,e.h0-.5,0,0]:cs===4?[-.3,-.3,e.h0+.6,0,0]:cs===6?[-1.5,-1.5,e.h0,0,0]:[-1.2,-1.2,e.h0,0,1.3];
  const r=Math.min(1,dt*(cs===4?25:8));
  L.armL.rotation.x+=(T[0]-L.armL.rotation.x)*r;L.armR.rotation.x+=(T[1]-L.armR.rotation.x)*r;
  L.armL.rotation.z+=(-T[4]-L.armL.rotation.z)*r;L.armR.rotation.z+=(T[4]-L.armR.rotation.z)*r;
  L.tor.rotation.x+=(T[2]-L.tor.rotation.x)*r;L.tor.rotation.y+=(T[3]-L.tor.rotation.y)*r;
  L.tor.rotation.z=(cs===1||cs===3)?Math.sin(t*40)*.04:0;
  L.elL.rotation.x=L.elR.rotation.x=cs===3?-.2:-.4;
 }else if(L.armL){
  L.armL.rotation.x=e.arm+s*e.sw;L.armR.rotation.x=e.arm-s*e.sw;L.elL.rotation.x=-.3-Math.max(0,s)*.3;L.elR.rotation.x=-.3-Math.max(0,-s)*.3;
  if(L.tor)L.tor.rotation.z=Math.sin(w*.5)*.07*(k==='ghost'?.3:1);
 }
 if(L.head)L.head.rotation.z=Math.sin(t*1.3+e.ph)*.18*(bs?.4:1);
 if(L.jaw)L.jaw.rotation.x=.25+.2*Math.sin(t*5+e.ph)*(k==='monkey'?1.5:.7)+(cs===1?.4:0);
 if(L.tail)L.tail.forEach((q,i)=>q.rotation.z=Math.sin(t*5+i*.8+e.ph)*.5);
 if(L.wingL){const f=Math.sin(t*3+e.ph)*.35;L.wingL.rotation.z=-(.3+f);L.wingR.rotation.z=.3+f}
 if(k==='ghost'&&L.tor)L.tor.position.y=.9+Math.sin(t*2+e.ph)*.04;
}
