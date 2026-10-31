// ===============================
// WEB DEVELOPER PORTFOLIO
// Interactive features
// ===============================

const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("navigation");
const languageToggle = document.getElementById("languageToggle");

function closeMenu() {
  menuToggle?.classList.remove("open");
  navigation?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navigation.classList.toggle("open");
  menuToggle.classList.toggle("open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navigation?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// English / Arabic language switch
let currentLanguage = localStorage.getItem("portfolio-language") || "en";

function setLanguage(language) {
  currentLanguage = language;
  document.documentElement.lang = language;
  document.documentElement.dir = language === "ar" ? "rtl" : "ltr";

  document.querySelectorAll("[data-en][data-ar]").forEach(element => {
    // Keep the heading's highlighted span markup where it exists.
    const translation = element.dataset[language];
    if (translation.includes("<span>")) {
      element.innerHTML = translation;
    } else {
      element.textContent = translation;
    }
  });

  if (languageToggle) {
    languageToggle.textContent = language === "en" ? "العربية" : "English";
    languageToggle.setAttribute(
      "aria-label",
      language === "en" ? "Switch to Arabic" : "Switch to English"
    );
  }

  localStorage.setItem("portfolio-language", language);
}

languageToggle?.addEventListener("click", () => {
  setLanguage(currentLanguage === "en" ? "ar" : "en");
});

setLanguage(currentLanguage);

// Typing effect
const typingText = document.getElementById("typingText");
const phrases = {
  en: ["modern websites", "creative experiences", "responsive designs"],
  ar: ["مواقع عصرية", "تجارب إبداعية", "تصميمات متجاوبة"]
};

let phraseIndex = 0;
let letterIndex = 0;
let deleting = false;
let typingTimer;

function typeLoop() {
  if (!typingText) return;

  const currentPhrases = phrases[currentLanguage];
  const phrase = currentPhrases[phraseIndex];
  typingText.textContent = phrase.slice(0, letterIndex);

  if (!deleting) {
    letterIndex++;
    if (letterIndex > phrase.length) {
      deleting = true;
      typingTimer = setTimeout(typeLoop, 1300);
      return;
    }
  } else {
    letterIndex--;
    if (letterIndex < 0) {
      deleting = false;
      letterIndex = 0;
      phraseIndex = (phraseIndex + 1) % currentPhrases.length;
    }
  }

  typingTimer = setTimeout(typeLoop, deleting ? 45 : 85);
}

function restartTyping() {
  clearTimeout(typingTimer);
  phraseIndex = 0;
  letterIndex = 0;
  deleting = false;
  typeLoop();
}

const originalSetLanguage = setLanguage;
setLanguage = function(language) {
  originalSetLanguage(language);
  restartTyping();
};
restartTyping();

// Header background on scroll
const header = document.querySelector(".site-header");
function updateHeader() {
  header?.classList.toggle("scrolled", window.scrollY > 25);
}
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

// Reveal elements as they enter the viewport
const revealElements = document.querySelectorAll(
  ".hero-copy, .hero-art, .section-heading, .about-visual, .about-copy, .skill-card, .project-card, .service-card, .contact-copy, .contact-form"
);

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element, index) => {
    element.classList.add("reveal");
    element.style.transitionDelay = `${(index % 4) * 80}ms`;
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach(element => element.classList.add("show"));
}

// Contact form opens the visitor's email application.
// Replace the address below with your real email address.
const contactForm = document.getElementById("contactForm");
const contactEmail = "YOUR_EMAIL@example.com";

contactForm?.addEventListener("submit", event => {
  event.preventDefault();

  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const message = String(formData.get("message") || "").trim();

  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  );

  window.location.href = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
});

// Footer year
const yearElement = document.getElementById("year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
