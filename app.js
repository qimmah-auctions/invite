// عنوان Google Apps Script (نقطة تسجيل الأسماء في قوقل شيت)
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbynH4BRox1xk4AbMXAmExoOmnXn7GsoJUFXgrMmHwV_dpYJgHe2ngIZeDEvjrFid7kj/exec';

const c = document.getElementById('c'), ctx = c.getContext('2d');
const input = document.getElementById('name'), dl = document.getElementById('dl');
const img = new Image();

function draw(){
  if(!img.complete || !img.naturalWidth) return;
  ctx.drawImage(img,0,0);
  const name = input.value.trim();
  dl.disabled = !name;
  if(!name) return;
  let size = Math.round(BOX.h*0.55);
  ctx.textAlign='center'; ctx.textBaseline='middle'; ctx.fillStyle='#FFFFFF';
  do { ctx.font = '800 '+size+'px Tajawal, sans-serif'; size -= 2; }
  while(ctx.measureText(name).width > BOX.w-BOX.h*0.6 && size > 14);
  ctx.fillText(name, BOX.x+BOX.w/2, BOX.y+BOX.h/2+2);
}

img.onload = ()=>{ c.width=img.naturalWidth; c.height=img.naturalHeight; draw(); };
img.src = IMG;
input.addEventListener('input', draw);
if(document.fonts) document.fonts.ready.then(draw);

let lastSent = '', timer;
function log(name){
  if(!ENDPOINT || !name || name === lastSent) return;
  lastSent = name;
  const fd = new FormData();
  fd.append('name', name);
  fd.append('invite', INVITE);
  // sendBeacon ينجح حتى لو غادرت الصفحة أو بدأ التحميل (مهم على الجوال)
  if(!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, fd)))
    fetch(ENDPOINT, {method:'POST', mode:'no-cors', body:fd, keepalive:true}).catch(()=>{});
}

// يسجّل الاسم بعد ما يتوقف الكتابة، وأيضاً عند التحميل
input.addEventListener('input', ()=>{
  clearTimeout(timer);
  const v = input.value.trim();
  if(v.length >= 3) timer = setTimeout(()=>log(v), 1500);
});

dl.addEventListener('click', ()=>{
  const name = input.value.trim();
  if(!name) return;
  clearTimeout(timer);
  log(name);
  c.toBlob(b=>{
    const url = URL.createObjectURL(b);
    const a = document.createElement('a');
    a.download = 'دعوة-'+name+'.jpg';
    a.href = url;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(url), 4000);
  }, 'image/jpeg', 0.92);
});
