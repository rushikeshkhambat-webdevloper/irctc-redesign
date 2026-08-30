// js for the project 
/* ============================================
   IRCTC REDESIGNED — MAIN JS
   Works across index.html, booking.html,
   services.html and profile.html.
   Every selector is guarded with a null-check
   so this one file can be shared by all pages.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. HAMBURGER MENU ---------- */
  const hamburger = document.getElementById('hamburger');
  const mainNav = document.getElementById('mainNav');

  if (hamburger && mainNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mainNav.classList.toggle('open');
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      const isClickInside = mainNav.contains(e.target) || hamburger.contains(e.target);
      if (!isClickInside && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
      }
    });

    // Close menu after selecting a link (mobile)
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        hamburger.classList.remove('open');
      });
    });
  }

  /* ---------- 2. NAVBAR SCROLL EFFECT ---------- */
  const siteHeader = document.getElementById('siteHeader');
  if (siteHeader) {
    window.addEventListener('scroll', () => {
      siteHeader.classList.toggle('scrolled', window.scrollY > 10);
    });
  }

  /* ---------- 3. DARK MODE TOGGLE ---------- */
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    // Restore saved preference
    if (localStorage.getItem('irctc-theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }

    themeToggle.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark-mode');
      const icon = themeToggle.querySelector('i');
      icon.classList.toggle('fa-moon', !isDark);
      icon.classList.toggle('fa-sun', isDark);
      localStorage.setItem('irctc-theme', isDark ? 'dark' : 'light');
    });
  }

  /* ---------- 4. LANGUAGE TOGGLE (mock) ---------- */
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    const languages = ['EN', 'हिं'];
    let langIndex = 0;
    langToggle.addEventListener('click', () => {
      langIndex = (langIndex + 1) % languages.length;
      langToggle.querySelector('.lang-label').textContent = languages[langIndex];
    });
  }

  /* ---------- 5. STAT COUNTER ANIMATION ---------- */
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const startTime = performance.now();

      const step = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const value = Math.floor(eased * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => observer.observe(el));
  }

  /* ---------- 6. SEARCH TABS (Home page) ---------- */
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (tabButtons.length) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetTab = btn.dataset.tab;
        document.querySelectorAll('[data-tab-content]').forEach(panel => {
          panel.hidden = panel.dataset.tabContent !== targetTab;
        });
      });
    });
  }

  /* ---------- 7. SWAP FROM/TO BUTTONS ---------- */
  const setupSwap = (btnId, fromId, toId) => {
    const btn = document.getElementById(btnId);
    const fromInput = document.getElementById(fromId);
    const toInput = document.getElementById(toId);
    if (btn && fromInput && toInput) {
      btn.addEventListener('click', () => {
        const temp = fromInput.value;
        fromInput.value = toInput.value;
        toInput.value = temp;
      });
    }
  };
  setupSwap('swapBtn', 'fromInput', 'toInput');
  setupSwap('bookingSwapBtn', 'bFrom', 'bTo');

  /* ---------- 8. HOME SEARCH FORM SUBMIT ---------- */
  const searchForm = document.getElementById('searchForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'booking.html';
    });
  }

  /* ---------- 9. BOOKING WIZARD ---------- */
  const wizardSteps = document.querySelectorAll('.wizard-step');
  const stepIndicators = document.querySelectorAll('.step-indicator .step');

  if (wizardSteps.length) {
    const goToStep = (stepNumber) => {
      wizardSteps.forEach(step => {
        step.classList.toggle('active', step.dataset.stepPanel === String(stepNumber));
      });
      stepIndicators.forEach(ind => {
        const indStep = parseInt(ind.dataset.step, 10);
        ind.classList.toggle('active', indStep === stepNumber);
        ind.classList.toggle('completed', indStep < stepNumber);
      });
      // Scroll booking card into view smoothly
      const bookingCard = document.querySelector('.booking-card');
      if (bookingCard) bookingCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    document.querySelectorAll('[data-next]').forEach(btn => {
      btn.addEventListener('click', () => {
        // Basic validation: check required inputs in the current visible step
        const currentStep = btn.closest('.wizard-step');
        const requiredFields = currentStep.querySelectorAll('input[required], select[required]');
        let valid = true;
        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            valid = false;
            field.style.borderColor = '#E53935';
          } else {
            field.style.borderColor = '';
          }
        });

        // For the train-selection step, require a radio to be checked
        if (currentStep.dataset.stepPanel === '2') {
          const selected = currentStep.querySelector('input[name="train"]:checked');
          if (!selected) {
            valid = false;
            alert('Please select a train to continue.');
          }
        }

        if (valid) {
          goToStep(parseInt(btn.dataset.next, 10));
        }
      });
    });

    document.querySelectorAll('[data-prev]').forEach(btn => {
      btn.addEventListener('click', () => {
        goToStep(parseInt(btn.dataset.prev, 10));
      });
    });

    // Confirm booking button (final step)
    const confirmBtn = document.getElementById('confirmBookingBtn');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const payDetail = document.getElementById('payDetail');
        if (payDetail && !payDetail.value.trim()) {
          payDetail.style.borderColor = '#E53935';
          return;
        }
        alert('🎉 Booking confirmed! Your e-ticket has been sent to your registered mobile number and email.');
        window.location.href = 'profile.html';
      });
    }
  }

  /* ---------- 10. TRAIN CARD SELECTION HIGHLIGHT ---------- */
  const trainRadios = document.querySelectorAll('input[name="train"]');
  if (trainRadios.length) {
    trainRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        document.querySelectorAll('.train-card').forEach(card => card.classList.remove('selected'));
        radio.closest('.train-card').classList.add('selected');
      });
    });
  }

  /* ---------- 11. PAYMENT METHOD FIELD SWITCH ---------- */
  const payMethod = document.getElementById('payMethod');
  const payDetail = document.getElementById('payDetail');
  if (payMethod && payDetail) {
    payMethod.addEventListener('change', () => {
      const placeholders = {
        upi: { label: 'UPI ID', placeholder: 'yourname@upi' },
        card: { label: 'Card Number', placeholder: '1234 5678 9012 3456' },
        netbanking: { label: 'Bank Name', placeholder: 'e.g. State Bank of India' }
      };
      const config = placeholders[payMethod.value];
      const label = document.querySelector('label[for="payDetail"]');
      if (label) label.textContent = config.label;
      payDetail.placeholder = config.placeholder;
    });
  }

  /* ---------- 12. PROFILE TABS ---------- */
  const profileTabBtns = document.querySelectorAll('.profile-tab-btn');
  if (profileTabBtns.length) {
    profileTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        profileTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.dataset.profileTab;
        document.querySelectorAll('.profile-tab-panel').forEach(panel => {
          panel.classList.toggle('active', panel.dataset.profilePanel === target);
        });
      });
    });
  }

  /* ---------- 13. SETTINGS FORM SUBMIT ---------- */
  const settingsForm = document.getElementById('settingsForm');
  if (settingsForm) {
    settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('✅ Your account settings have been saved.');
    });
  }

  /* ---------- 14. SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ---------- 15. FADE-IN ON SCROLL FOR CARDS ---------- */
  const fadeTargets = document.querySelectorAll('.feature-card, .service-card, .train-card, .profile-stat-card');
  if (fadeTargets.length) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    fadeTargets.forEach(el => fadeObserver.observe(el));
  }

});
// ============================================
// LANGUAGE TOGGLE FUNCTIONALITY
// ============================================

// Language translations
const translations = {
    en: {
        // Navigation
        home: "Home",
        bookTicket: "Book Ticket",
        services: "Services",
        myAccount: "My Account",
        
        // Hero
        badge: "🇮🇳 Government of India Initiative",
        heroTitle: "Book Your Journey in Seconds",
        heroSubtext: "India's fastest, simplest way to book train tickets, track journeys, and travel with confidence — redesigned for real people, not just forms.",
        bookNow: "Book Now",
        liveStatus: "Live Train Status",
        
        // Search
        train: "Train",
        food: "Food",
        hotel: "Hotel",
        from: "From",
        to: "To",
        journeyDate: "Journey Date",
        passengers: "Passengers",
        class: "Class",
        searchTrains: "Search Trains",
        findFood: "Find Food Options",
        searchHotels: "Search Hotels",
        
        // Stats
        dailyTrains: "Daily Trains",
        happyPassengers: "Happy Passengers",
        onTime: "On-Time Performance",
        digitalTicketing: "Digital Ticketing",
        
        // Features
        whyChoose: "Why choose us",
        featuresHeading: "Everything you need for a smooth journey",
        easyBooking: "Easy Booking",
        easyBookingDesc: "Book a ticket in under a minute with a clean, guided flow — no confusing forms.",
        liveTracking: "Live Tracking",
        liveTrackingDesc: "See exactly where your train is, in real time, down to the platform number.",
        foodDelivery: "Food Delivery",
        foodDeliveryDesc: "Order fresh meals delivered straight to your seat at your next station stop.",
        digitalTicket: "Digital Ticket",
        digitalTicketDesc: "Your ticket, ID, and PNR status — all on your phone, no printing required.",
        support: "24/7 Support",
        supportDesc: "Real help, any hour — live chat and phone support whenever you need it.",
        securePayments: "Secure Payments",
        securePaymentsDesc: "Bank-grade encryption on every transaction, with instant confirmation.",
        
        // Footer
        quickLinks: "Quick Links",
        servicesFooter: "Services",
        supportFooter: "Support",
        helpCenter: "Help Center",
        cancellation: "Cancellation Policy",
        contactUs: "Contact Us",
        feedback: "Feedback",
        footerText: "A concept redesign of India's national rail booking platform, built for a college UI/UX competition.",
        copyright: "© 2026 IRCTC Redesigned — A student concept project. Not affiliated with Indian Railways."
    },
    
    hi: {
        // Navigation
        home: "होम",
        bookTicket: "टिकट बुक करें",
        services: "सेवाएं",
        myAccount: "मेरा खाता",
        
        // Hero
        badge: "🇮🇳 भारत सरकार की पहल",
        heroTitle: "अपनी यात्रा बुक करें",
        heroSubtext: "ट्रेन टिकट बुक करने, यात्रा ट्रैक करने और आत्मविश्वास के साथ यात्रा करने का भारत का सबसे तेज़, सरल तरीका — सिर्फ फॉर्म के लिए नहीं, बल्कि वास्तविक लोगों के लिए फिर से डिज़ाइन किया गया।",
        bookNow: "अभी बुक करें",
        liveStatus: "लाइव ट्रेन स्टेटस",
        
        // Search
        train: "ट्रेन",
        food: "खाना",
        hotel: "होटल",
        from: "कहां से",
        to: "कहां तक",
        journeyDate: "यात्रा तिथि",
        passengers: "यात्री",
        class: "क्लास",
        searchTrains: "ट्रेन खोजें",
        findFood: "खाने के विकल्प खोजें",
        searchHotels: "होटल खोजें",
        
        // Stats
        dailyTrains: "दैनिक ट्रेनें",
        happyPassengers: "खुश यात्री",
        onTime: "समय पर प्रदर्शन",
        digitalTicketing: "डिजिटल टिकटिंग",
        
        // Features
        whyChoose: "हमें क्यों चुनें",
        featuresHeading: "एक सुगम यात्रा के लिए सब कुछ",
        easyBooking: "आसान बुकिंग",
        easyBookingDesc: "एक मिनट से भी कम समय में टिकट बुक करें — कोई भ्रमित करने वाले फॉर्म नहीं।",
        liveTracking: "लाइव ट्रैकिंग",
        liveTrackingDesc: "देखें कि आपकी ट्रेन कहां है, प्लेटफॉर्म नंबर तक, रियल टाइम में।",
        foodDelivery: "भोजन वितरण",
        foodDeliveryDesc: "अपनी अगली स्टेशन स्टॉप पर सीट पर ताजा भोजन ऑर्डर करें।",
        digitalTicket: "डिजिटल टिकट",
        digitalTicketDesc: "आपका टिकट, आईडी और पीएनआर स्टेटस — सब आपके फोन पर, प्रिंटिंग की आवश्यकता नहीं।",
        support: "24/7 सहायता",
        supportDesc: "किसी भी समय वास्तविक सहायता — जब भी आपको आवश्यकता हो, लाइव चैट और फोन सपोर्ट।",
        securePayments: "सुरक्षित भुगतान",
        securePaymentsDesc: "हर लेनदेन पर बैंक-ग्रेड एन्क्रिप्शन, त्वरित पुष्टि के साथ।",
        
        // Footer
        quickLinks: "त्वरित लिंक",
        servicesFooter: "सेवाएं",
        supportFooter: "सहायता",
        helpCenter: "सहायता केंद्र",
        cancellation: "रद्दीकरण नीति",
        contactUs: "संपर्क करें",
        feedback: "प्रतिक्रिया",
        footerText: "भारत के राष्ट्रीय रेल बुकिंग प्लेटफॉर्म का एक अवधारणा पुन: डिज़ाइन, एक कॉलेज UI/UX प्रतियोगिता के लिए बनाया गया।",
        copyright: "© 2026 IRCTC पुन: डिज़ाइन — एक छात्र अवधारणा परियोजना। भारतीय रेलवे से संबद्ध नहीं।"
    }
};

// Current language state
let currentLanguage = 'en';

// Function to update all text on page
function updateLanguage(lang) {
    currentLanguage = lang;
    const t = translations[lang];
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        const text = link.textContent.trim();
        if (text === 'Home' || text === 'होम') link.textContent = t.home;
        else if (text === 'Book Ticket' || text === 'टिकट बुक करें') link.textContent = t.bookTicket;
        else if (text === 'Services' || text === 'सेवाएं') link.textContent = t.services;
        else if (text === 'My Account' || text === 'मेरा खाता') link.textContent = t.myAccount;
    });
    
    // Update hero
    const badge = document.querySelector('.badge');
    if (badge) badge.textContent = t.badge;
    
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = t.heroTitle;
    
    const heroSubtext = document.querySelector('.hero-subtext');
    if (heroSubtext) heroSubtext.textContent = t.heroSubtext;
    
    // Update hero buttons
    const heroBtns = document.querySelectorAll('.hero-cta .btn');
    heroBtns.forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Book Now') || text.includes('अभी बुक करें')) {
            btn.innerHTML = `<i class="fa-solid fa-ticket"></i> ${t.bookNow}`;
        } else if (text.includes('Live Train Status') || text.includes('लाइव ट्रेन स्टेटस')) {
            btn.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${t.liveStatus}`;
        }
    });
    
    // Update search tabs
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
        const text = tab.textContent.trim();
        if (text.includes('Train') || text.includes('ट्रेन')) {
            tab.innerHTML = `<i class="fa-solid fa-train-subway"></i> ${t.train}`;
        } else if (text.includes('Food') || text.includes('खाना')) {
            tab.innerHTML = `<i class="fa-solid fa-utensils"></i> ${t.food}`;
        } else if (text.includes('Hotel') || text.includes('होटल')) {
            tab.innerHTML = `<i class="fa-solid fa-hotel"></i> ${t.hotel}`;
        }
    });
    
    // Update form labels
    const labels = document.querySelectorAll('.form-group label');
    labels.forEach(label => {
        const text = label.textContent.trim();
        if (text === 'From' || text === 'कहां से') label.textContent = t.from;
        else if (text === 'To' || text === 'कहां तक') label.textContent = t.to;
        else if (text === 'Journey Date' || text === 'यात्रा तिथि') label.textContent = t.journeyDate;
        else if (text === 'Passengers' || text === 'यात्री') label.textContent = t.passengers;
        else if (text === 'Class' || text === 'क्लास') label.textContent = t.class;
    });
    
    // Update search buttons
    const searchBtns = document.querySelectorAll('.btn-search, .btn-block');
    searchBtns.forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Search Trains') || text.includes('ट्रेन खोजें')) {
            btn.innerHTML = `<i class="fa-solid fa-magnifying-glass"></i> ${t.searchTrains}`;
        } else if (text.includes('Find Food Options') || text.includes('खाने के विकल्प खोजें')) {
            btn.innerHTML = `<i class="fa-solid fa-utensils"></i> ${t.findFood}`;
        } else if (text.includes('Search Hotels') || text.includes('होटल खोजें')) {
            btn.innerHTML = `<i class="fa-solid fa-hotel"></i> ${t.searchHotels}`;
        }
    });
    
    // Update stats
    const statLabels = document.querySelectorAll('.stat-label');
    const statTexts = [t.dailyTrains, t.happyPassengers, t.onTime, t.digitalTicketing];
    statLabels.forEach((label, index) => {
        if (index < statTexts.length) label.textContent = statTexts[index];
    });
    
    // Update features section heading
    const eyebrow = document.querySelector('.eyebrow');
    if (eyebrow) eyebrow.textContent = t.whyChoose;
    
    const featuresHeading = document.querySelector('.section-heading h2');
    if (featuresHeading) featuresHeading.textContent = t.featuresHeading;
    
    // Update feature cards
    const featureTitles = document.querySelectorAll('.feature-card h3');
    const featureDescs = document.querySelectorAll('.feature-card p');
    const featureTitleTexts = [t.easyBooking, t.liveTracking, t.foodDelivery, t.digitalTicket, t.support, t.securePayments];
    const featureDescTexts = [t.easyBookingDesc, t.liveTrackingDesc, t.foodDeliveryDesc, t.digitalTicketDesc, t.supportDesc, t.securePaymentsDesc];
    
    featureTitles.forEach((title, index) => {
        if (index < featureTitleTexts.length) title.textContent = featureTitleTexts[index];
    });
    
    featureDescs.forEach((desc, index) => {
        if (index < featureDescTexts.length) desc.textContent = featureDescTexts[index];
    });
    
    // Update footer
    const footerHeadings = document.querySelectorAll('.footer-col h4');
    if (footerHeadings.length >= 3) {
        footerHeadings[0].textContent = t.quickLinks;
        footerHeadings[1].textContent = t.servicesFooter;
        footerHeadings[2].textContent = t.supportFooter;
    }
    
    const footerLinks = document.querySelectorAll('.footer-col a');
    footerLinks.forEach(link => {
        const text = link.textContent.trim();
        if (text === 'Home' || text === 'होम') link.textContent = t.home;
        else if (text === 'Book Ticket' || text === 'टिकट बुक करें') link.textContent = t.bookTicket;
        else if (text === 'Services' || text === 'सेवाएं') link.textContent = t.services;
        else if (text === 'My Account' || text === 'मेरा खाता') link.textContent = t.myAccount;
        else if (text === 'Help Center' || text === 'सहायता केंद्र') link.textContent = t.helpCenter;
        else if (text === 'Cancellation Policy' || text === 'रद्दीकरण नीति') link.textContent = t.cancellation;
        else if (text === 'Contact Us' || text === 'संपर्क करें') link.textContent = t.contactUs;
        else if (text === 'Feedback' || text === 'प्रतिक्रिया') link.textContent = t.feedback;
    });
    
    const footerBrand = document.querySelector('.footer-brand p');
    if (footerBrand) footerBrand.textContent = t.footerText;
    
    const footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) footerBottom.textContent = t.copyright;
    
    // Update language button text
    const langBtn = document.querySelector('.icon-btn .lang-label');
    if (langBtn) {
        langBtn.textContent = lang === 'en' ? 'EN' : 'HI';
    }
    
    // Store preference
    localStorage.setItem('preferredLanguage', lang);
}

// Language toggle button
document.addEventListener('DOMContentLoaded', function() {
    const langBtn = document.getElementById('langToggle');
    
    if (langBtn) {
        // Check for saved preference
        const savedLang = localStorage.getItem('preferredLanguage') || 'en';
        currentLanguage = savedLang;
        
        // Update language button label
        const langLabel = langBtn.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = savedLang === 'en' ? 'EN' : 'HI';
        }
        
        // Apply saved language
        updateLanguage(savedLang);
        
        // Toggle on click
        langBtn.addEventListener('click', function() {
            const newLang = currentLanguage === 'en' ? 'hi' : 'en';
            updateLanguage(newLang);
            
            // Update button label
            const label = this.querySelector('.lang-label');
            if (label) {
                label.textContent = newLang === 'en' ? 'EN' : 'HI';
            }
        });
    }
});