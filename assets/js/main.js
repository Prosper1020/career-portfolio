/* ============================================
   KOFFI KOUMI - CAREER PORTFOLIO - JS
   ============================================ */

// ---- ACCESS CONTROL ----
const ACCESS_CODE = 'KK2026';  // Change this to your preferred access code
const STORAGE_KEY = 'kk_portfolio_access';

function checkAccess() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'granted') {
    document.getElementById('access-gate').classList.add('hidden');
    return true;
  }
  return false;
}

function requestAccess() {
  const name = document.getElementById('gate-name').value.trim();
  const email = document.getElementById('gate-email').value.trim();
  const reason = document.getElementById('gate-reason').value.trim();
  const status = document.getElementById('gate-status');

  if (!name || !email) {
    status.textContent = 'Please enter your name and email.';
    status.className = 'gate-status error';
    return;
  }

  // Store request info
  const requests = JSON.parse(localStorage.getItem('kk_access_requests') || '[]');
  requests.push({ name, email, reason, timestamp: new Date().toISOString() });
  localStorage.setItem('kk_access_requests', JSON.stringify(requests));

  // Send notification via mailto (opens email client)
  const subject = encodeURIComponent(`Portfolio Access Request from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nReason: ${reason || 'Not specified'}\nTime: ${new Date().toLocaleString()}`
  );

  // Attempt to notify via mailto link (non-blocking)
  const mailtoLink = `mailto:koffiespoir.koumi@insead.edu?subject=${subject}&body=${body}`;
  
  status.innerHTML = `
    <span style="color: #4caf50;">✓ Access request sent!</span><br>
    <small style="color: var(--text-muted);">Koffi will review your request and share the access code with you.</small><br>
    <small style="color: var(--text-muted); margin-top: 5px; display: inline-block;">
      If your email client didn't open, please contact: 
      <a href="${mailtoLink}" style="color: var(--gold);">koffiespoir.koumi@insead.edu</a>
    </small>
  `;
  status.className = 'gate-status success';

  // Try opening mailto
  window.open(mailtoLink, '_self');
}

function enterCode() {
  const code = document.getElementById('gate-code').value.trim();
  const status = document.getElementById('gate-status');

  if (!code) {
    status.textContent = 'Please enter an access code.';
    status.className = 'gate-status error';
    return;
  }

  if (code.toUpperCase() === ACCESS_CODE) {
    localStorage.setItem(STORAGE_KEY, 'granted');
    document.getElementById('access-gate').classList.add('hidden');
    status.textContent = '';
    initAnimations();
  } else {
    status.textContent = 'Invalid access code. Please try again or request access.';
    status.className = 'gate-status error';
    document.getElementById('gate-code').value = '';
  }
}

// Allow Enter key on code field
document.addEventListener('DOMContentLoaded', function() {
  const codeInput = document.getElementById('gate-code');
  if (codeInput) {
    codeInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') enterCode();
    });
  }
  
  // Check access on load
  if (checkAccess()) {
    initAnimations();
  }
});

// ---- NAVIGATION ----
function toggleNav() {
  document.getElementById('nav-links').classList.toggle('open');
}

// Close nav on link click (mobile)
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('nav-links').classList.remove('open');
  });
});

// Active nav link on scroll
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links a');
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// ---- ANIMATIONS ----
function initAnimations() {
  // Intersection Observer for fade-in
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // Create particles
  createParticles();
}

// ---- PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 15 + 's';
    particle.style.animationDuration = (10 + Math.random() * 20) + 's';
    container.appendChild(particle);
  }
}

// ---- PDF VIEWER ----
function openPDF(url) {
  const modal = document.getElementById('pdf-modal');
  const iframe = document.getElementById('pdf-iframe');
  iframe.src = url;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closePDF(event) {
  if (event.target.classList.contains('modal-overlay') || event.target.classList.contains('modal-close')) {
    const modal = document.getElementById('pdf-modal');
    const iframe = document.getElementById('pdf-iframe');
    modal.classList.remove('active');
    iframe.src = '';
    document.body.style.overflow = '';
  }
}

// Close modal on Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    const modal = document.getElementById('pdf-modal');
    if (modal.classList.contains('active')) {
      modal.classList.remove('active');
      document.getElementById('pdf-iframe').src = '';
      document.body.style.overflow = '';
    }
  }
});

// ---- NAV BACKGROUND ON SCROLL ----
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.style.background = 'rgba(10, 10, 26, 0.95)';
  } else {
    nav.style.background = 'rgba(10, 10, 26, 0.9)';
  }
});
