// ---------- звук ----------
let AC,mg,nb,muted=false,spO,spG;
function initAudio(){
 if(AC){AC.resume&&AC.resume();return}
 try{AC=new (window.AudioContext||window.webkitAudioContext)()}catch(e){return}
 mg=AC.createGain();mg.gain.value=.55;mg.connect(AC.destination);
 nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;
 const dg=AC.createGain();dg.gain.value=.12;const lp=AC.createBiquadFilter();lp.type='lowpass';lp.frequency.value=180;dg.connect(lp);lp.connect(mg);
 [55,55.4,82.5].forEach(f=>{const o=AC.createOscillator();o.type='sawtooth';o.frequency.value=f;o.connect(dg);o.start()});
 const lf=AC.createOscillator(),lg=AC.createGain();lf.frequency.value=.07;lg.gain.value=70;lf.connect(lg);lg.connect(lp.frequency);lf.start();
 const ns=AC.createBufferSource();ns.buffer=nb;ns.loop=true;const bp=AC.createBiquadFilter();bp.type='bandpass';bp.frequency.value=400;bp.Q.value=.8;const wg=AC.createGain();wg.gain.value=.05;ns.connect(bp);bp.connect(wg);wg.connect(mg);ns.start();
 const wl=AC.createOscillator(),wlg=AC.createGain();wl.frequency.value=.12;wlg.gain.value=250;wl.connect(wlg);wlg.connect(bp.frequency);wl.start();
 spO=AC.createOscillator();spO.type='sawtooth';spG=AC.createGain();spG.gain.value=0;const sl=AC.createBiquadFilter();sl.type='lowpass';sl.frequency.value=500;spO.connect(sl);sl.connect(spG);spG.connect(mg);spO.start();
 const sc=[220,261.6,311.1,329.6,196,164.8];
 setInterval(()=>{const t=AC.currentTime,o=AC.createOscillator(),g=AC.createGain();o.type='sine';o.frequency.value=sc[Math.floor(Math.random()*sc.length)]*(Math.random()<.3?2:1);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.06,t+2);g.gain.linearRampToValueAtTime(0,t+6);o.connect(g);g.connect(mg);o.start(t);o.stop(t+6.2)},4500);
}
function nz(dur,fq,type,vol,fq2){const t=AC.currentTime,s=AC.createBufferSource();s.buffer=nb;const f=AC.createBiquadFilter();f.type=type;f.frequency.setValueAtTime(fq,t);f.frequency.exponentialRampToValueAtTime(fq2,t+dur);const g=AC.createGain();g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);s.connect(f);f.connect(g);g.connect(DEST||mg);s.start(t,Math.random()*.5,dur+.05)}
function tn(f1,f2,dur,type,vol,delay){const t=AC.currentTime+(delay||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+dur);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+dur);o.connect(g);g.connect(DEST||mg);o.start(t);o.stop(t+dur+.02)}
function sfx(k){if(!AC||muted)return;
 switch(k){
 case 'shot0':nz(.12,3000,'bandpass',.5,600);tn(180,60,.1,'square',.25);break;
 case 'shot1':nz(.35,1800,'lowpass',.9,200);tn(120,35,.3,'sawtooth',.5);break;
 case 'shot2':nz(.09,3500,'bandpass',.4,800);tn(200,70,.08,'square',.2);break;
 case 'shot3':nz(.5,4000,'lowpass',.8,150);tn(300,40,.45,'sawtooth',.5);break;
 case 'shot4':nz(.06,3000,'bandpass',.25,900);tn(150,70,.05,'square',.12);break;
 case 'hit':tn(140,60,.08,'sine',.2);break;
 case 'zdie':tn(110,35,.5,'sawtooth',.25);nz(.3,600,'lowpass',.3,100);break;
 case 'mdie':tn(900,200,.35,'sawtooth',.18);nz(.2,1500,'bandpass',.2,400);break;
 case 'screech':tn(700,1500,.25,'sawtooth',.06);break;
 case 'hurt':tn(90,40,.25,'sine',.7);nz(.2,500,'lowpass',.5,100);break;
 case 'wave':tn(70,55,1.6,'sawtooth',.25);tn(105,82,1.6,'sawtooth',.15);break;
 case 'spit':tn(500,200,.2,'sawtooth',.1);nz(.2,2500,'bandpass',.15,800);break;
 case 'roar':tn(90,40,1,'sawtooth',.5);tn(140,60,1,'square',.2);break;
 case 'click':tn(1200,600,.04,'square',.1);break;
 case 'boom':nz(1.2,1500,'lowpass',1,80);tn(110,25,1,'sine',.9);break;
 case 'pick':tn(700,1400,.15,'sine',.15);break;
 case 'geiger':tn(2500+Math.random()*1500,2000,.02,'square',.06);break;
 case 'buy':tn(600,900,.12,'square',.12);tn(900,1300,.15,'square',.12,.1);break;
}}
function audSpin(){if(!spO)return;const v=WEAP[S.cur].spin?spinV:0;spG.gain.value=muted?0:v*.12;spO.frequency.value=30+v*v*150}
