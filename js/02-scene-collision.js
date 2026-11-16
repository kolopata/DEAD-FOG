// ---------- сцена ----------
const R=new THREE.WebGLRenderer({antialias:true});R.setSize(innerWidth,innerHeight);R.setPixelRatio(Math.min(devicePixelRatio,2));
document.body.prepend(R.domElement);
const scene=new THREE.Scene();scene.background=new THREE.Color(0x050806);scene.fog=new THREE.FogExp2(0x0a0707,.075);
const cam=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,.1,220);cam.rotation.order='YXZ';cam.position.set(0,1.6,0);scene.add(cam);
const amb=new THREE.AmbientLight(0x2a3a2a,.5);scene.add(amb);
const fl=new THREE.SpotLight(0xe8f0d0,2.2,34,.55,.6);fl.position.set(0,0,0);fl.target.position.set(0,0,-5);cam.add(fl,fl.target);
const flash=new THREE.PointLight(0xffc060,0,12);flash.position.set(0,0,-1);cam.add(flash);
const mat=(c,e)=>new THREE.MeshLambertMaterial({color:c,emissive:e||0});
function box(w,h,d,c,x,y,z,par,e){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c,e));m.position.set(x,y,z);par.add(m);return m}
function floorTex(){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d'),R=Math.random;
 x.fillStyle='#1c1e19';x.fillRect(0,0,512,512);
 for(let i=0;i<9000;i++){const v=18+R()*32|0;x.fillStyle='rgba('+v+','+(v+4)+','+(v-2)+',.55)';x.fillRect(R()*512,R()*512,1+R()*3,1+R()*3)}
 const blot=(n,a,b,col)=>{for(let i=0;i<n;i++){const px=R()*512,py=R()*512,r=a+R()*b,g=x.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,col+'.6)');g.addColorStop(1,col+'0)');x.fillStyle=g;x.fillRect(px-r,py-r,r*2,r*2)}};
 blot(26,20,60,'rgba(8,10,6,');blot(12,14,46,'rgba(120,8,8,');blot(10,6,16,'rgba(60,4,4,');
 x.strokeStyle='rgba(0,0,0,.6)';x.lineWidth=2;for(let i=0;i<=512;i+=128){x.beginPath();x.moveTo(i,0);x.lineTo(i,512);x.moveTo(0,i);x.lineTo(512,i);x.stroke()}
 x.strokeStyle='rgba(0,0,0,.9)';x.lineWidth=1.5;for(let i=0;i<16;i++){let px=R()*512,py=R()*512,a=R()*7;x.beginPath();x.moveTo(px,py);for(let s=0;s<14;s++){a+=(R()-.5)*1.2;px+=Math.cos(a)*14;py+=Math.sin(a)*14;x.lineTo(px,py)}x.stroke()}
 x.strokeStyle='rgba(185,178,150,.55)';x.lineWidth=3;x.lineCap='round';for(let i=0;i<9;i++){const px=R()*480+16,py=R()*480+16,a=R()*7;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*18,py+Math.sin(a)*18);x.stroke()}
 for(let i=0;i<4;i++){const px=R()*480+16,py=R()*480+16;x.fillStyle='rgba(190,185,160,.6)';x.beginPath();x.arc(px,py,7,0,7);x.fill();x.fillStyle='#000';x.fillRect(px-4,py-2,3,3);x.fillRect(px+1,py-2,3,3);x.fillRect(px-2,py+3,4,3)}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(6,6);return t}
function skyTex(){const c=document.createElement('canvas');c.width=1024;c.height=512;const x=c.getContext('2d'),R=Math.random;
 const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,'#030204');g.addColorStop(.42,'#140a12');g.addColorStop(.5,'#3a1410');g.addColorStop(.56,'#1a2410');g.addColorStop(1,'#050805');x.fillStyle=g;x.fillRect(0,0,1024,512);
 for(let i=0;i<260;i++){x.fillStyle='rgba(255,240,220,'+R()*.6+')';x.fillRect(R()*1024,R()*230,1,1)}
 const mx=300,my=170,gl=x.createRadialGradient(mx,my,10,mx,my,170);gl.addColorStop(0,'rgba(210,30,20,.5)');gl.addColorStop(1,'rgba(210,30,20,0)');x.fillStyle=gl;x.fillRect(mx-170,my-170,340,340);
 const md=x.createRadialGradient(mx-12,my-12,5,mx,my,54);md.addColorStop(0,'#e85a40');md.addColorStop(1,'#7a0e0e');x.fillStyle=md;x.beginPath();x.arc(mx,my,54,0,7);x.fill();
 for(let i=0;i<9;i++){x.fillStyle='rgba(60,0,0,.35)';x.beginPath();x.arc(mx+(R()-.5)*70,my+(R()-.5)*70,4+R()*9,0,7);x.fill()}
 for(let i=0;i<100;i++){x.fillStyle='rgba('+(8+R()*25|0)+',4,8,'+(.15+R()*.3)+')';x.beginPath();x.ellipse(R()*1024,60+R()*200,40+R()*120,6+R()*18,0,0,7);x.fill()}
 x.strokeStyle='#020202';x.lineCap='round';for(let i=0;i<46;i++){const bx=R()*1024,h=30+R()*50;x.lineWidth=4;x.beginPath();x.moveTo(bx,262);x.lineTo(bx+(R()-.5)*6,262-h);x.stroke();x.lineWidth=2;for(let k=0;k<4;k++){const yy=262-h*(.3+k*.18),dir=R()<.5?-1:1;x.beginPath();x.moveTo(bx,yy);x.lineTo(bx+dir*(10+R()*16),yy-8-R()*12);x.stroke()}}
 x.fillStyle='#020202';x.fillRect(0,260,1024,252);
 const t=new THREE.CanvasTexture(c);return t}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(A*2,A*2),new THREE.MeshLambertMaterial({map:floorTex()}));
const sky=new THREE.Mesh(new THREE.SphereGeometry(100,32,16),new THREE.MeshBasicMaterial({map:skyTex(),side:THREE.BackSide,fog:false,depthWrite:false}));sky.renderOrder=-1;scene.add(sky);
const moonL=new THREE.DirectionalLight(0x8a6a8a,.3);moonL.position.set(-5,10,-3);scene.add(moonL);ground.rotation.x=-Math.PI/2;scene.add(ground);
// стены арены
[[0,-A,A,.5],[0,A,A,.5],[-A,0,.5,A],[A,0,.5,A]].forEach(([x,z,w,d])=>{const m=box(w*2,4,d*2,0x2c2a27,x,2,z,scene);obsMeshes.push(m)});
// препятствия (фиксированная раскладка)
let sd=11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
for(let i=0;i<34;i++){
 const wall=rnd()<.3,w=wall?3+rnd()*5:1+rnd()*1.6,d=wall?.6:1+rnd()*1.6,h=wall?2.6:.9+rnd()*1.3;
 const x=(rnd()*2-1)*(A-3),z=(rnd()*2-1)*(A-3);if(Math.hypot(x,z)<5)continue;
 const rot=!wall||rnd()<.5;const W=rot?w:d,D=rot?d:w;
 const m=box(W,h,D,wall?0x37332e:[0x4a3a28,0x3e3326,0x2f3a2c][i%3],x,h/2,z,scene);obsMeshes.push(m);C.push({x,z,w:W/2,d:D/2,h});
}
// оружие в руках
const gun=new THREE.Group(),GUNS=[],GX=.24,GY=-.22,GZ=-.5;let shown=-1,swT=0,kick=0,mfT=0;gun.position.set(GX,GY,GZ);cam.add(gun);
(function(){
 const M=c=>new THREE.MeshLambertMaterial({color:c});
 const bx=(g,w,h,d,c,x,y,z,rx)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);if(rx)m.rotation.x=rx;g.add(m);return m};
 const cy=(g,r,l,c,x,y,z)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,l,10),M(c));m.rotation.x=Math.PI/2;m.position.set(x,y,z);g.add(m);return m};
 const fin=(g,z)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(.05,8,6),new THREE.MeshBasicMaterial({color:0xffd070}));m.position.set(0,0,z);m.visible=false;g.add(m);g.userData.mf=m;g.visible=false;gun.add(g);GUNS.push(g)};
 let g=new THREE.Group();
 bx(g,.07,.09,.3,0x2b2b2e,0,0,-.1);bx(g,.06,.17,.08,0x4a3322,0,-.12,.03,.2);bx(g,.05,.03,.06,0x111111,0,-.06,-.02);cy(g,.018,.06,0x888888,0,0,-.27);fin(g,-.32);
 g=new THREE.Group();
 cy(g,.03,.8,0x1a1a1a,-.03,.02,-.35);cy(g,.03,.8,0x1a1a1a,.03,.02,-.35);bx(g,.1,.08,.26,0x6b4423,0,-.03,-.18);bx(g,.08,.1,.2,0x555555,0,0,.05);bx(g,.08,.15,.3,0x6b4423,0,-.05,.28,.12);fin(g,-.78);
 g=new THREE.Group();
 bx(g,.07,.1,.55,0x3d4a2e,0,0,-.05);cy(g,.015,.35,0x111111,0,.02,-.55);bx(g,.05,.22,.08,0x111111,0,-.16,0,.15);bx(g,.04,.05,.2,0x111111,0,.085,-.05);bx(g,.06,.11,.22,0x2a3320,0,-.02,.32);bx(g,.05,.1,.06,0x111111,0,-.1,.2);fin(g,-.75);
 g=new THREE.Group();
 bx(g,.06,.09,.75,0x24262a,0,0,0);cy(g,.02,.9,0x111111,0,.01,-.8);cy(g,.035,.32,0x151515,0,.1,-.1);cy(g,.028,.02,0x4aa8ff,0,.1,-.27);bx(g,.07,.14,.35,0x8a7a55,0,-.04,.42,.1);bx(g,.02,.15,.02,0x111111,-.04,-.1,-.7);bx(g,.02,.15,.02,0x111111,.04,-.1,-.7);fin(g,-1.28);
 g=new THREE.Group();
 cy(g,.09,.3,0x444444,0,0,.15);const b=new THREE.Group();for(let i=0;i<6;i++){const a=i*Math.PI/3;cy(b,.017,.6,0x1c1c1c,Math.cos(a)*.06,Math.sin(a)*.06,-.3)}cy(b,.025,.6,0x333333,0,0,-.3);cy(b,.075,.03,0x555555,0,0,-.5);g.add(b);g.userData.barrels=b;
 bx(g,.14,.14,.2,0x3a4a2a,-.16,-.12,.1);bx(g,.04,.14,.04,0x222222,0,-.1,0);bx(g,.03,.03,.2,0xb08a30,-.08,-.06,.05);fin(g,-.66);
})();
function showGun(i){GUNS.forEach((g,j)=>g.visible=j===i);shown=i}
function swAnim(dt){
 if(swT>0){swT=Math.max(0,swT-dt);if(swT<=.2&&shown!==S.cur)showGun(S.cur)}
 const a=swT>0?(swT>.2?(.4-swT)/.2:swT/.2):0;kick*=.8;
 gun.position.y=GY-a*.45+Math.sin(bobT*2)*.004;gun.position.x=GX+Math.sin(bobT)*.006;gun.position.z+=(GZ-gun.position.z)*.2;gun.rotation.x=-a*.9+kick;
 const g=GUNS[shown];if(g&&g.userData.barrels)g.userData.barrels.rotation.z+=spinV*dt*35;
 if(mfT>0){mfT-=dt;if(mfT<=0&&g)g.userData.mf.visible=false}
}
function setGun(){spinV=0;if(shown<0){showGun(S.cur);return}if(shown!==S.cur)swT=.4}

// ---------- коллизии ----------
function resolve(p,r){
 for(const c of C){const dx=p.x-c.x,dz=p.z-c.z,ex=dx-Math.max(-c.w,Math.min(c.w,dx)),ez=dz-Math.max(-c.d,Math.min(c.d,dz)),d2=ex*ex+ez*ez;
  if(d2<r*r){if(d2>1e-6){const d=Math.sqrt(d2);p.x+=ex/d*(r-d);p.z+=ez/d*(r-d)}else p.x=c.x+(dx<0?-1:1)*(c.w+r)}}
 p.x=Math.max(-A+.6,Math.min(A-.6,p.x));p.z=Math.max(-A+.6,Math.min(A-.6,p.z));
}
