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

function log(name){
  if(!ENDPOINT) return;
  const fd = new FormData();
  fd.append('name', name);
  fd.append('invite', INVITE);
  fetch(ENDPOINT, {method:'POST', mode:'no-cors', body:fd}).catch(()=>{});
}

dl.addEventListener('click', ()=>{
  const name = input.value.trim();
  if(!name) return;
  log(name);
  const a = document.createElement('a');
  a.download = 'دعوة-'+name+'.jpg';
  a.href = c.toDataURL('image/jpeg', 0.92);
  a.click();
});
