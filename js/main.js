// Pratik Web Studio - Main Script
const form = document.getElementById('enquiry');
const dialog = document.getElementById('messageDialog');
const prepared = document.getElementById('prepared');
const statusMsg = document.getElementById('status');
const emailRetry = document.getElementById('emailRetry');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = d.get('name') || '';
    const business = d.get('business') || '';
    const phone = d.get('phone') || 'Not provided';
    const service = d.get('service') || 'General enquiry';
    const message = d.get('message') || 'To be discussed';

    const text = `Hello Pratik, I would like to discuss a website.\n\nName: ${name}\nBusiness: ${business}\nPhone / WhatsApp: ${phone}\nService: ${service}\nProject details: ${message}`;
    
    if (prepared) {
      prepared.value = text;
    }
    if (statusMsg) {
      statusMsg.textContent = '';
    }

    const emailUrl = 'mailto:query@pratikwebstudio.com?subject=' + 
      encodeURIComponent('Website enquiry - ' + business) + 
      '&body=' + encodeURIComponent(text);

    if (emailRetry) {
      emailRetry.href = emailUrl;
    }

    if (dialog && typeof dialog.showModal === 'function') {
      dialog.showModal();
    }
    window.location.href = emailUrl;
  });
}

// Dialog Controls
const closeBtn = document.getElementById('close');
if (closeBtn && dialog) {
  closeBtn.onclick = () => dialog.close();
}

const copyBtn = document.getElementById('copy');
if (copyBtn && prepared) {
  copyBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(prepared.value);
      if (statusMsg) statusMsg.textContent = 'Message copied to clipboard.';
    } catch {
      prepared.focus();
      prepared.select();
      if (statusMsg) statusMsg.textContent = 'Please select and copy manually.';
    }
  };
}

// Mobile Navigation
const menuButton = document.getElementById('menuButton');
const mobileNav = document.getElementById('mobileNav');
const menuBackdrop = document.getElementById('menuBackdrop');
const siteHeader = menuButton?.closest('header');

function closeMenu(returnFocus = false) {
  if (!mobileNav || !menuButton) return;
  mobileNav.hidden = true;
  if (menuBackdrop) menuBackdrop.hidden = true;
  document.body.classList.remove('menu-open');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  if (returnFocus) menuButton.focus();
}

function openMenu() {
  if (!mobileNav || !menuButton || window.innerWidth > 768) return;
  mobileNav.hidden = false;
  if (menuBackdrop) menuBackdrop.hidden = false;
  document.body.classList.add('menu-open');
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Close menu');
  mobileNav.querySelector('a')?.focus();
}

if (menuButton) {
  menuButton.addEventListener('click', () => {
    if (mobileNav.hidden) openMenu();
    else closeMenu(true);
  });
}

if (mobileNav) {
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu()));
}
if (menuBackdrop) {
  menuBackdrop.addEventListener('click', () => closeMenu(true));
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav && !mobileNav.hidden) {
    e.preventDefault();
    closeMenu(true);
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 768) closeMenu();
}, { passive: true });

// Scroll Progress Bar
const progressBar = document.querySelector('.progress');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (max > 0 ? (window.scrollY / max * 100) : 0) + '%';
  }, { passive: true });
}

// Pricing Links Handler
const packageDetails = {
  Starter: 'Starter package — ₹5,999, one-page static website',
  Business: 'Business package — custom quotation, up to five pages',
  Premium: 'Premium package — custom quotation, up to seven pages',
  'Free offer': 'Free first static website offer — please confirm eligibility and scope'
};

function packageEnquiry(plan) {
  return 'Hi Pratik, I’m interested in the ' + (packageDetails[plan] || plan) + '. Please share the next steps and quotation details.';
}

document.querySelectorAll('[data-plan]').forEach(a => {
  const plan = a.dataset.plan;
  a.href = 'mailto:query@pratikwebstudio.com?subject=' + 
    encodeURIComponent(plan + ' website enquiry') + 
    '&body=' + encodeURIComponent(packageEnquiry(plan));
});

// Reduced Motion & 3D Tilt
const motionMedia = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.getElementById('motionToggle');
let motionAllowed = !motionMedia.matches;

if (motionButton) {
  motionButton.addEventListener('click', () => {
    motionAllowed = !motionAllowed;
    document.body.classList.toggle('no-motion', !motionAllowed);
    motionButton.textContent = motionAllowed ? 'Pause motion' : 'Enable motion';
    motionButton.setAttribute('aria-pressed', String(!motionAllowed));
  });
}

if (matchMedia('(pointer:fine) and (min-width: 769px)').matches) {
  document.querySelectorAll('.card, .portfolio-card, .price-card, .step, .portrait').forEach(el => {
    el.addEventListener('pointermove', (e) => {
      if (!motionAllowed) return;
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

// Ambient Star Dust Particles on Canvas
const canvas = document.getElementById('depthBackdrop');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let cw = 0, ch = 0;
  const stars = Array.from({ length: 48 }, () => ({
    x: Math.random() * 2000 - 1000,
    y: Math.random() * 2000 - 1000,
    z: Math.random() * 800 + 200
  }));

  function resizeCanvas() {
    cw = window.innerWidth;
    ch = window.innerHeight;
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(cw * ratio);
    canvas.height = Math.round(ch * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function drawStars(time) {
    if (!ctx || !motionAllowed || window.innerWidth <= 768) return;
    ctx.clearRect(0, 0, cw, ch);
    for (const p of stars) {
      const angle = time * 0.00003;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const x = p.x * cosA - p.z * sinA;
      const z = p.x * sinA + p.z * cosA + 1000;
      const scale = 500 / Math.max(z, 200);
      const px = cw * 0.5 + x * scale;
      const py = ch * 0.5 + p.y * scale;

      ctx.fillStyle = `rgba(212, 255, 63, ${0.15 + scale * 0.35})`;
      ctx.beginPath();
      ctx.arc(px, py, Math.max(0.8, 1.8 * scale), 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(drawStars);
  }

  window.addEventListener('resize', resizeCanvas, { passive: true });
  resizeCanvas();
  requestAnimationFrame(drawStars);
}
