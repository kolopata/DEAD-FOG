// ---------- враги ----------
function spawn(monkey){
 const g=new THREE.Group(),parts=[];
 const add=(...a)=>{const m=box(a[0],a[1],a[2],a[3],a[4],a[5],a[6],g,a[7]);parts.push(m);return m};
 let e;
 if(!monkey){
  add(.6,.8,.3,0x3d5a3a,0,1.1,0);add(.2,.7,.2,0x262634,-.15,.35,0);add(.2,.7,.2,0x262634,.15,.35,0);
  add(.15,.15,.65,0x4c6a45,-.4,1.35,.3);add(.15,.15,.65,0x4c6a45,.4,1.35,.3);
  const h=add(.38,.38,.38,0x72936a,0,1.7,0);h.userData.head=1;add(.07,.05,.02,0xff2020,-.1,1.72,.2,0xff0000);add(.07,.05,.02,0xff2020,.1,1.72,.2,0xff0000);
  e={hp:55+S.wave*12,sp:1.5+S.wave*.06,dmg:10,rw:10,r:.45};
 }else{
  add(.4,.5,.3,0x5a3a1e,0,.7,0);add(.14,.4,.14,0x3e2813,-.12,.2,0);add(.14,.4,.14,0x3e2813,.12,.2,0);
  add(.12,.8,.12,0x5a3a1e,-.3,.55,.1);add(.12,.8,.12,0x5a3a1e,.3,.55,.1);add(.06,.06,.6,0x3e2813,0,.6,-.4);
  const h=add(.32,.3,.3,0x7a5230,0,1.1,.05);h.userData.head=1;add(.18,.12,.02,0xd9a37a,0,1.07,.21);add(.06,.05,.02,0xff2020,-.08,1.15,.21,0xff0000);add(.06,.05,.02,0xff2020,.08,1.15,.21,0xff0000);
  e={hp:30+S.wave*8,sp:4+S.wave*.12,dmg:6,rw:15,r:.35,mk:1};
 }
 Object.assign(e,{g,parts,ph:Math.random()*6,at:0,monkey});
 parts.forEach(m=>m.userData.e=e);
 for(let t=0;t<20;t++){
  const s=Math.floor(rnd()*4),o=(rnd()*2-1)*(A-1.5),q=A-1.5;
  g.position.set(s<2?o:(s==2?-q:q),0,s<2?(s==0?-q:q):o);
  if(Math.hypot(g.position.x-cam.position.x,g.position.z-cam.position.z)>14)break;
 }
 detail(e);g.rotation.order='YXZ';scene.add(g);enemies.push(e);if(monkey)sfx('screech');
}
const fx=[],tracers=[],dying=[],pGeo=new THREE.BoxGeometry(.07,.07,.07),tGeo=new THREE.BoxGeometry(.015,.015,1);let shk=0;
function burst(pos,cols,n,sp,up){if(fx.length>260)return;for(let i=0;i<n;i++){const m=new THREE.Mesh(pGeo,new THREE.MeshBasicMaterial({color:cols[i%cols.length]}));m.position.copy(pos);m.scale.setScalar(.6+Math.random()*1.4);scene.add(m);fx.push({m,v:new THREE.Vector3((Math.random()-.5)*sp,Math.random()*sp*.8+up,(Math.random()-.5)*sp),t:.5+Math.random()*.6})}}
function tracer(a,b,col){const m=new THREE.Mesh(tGeo,new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:1,fog:false}));m.position.copy(a).lerp(b,.5);m.lookAt(b);m.scale.z=a.distanceTo(b);scene.add(m);tracers.push({m,t:.09})}
function pop(p,txt,gold){const v=p.clone().project(cam);if(v.z>1)return;const d=document.createElement('div');d.className='pop';d.textContent=txt;d.style.left=(v.x*.5+.5)*innerWidth+'px';d.style.top=(-v.y*.5+.5)*innerHeight+'px';if(gold)d.style.color='#ffd24a';$('hud').appendChild(d);setTimeout(()=>d.remove(),900)}
function updFx(dt){
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.t-=dt;f.v.y-=12*dt;f.m.position.addScaledVector(f.v,dt);if(f.m.position.y<.04){f.m.position.y=.04;f.v.set(0,0,0)}f.m.scale.multiplyScalar(1-dt*1.1);if(f.t<=0){scene.remove(f.m);f.m.material.dispose();fx.splice(i,1)}}
 for(let i=tracers.length-1;i>=0;i--){const q=tracers[i];q.t-=dt;q.m.material.opacity=Math.max(q.t/.09,0);if(q.t<=0){scene.remove(q.m);q.m.material.dispose();tracers.splice(i,1)}}
 for(let i=dying.length-1;i>=0;i--){const d=dying[i];d.t+=dt;const g=d.g;if(d.t<.45)g.rotation.x=-1.5*(d.t/.45);else g.scale.setScalar(Math.max(0,1-(d.t-.45)/.35)*(d.bs||1));if(d.t>.8){scene.remove(g);dying.splice(i,1)}}
}
function killE(e,head){if(e.dead)return;e.dead=1;const ix=enemies.indexOf(e);if(ix<0)return;enemies.splice(ix,1);S.money+=e.rw;const p=e.g.position.clone();p.y=1*(e.bs||1);
 burst(p,e.monkey?[0x8a1010,0x5a3a1e,0x3e2813]:[0x8a1010,0x3d5a3a,0x72936a],22,5,3);dying.push({g:e.g,t:0,bs:e.bs||1});e.g.scale.setScalar(e.bs||1);sfx(e.monkey?'mdie':'zdie');if(e.k==='boss'||e.k==='succubus'){burst(p,[0x8a1010,0xd4a017],50,8,5);shk=1;sfx('roar')}if(e.aura)e.aura.visible=false;if(e.st)e.st.forEach(s=>scene.remove(s.grp));if(e.bar){for(const kk in e.bar)scene.remove(e.bar[kk])}dropAt(e);S.kills[e.k||'zombie']=(S.kills[e.k||'zombie']||0)+1;pop(p,'+'+e.rw+'$'+(head?' ★':''),head)}
