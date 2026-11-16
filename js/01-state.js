window.onerror=(m,s,l)=>{const p=document.getElementById('pn');if(p)p.innerHTML='<h1>Ошибка</h1><p>'+m+' (строка '+l+')</p><p class="s">Возможно, в браузере отключён WebGL.</p>'};
const $=id=>document.getElementById(id);
const WEAP=[
 {n:'Пистолет',d:25,r:.35,p:1,s:.008,c:0,len:.3},
 {n:'Дробовик',d:13,r:.85,p:8,s:.085,c:300,len:.5},
 {n:'Автомат',d:17,r:.1,p:1,s:.03,c:650,len:.55},
 {n:'Снайперка',d:150,r:1.1,p:1,s:0,c:1000,len:.8},
 {n:'Миниган',d:11,r:.045,p:1,s:.05,c:1800,len:.75,spin:2.5}];
const UPS={hp:['Здоровье +25',60],sp:['Скорость +8%',50],dm:['Урон +15%',80],fr:['Скорострельность +10%',80]};
const KEY='deadfog_save_v1', A=30;
let S,spinV=0,P={hp:100},st='menu',waveOn=false,toSpawn=0,spT=0,cd=0,firing=false,yaw=0,pitch=0,bobT=0;
const keys={},enemies=[],C=[],obsMeshes=[];
const maxHp=()=>100+S.up.hp*25, spd=()=>5.5*(1+.08*S.up.sp), dmul=()=>1+.15*S.up.dm, rmul=()=>1+.1*S.up.fr;
const fresh=()=>({wave:0,money:0,up:{hp:0,sp:0,dm:0,fr:0},own:[1,0,0,0,0],cur:0,hp:100,gr:2,nv:0,att:{},eq:[{},{},{},{},{}],seen:{},kills:{}});
