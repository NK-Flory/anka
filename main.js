/* ===========================
   NAV STICKY
=========================== */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });


/* ===========================
   HAMBURGER MENU
=========================== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.querySelector('.nav-links');
const overlay   = document.getElementById('navOverlay');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  overlay.classList.add('active');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  overlay.classList.remove('active');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  hamburger.classList.contains('open') ? closeMenu() : openMenu();
});

overlay.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });


/* ===========================
   REVEAL AU SCROLL
   (Intersection Observer — 0 dépendance)
=========================== */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target); // déclenche une seule fois
    }
  });
}, {
  threshold: 0.12,       // déclenche quand 12% de l'élément est visible
  rootMargin: '0px 0px -40px 0px'  // légèrement avant le bas du viewport
});

revealEls.forEach(el => observer.observe(el));


/* ===========================
   FORMSPREE — envoi AJAX
   (évite la redirection de page)

   ⚠️ CONFIGURATION :
   remplacer VOTRE_ID dans l'attribut action du <form> (index.html)
   par l'identifiant fourni par Formspree, ex :
   action="https://formspree.io/f/xdkogqwz"
=========================== */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const successMsg = document.getElementById('formSuccess');
const errorMsg   = document.getElementById('formError');

const EMAIL_DIRECT = 'info@anka-conseil.be';
const TEL_DIRECT   = '+32 470 60 34 45';

function showError(message) {
  errorMsg.innerHTML = message;
  errorMsg.classList.add('show');
}

function clearError() {
  errorMsg.classList.remove('show');
  errorMsg.textContent = '';
}

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();

    // Garde-fou : endpoint Formspree pas encore configuré
    if (form.action.includes('VOTRE_ID')) {
      showError(
        'Le formulaire n\'est pas encore actif. Écrivez-moi directement à ' +
        '<a href="mailto:' + EMAIL_DIRECT + '">' + EMAIL_DIRECT + '</a> ' +
        'ou appelez le <a href="tel:+32470603445">' + TEL_DIRECT + '</a>.'
      );
      return;
    }

    // État chargement
    submitBtn.textContent = 'Envoi en cours…';
    submitBtn.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Succès
        form.reset();
        successMsg.classList.add('show');
        submitBtn.textContent = 'Envoyer';
        submitBtn.disabled = false;

        // Cache le message après 6s
        setTimeout(() => successMsg.classList.remove('show'), 6000);
      } else {
        throw new Error('Erreur réseau');
      }
    } catch {
      submitBtn.textContent = 'Réessayer';
      submitBtn.disabled = false;
      showError(
        'L\'envoi n\'a pas abouti. Réessayez, ou contactez-moi à ' +
        '<a href="mailto:' + EMAIL_DIRECT + '">' + EMAIL_DIRECT + '</a> ' +
        'ou au <a href="tel:+32470603445">' + TEL_DIRECT + '</a>.'
      );
    }
  });
}
