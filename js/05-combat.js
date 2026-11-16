// ---------- стрельба ----------
const ray=new THREE.Raycaster(),v3=new THREE.Vector3();
function shoot(){
 const w=effW(S.cur);cd=w.r/rmul();sfx('shot'+S.cur);cam.updateMatrixWorld();const mz=new THREE.Vector3(.24,-.2,-.5-WEAP[S.cur].len*1.1).applyMatrix4(cam.matrixWorld);
 const targets=obsMeshes.concat(...enemies.map(e=>e.parts));
 for(let i=0;i<w.p;i++){
  cam.getWorldDirection(v3);v3.x+=(Math.random()-.5)*w.s*2;v3.y+=(Math.random()-.5)*w.s*2;v3.z+=(Math.random()-.5)*w.s*2;
  ray.set(cam.position,v3.normalize());ray.far=60;
  const h=ray.intersectObjects(targets,false).find(x=>!(x.object.userData.e&&x.object.userData.e.dead));tracer(mz,h?h.point:ray.ray.at(45,new THREE.Vector3()),w.spin?0xffa030:0xffe9a8);if(h&&!h.object.userData.e)burst(h.point,[0xffd27a,0xb0b0b0],3,2,.5);
  if(h&&h.object.userData.e){
   const e=h.object.userData.e;e.hp-=w.d*dmul()*(h.object.userData.head?2:1);
   const dx=e.g.position.x-cam.position.x,dz=e.g.position.z-cam.position.z,l=Math.hypot(dx,dz)||1;
   e.g.position.x+=dx/l*.12;e.g.position.z+=dz/l*.12;
   e.g.scale.setScalar(1.12*(e.bs||1));e.hit=.08;burst(h.point,e.monkey?[0x8a1010,0x5a3a1e]:[0x7a1010,0x3d5a3a],5,2.5,1);sfx('hit');
   if(e.hp<=0)killE(e,h.object.userData.head);
  }
 }
 flash.intensity=3;pitch+=(.012+w.d*.0001)*w.km;gun.position.z+=(.04+w.d*.0004)*w.km;kick+=(.05+w.d*.0006)*w.km;{const gg=GUNS[shown];if(gg){gg.userData.mf.visible=true;gg.userData.mf.scale.setScalar(.8+Math.random());mfT=.05}}
}
