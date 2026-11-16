// ---------- голоса мобов, детали моделей, смена оружия ----------
let DEST=null;
function vib(f1,f2,dur,type,vol,rate,depth,lpf){const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain(),l=AC.createOscillator(),lg=AC.createGain(),f=AC.createBiquadFilter();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);l.frequency.value=rate;lg.gain.value=depth;l.connect(lg);lg.connect(o.frequency);f.type='lowpass';f.frequency.value=lpf||2000;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol,t+dur*.15);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(f);f.connect(g);g.connect(DEST||mg);o.start(t);l.start(t);o.stop(t+dur+.05);l.stop(t+dur+.05)}
function voice(e,dt,p){
 if(!AC||muted)return;
 e.vt=(e.vt===undefined?3+Math.random()*8:e.vt)-dt;if(e.vt>0)return;
 e.vt=(e.k==='boss'?5:7)+Math.random()*9;
 const dx=e.g.position.x-p.x,dz=e.g.position.z-p.z,d=Math.hypot(dx,dz)||1,v=Math.max(0,1-d/28);if(v<.06)return;
 const pn=AC.createStereoPanner?AC.createStereoPanner():null;if(pn){pn.pan.value=Math.max(-1,Math.min(1,(dx*Math.cos(yaw)-dz*Math.sin(yaw))/d));pn.connect(mg);DEST=pn}
 const k=e.k||(e.monkey?'monkey':'zombie');
 if(k==='zombie'){vib(130,55,1.3,'sawtooth',.2*v,5,12,500);nz(1,400,'lowpass',.1*v,120)}
 else if(k==='monkey')vib(800,1900,.6,'sawtooth',.13*v,18,120,3500);
 else if(k==='spitter'){vib(180,90,1,'square',.1*v,12,25,700);nz(.8,900,'bandpass',.12*v,300)}
 else if(k==='jumper')vib(1300,350,.7,'sawtooth',.12*v,9,80,3000);
 else if(k==='ghost'){vib(520,330,2.2,'sine',.18*v,4,30,1500);vib(780,495,2.2,'sine',.09*v,5,30,1500)}
 else if(k==='succubus'){vib(600,300,1.6,'sawtooth',.2*v,7,40,2500);vib(1200,600,1.6,'sine',.1*v,6,30,3000)}else if(k==='radio'){vib(110,60,1.2,'sawtooth',.14*v,9,18,600);nz(.6,300,'lowpass',.1*v,100)}else{vib(70,35,1.8,'sawtooth',.45*v,6,8,400);vib(140,70,1.8,'square',.16*v,7,10,600)}
 DEST=null;
}
const G={sph:new THREE.SphereGeometry(.5,14,10),cy:new THREE.CylinderGeometry(.5,.4,1,12),cz:new THREE.CylinderGeometry(.4,.5,1,10).rotateX(Math.PI/2),cone:new THREE.ConeGeometry(.5,1,8),bx:new THREE.BoxGeometry(1,1,1)};
const toothM=new THREE.MeshLambertMaterial({color:0xd8d0b0}),clawM=new THREE.MeshLambertMaterial({color:0x2a2420}),boneM=new THREE.MeshLambertMaterial({color:0xbdb59a}),pusM=new THREE.MeshLambertMaterial({color:0xb8d84a,emissive:0x335500}),earM=new THREE.MeshLambertMaterial({color:0xd9a37a});
function detail(e){
 const g=e.g,k=e.k||(e.monkey?'monkey':'zombie'),R=Math.random;
 const mk=(geo,mt,x,y,z,sx,sy,sz,rx)=>{const m=new THREE.Mesh(geo,mt);m.position.set(x,y,z);m.scale.set(sx,sy,sz);if(rx)m.rotation.x=rx;g.add(m)};
 for(const m of e.parts){
  const q=m.geometry.parameters;if(!q||q.width===undefined)continue;
  const w=q.width,h=q.height,d=q.depth;if(Math.max(w,h,d)<.25&&!m.userData.head)continue;
  let geo=G.sph;
  if(m.userData.head)geo=G.sph;
  else if(w<.12&&d<.12&&h>.3)geo=G.cone;
  else if(d>1.25*Math.max(w,h)&&d>.4){geo=G.cz;if(Math.min(w,h)>.08)m.userData.arm=1}
  else if(h>1.25*Math.max(w,d))geo=G.cy;
  m.geometry.dispose();m.geometry=geo;m.scale.set(w,h,d);
 }
 if(k==='ghost')return;
 for(const m of e.parts){
  const p=m.position,s=m.scale;
  if(m.userData.head){for(let i=0;i<5;i++)mk(G.cone,toothM,p.x+(i-2)*s.x*.17,p.y-s.y*.3,p.z+s.z*.38,.035,.07,.035,Math.PI);if(k==='monkey')for(const sd of [-1,1])mk(G.sph,earM,p.x+sd*s.x*.55,p.y+s.y*.1,p.z,.14,.14,.06)}
  if(m.userData.arm)for(let i=-1;i<=1;i++)mk(G.cone,clawM,p.x+i*s.x*.3,p.y,p.z+s.z/2+.06,.025,.12,.025,Math.PI/2);
 }
 const t=e.parts[0],s=t.scale,p=t.position;
 if(k==='zombie'||k==='jumper'||k==='boss')for(let i=-1;i<=1;i++)mk(G.bx,boneM,p.x,p.y+i*s.y*.22,p.z+s.z*.52,s.x*.75,.035,.03);
 if(k==='spitter')for(let i=0;i<5;i++)mk(G.sph,pusM,p.x+(R()-.5)*s.x*.8,p.y+(R()-.5)*s.y*.8,p.z+s.z*.45,.14,.14,.14);
 if(k==='boss')for(let i=0;i<6;i++)mk(G.cone,boneM,p.x+(i-2.5)*s.x*.25,p.y+(R()-.5)*s.y*.6,p.z-s.z*.5,.12,.5,.12,-Math.PI/2);
}
function cycleW(dir){if(st!=='play')return;let i=S.cur;for(let n=0;n<5;n++){i=(i+dir+5)%5;if(S.own[i]){if(i!==S.cur){S.cur=i;setGun()}return}}}
addEventListener('wheel',e=>{if(st==='play')cycleW(e.deltaY>0?1:-1)});
