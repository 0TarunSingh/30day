/* Virtual Hug interactions
   - arms wrap in when hugging
   - heart pulses
   - bubble messages rotate with fade
   - floating hearts spawn
   - sound plays (tiny inline data uri) if allowed
*/

const hugBtn = document.getElementById('hugBtn');
const hugVisual = document.getElementById('hugVisual');
const heart = document.getElementById('heart');
const bubble = document.getElementById('bubble');
const floatLayer = document.getElementById('floatLayer');
const hugSound = document.getElementById('hugSound');

const MESSAGES = [
  "You are loved, Sabrina. 💕",
  "Close your eyes, feel this hug. 🤍",
  "Tiny arms, huge love. I'm with you. 🌸",
  "Breathe in. Breathe out. You are safe. 🌿",
  "One more hug, for your brave heart. ✨"
];

let msgIndex = 0;

// helper: spawn floating hearts/sparkles
function spawnFloat(count = 8) {
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'float';
    el.textContent = Math.random() > 0.7 ? '💫' : '💖';
    const size = Math.random() * 20 + 12;
    el.style.fontSize = size + 'px';
    el.style.left = (10 + Math.random() * 80) + '%';
    el.style.top = (60 + Math.random() * 20) + '%';
    const duration = 3000 + Math.random() * 2600;
    el.style.animationDuration = duration + 'ms';
    el.style.opacity = (0.6 + Math.random() * 0.4).toFixed(2);
    el.style.transform = `translateY(0) scale(${0.8 + Math.random()*0.6})`;
    el.style.transition = `opacity 400ms`;
    el.style.pointerEvents = 'none';
    el.animate([{ transform: `translateY(0)`, opacity: 1 }, { transform: `translateY(-220px)`, opacity: 0 }], { duration, easing: 'cubic-bezier(.2,.8,.2,1)' });
    floatLayer.appendChild(el);
    setTimeout(() => el.remove(), duration + 120);
  }
}

// animate one hug
function doHug(customMsg) {
  // arms wrap
  hugVisual.classList.add('hugging');
  // heart pop
  heart.style.transform = 'scale(1.18)';
  setTimeout(() => heart.style.transform = 'scale(1)', 420);

  // rotate bubble message
  bubble.classList.remove('fade-in');
  bubble.classList.add('fade-out');
  setTimeout(() => {
    const text = customMsg || nextMessage();
    bubble.textContent = text;
    bubble.classList.remove('fade-out');
    bubble.classList.add('fade-in');
  }, 260);

  // spawn floats
  spawnFloat(10);

  // short hugging state
  setTimeout(() => hugVisual.classList.remove('hugging'), 900);

  // play sound if allowed
  try { hugSound.currentTime = 0; hugSound.play().catch(()=>{}); } catch(e){}

  // quick button feedback
  hugBtn.setAttribute('aria-pressed','true');
  hugBtn.textContent = '🤗 Hug Sent';
  setTimeout(()=>{ hugBtn.textContent = 'Another Hug 💗'; hugBtn.setAttribute('aria-pressed','false') }, 1200);
}

// cycle messages
function nextMessage(){
  const m = MESSAGES[msgIndex % MESSAGES.length];
  msgIndex++;
  // persist last message optionally
  try { localStorage.setItem('vh_last_msg', JSON.stringify({text:m, at:new Date().toISOString()})); } catch(e){}
  return m;
}

// initial load message if saved
(function loadLast(){
  try {
    const last = JSON.parse(localStorage.getItem('vh_last_msg')||'{}');
    if(last && last.text) { bubble.textContent = last.text; }
  } catch(e){}
})();

// click/keyboard
hugBtn.addEventListener('click', ()=> doHug());
hugVisual.addEventListener('click', ()=> doHug());
hugVisual.addEventListener('keydown', e => { if(e.key === 'Enter' || e.key === ' ') doHug(); });

// ambient slow float spawn to make scene alive
setInterval(()=> spawnFloat(2), 2200);
