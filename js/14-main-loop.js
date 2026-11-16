// ---------- цикл ----------
const clock=new THREE.Clock();
function loop(){
 requestAnimationFrame(loop);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
 if(st==='play'){
  // движение
  const f=(keys.KeyW?1:0)-(keys.KeyS?1:0),r=(keys.KeyD?1:0)-(keys.KeyA?1:0),l=Math.hypot(f,r)||1,sp=spd()*(keys.ShiftLeft?1.5:1);
  const p=cam.position;p.x+=(-Math.sin(yaw)*f+Math.cos(yaw)*r)/l*sp*dt;p.z+=(-Math.cos(yaw)*f-Math.sin(yaw)*r)/l*sp*dt;
  resolve(p,.45);bobT+=f||r?dt*9:0;p.y=1.6+Math.sin(bobT)*.04;
  cam.rotation.set(pitch+shk*(Math.random()-.5)*.05,yaw+shk*(Math.random()-.5)*.05,0);shk*=.88;
  const cw=WEAP[S.cur];if(cw.spin)spinV=firing?Math.min(1,spinV+dt/cw.spin):Math.max(0,spinV-dt/1.5);cd-=dt;if(firing&&cd<=0&&swT<=0&&(!cw.spin||spinV>=1))shoot();
  updFx(dt);updProj(dt,cam.position);audSpin();flash.intensity*=.7;swAnim(dt);
  updFl(dt);updNv(dt);updGren(dt);updDrops(dt,t);updAtt();updWarn(dt);
  // спавн
  spT-=dt;if(waveOn&&toSpawn>0&&spT<=0&&enemies.length<14){spawnWave();toSpawn--;spT=Math.max(.35,1.1-S.wave*.05)}
  // враги
  for(const e of enemies){voice(e,dt,p);if(updK(e,dt,t,p))continue;
   const g=e.g,dx=p.x-g.position.x,dz=p.z-g.position.z,d=Math.hypot(dx,dz)||1;let mx=dx/d,mz=dz/d;
   if(e.monkey){const z=Math.sin(t*4+e.ph)*.8;mx+=-dz/d*z;mz+=dx/d*z;g.position.y=Math.abs(Math.sin(t*8+e.ph))*.35}
   else g.rotation.z=Math.sin(t*5+e.ph)*.08;
   if(d>1.0){g.position.x+=mx*e.sp*dt;g.position.z+=mz*e.sp*dt}
   resolve(g.position,e.r);g.rotation.y=Math.atan2(dx,dz);
   e.at-=dt;if(d<1.3&&e.at<=0){e.at=.9;damage(e.dmg)}if(!e.monkey&&Math.random()<dt*.06)tn(75+Math.random()*30,45,.9,'sawtooth',.05);
   if(e.hit>0){e.hit-=dt;if(e.hit<=0)g.scale.setScalar(1)}
  }
  lastMobs(t);if(waveOn&&toSpawn===0&&enemies.length===0)endWave();
  // HUD
  $('st').innerHTML=(MAPS[curMap]?MAPS[curMap].n+'<br>':'')+'Волна '+S.wave+'/30<br>Монстров: '+(enemies.length+toSpawn)+'<br>Деньги: '+(DEV.inf?'∞':Math.floor(S.money))+'$'+(DEV.inf||DEV.god?'<br><span style=color:#f55>DEV: '+(DEV.inf?'∞$ ':'')+(DEV.god?'GOD':'')+'</span>':'');
  $('wp').innerHTML=WEAP.map((w,i)=>i===S.cur?'['+(i+1)+']':S.own[i]?(i+1):'·').join(' ')+'<br>'+WEAP[S.cur].n+'<br>Гранат: '+S.gr+' [G]'+(S.nv?' · ПНВ '+(nvOn?'вкл':'выкл')+' [N]':'')+'<br>Урон ×'+dmul().toFixed(2)+(cw.spin?'<br>Раскрутка '+Math.floor(spinV*100)+'%':'');
  $('hpf').style.width=(P.hp/maxHp()*100)+'%';
 }
 R.render(scene,cam);
}
S=fresh();setGun();ui('menu');loop();
