// ============================================
// IRCTC REDESIGNED — MAIN JS
// ============================================

document.addEventListener('DOMContentLoaded', function() {

    // ============================================
    // 1. HAMBURGER MENU - MOBILE NAVIGATION
    // ============================================

    const hamburger = document.getElementById('hamburger');
    const mainNav = document.getElementById('mainNav');

    if (hamburger && mainNav) {
        console.log('✅ Hamburger menu initialized');

        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            hamburger.classList.toggle('open');
            mainNav.classList.toggle('open');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (mainNav.classList.contains('open')) {
                const isClickInside = mainNav.contains(e.target) || hamburger.contains(e.target);
                if (!isClickInside) {
                    mainNav.classList.remove('open');
                    hamburger.classList.remove('open');
                }
            }
        });

        // Close menu after selecting a link (mobile)
        mainNav.querySelectorAll('.nav-link').forEach(function(link) {
            link.addEventListener('click', function() {
                mainNav.classList.remove('open');
                hamburger.classList.remove('open');
            });
        });
    }

    // ============================================
    // 2. NAVBAR SCROLL EFFECT
    // ============================================

    const siteHeader = document.getElementById('siteHeader');
    if (siteHeader) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                siteHeader.classList.add('scrolled');
            } else {
                siteHeader.classList.remove('scrolled');
            }
        });
    }

    // ============================================
    // 3. DARK MODE TOGGLE
    // ============================================

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        // Restore saved preference
        if (localStorage.getItem('irctc-theme') === 'dark') {
            document.body.classList.add('dark-mode');
            var icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }

        themeToggle.addEventListener('click', function() {
            var isDark = document.body.classList.toggle('dark-mode');
            var icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-moon', !isDark);
                icon.classList.toggle('fa-sun', isDark);
            }
            localStorage.setItem('irctc-theme', isDark ? 'dark' : 'light');
        });
    }

    // ============================================
    // 4. LANGUAGE TOGGLE (Mock)
    // ============================================

    var langToggle = document.getElementById('langToggle');
    if (langToggle) {
        var languages = ['EN', 'हिं'];
        var langIndex = 0;
        langToggle.addEventListener('click', function() {
            langIndex = (langIndex + 1) % languages.length;
            var label = this.querySelector('.lang-label');
            if (label) {
                label.textContent = languages[langIndex];
            }
        });
    }

    // ============================================
    // 5. STAT COUNTER ANIMATION
    // ============================================

    var statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        var animateCounter = function(el) {
            var target = parseInt(el.dataset.target, 10);
            var suffix = el.dataset.suffix || '';
            var duration = 1400;
            var startTime = performance.now();

            var step = function(now) {
                var progress = Math.min((now - startTime) / duration, 1);
                var eased = 1 - Math.pow(1 - progress, 3);
                var value = Math.floor(eased * target);
                el.textContent = value + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                }
            };
            requestAnimationFrame(step);
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        statNumbers.forEach(function(el) {
            observer.observe(el);
        });
    }

    // ============================================
    // 6. SEARCH TABS (Home page)
    // ============================================

    var tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                tabButtons.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                var targetTab = btn.dataset.tab;
                document.querySelectorAll('[data-tab-content]').forEach(function(panel) {
                    panel.hidden = panel.dataset.tabContent !== targetTab;
                });
            });
        });
    }

    // ============================================
    // 7. SWAP FROM/TO BUTTONS
    // ============================================

    var setupSwap = function(btnId, fromId, toId) {
        var btn = document.getElementById(btnId);
        var fromInput = document.getElementById(fromId);
        var toInput = document.getElementById(toId);
        if (btn && fromInput && toInput) {
            btn.addEventListener('click', function() {
                var temp = fromInput.value;
                fromInput.value = toInput.value;
                toInput.value = temp;
            });
        }
    };
    setupSwap('swapBtn', 'fromInput', 'toInput');
    setupSwap('bookingSwapBtn', 'bFrom', 'bTo');

    // ============================================
    // 8. HOME SEARCH FORM SUBMIT
    // ============================================

    var searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            window.location.href = 'booking.html';
        });
    }

    // ============================================
    // 9. BOOKING WIZARD
    // ============================================

    var wizardSteps = document.querySelectorAll('.wizard-step');
    var stepIndicators = document.querySelectorAll('.step-indicator .step');

    if (wizardSteps.length > 0) {
        var goToStep = function(stepNumber) {
            wizardSteps.forEach(function(step) {
                step.classList.toggle('active', step.dataset.stepPanel === String(stepNumber));
            });
            stepIndicators.forEach(function(ind) {
                var indStep = parseInt(ind.dataset.step, 10);
                ind.classList.toggle('active', indStep === stepNumber);
                ind.classList.toggle('completed', indStep < stepNumber);
            });
            var bookingCard = document.querySelector('.booking-card');
            if (bookingCard) {
                bookingCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        };

        document.querySelectorAll('[data-next]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var currentStep = btn.closest('.wizard-step');
                var requiredFields = currentStep.querySelectorAll('input[required], select[required]');
                var valid = true;
                requiredFields.forEach(function(field) {
                    if (!field.value.trim()) {
                        valid = false;
                        field.style.borderColor = '#E53935';
                    } else {
                        field.style.borderColor = '';
                    }
                });

                if (currentStep.dataset.stepPanel === '2') {
                    var selected = currentStep.querySelector('input[name="train"]:checked');
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

        document.querySelectorAll('[data-prev]').forEach(function(btn) {
            btn.addEventListener('click', function() {
                goToStep(parseInt(btn.dataset.prev, 10));
            });
        });

        var confirmBtn = document.getElementById('confirmBookingBtn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function() {
                var payDetail = document.getElementById('payDetail');
                if (payDetail && !payDetail.value.trim()) {
                    payDetail.style.borderColor = '#E53935';
                    return;
                }
                alert('🎉 Booking confirmed! Your e-ticket has been sent to your registered mobile number and email.');
                window.location.href = 'profile.html';
            });
        }
    }

    // ============================================
    // 10. TRAIN CARD SELECTION HIGHLIGHT
    // ============================================

    var trainRadios = document.querySelectorAll('input[name="train"]');
    if (trainRadios.length > 0) {
        trainRadios.forEach(function(radio) {
            radio.addEventListener('change', function() {
                document.querySelectorAll('.train-card').forEach(function(card) {
                    card.classList.remove('selected');
                });
                radio.closest('.train-card').classList.add('selected');
            });
        });
    }

    // ============================================
    // 11. PAYMENT METHOD FIELD SWITCH
    // ============================================

    var payMethod = document.getElementById('payMethod');
    var payDetail = document.getElementById('payDetail');
    if (payMethod && payDetail) {
        payMethod.addEventListener('change', function() {
            var placeholders = {
                upi: { label: 'UPI ID', placeholder: 'yourname@upi' },
                card: { label: 'Card Number', placeholder: '1234 5678 9012 3456' },
                netbanking: { label: 'Bank Name', placeholder: 'e.g. State Bank of India' }
            };
            var config = placeholders[payMethod.value];
            var label = document.querySelector('label[for="payDetail"]');
            if (label) {
                label.textContent = config.label;
            }
            payDetail.placeholder = config.placeholder;
        });
    }

    // ============================================
    // 12. PROFILE TABS
    // ============================================

    var profileTabBtns = document.querySelectorAll('.profile-tab-btn');
    if (profileTabBtns.length > 0) {
        profileTabBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                profileTabBtns.forEach(function(b) {
                    b.classList.remove('active');
                });
                btn.classList.add('active');

                var target = btn.dataset.profileTab;
                document.querySelectorAll('.profile-tab-panel').forEach(function(panel) {
                    panel.classList.toggle('active', panel.dataset.profilePanel === target);
                });
            });
        });
    }

    // ============================================
    // 13. SETTINGS FORM SUBMIT
    // ============================================

    var settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('✅ Your account settings have been saved.');
        });
    }

    // ============================================
    // 14. SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================

    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId.length > 1) {
                var targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // ============================================
    // 15. FADE-IN ON SCROLL FOR CARDS
    // ============================================

    var fadeTargets = document.querySelectorAll('.feature-card, .service-card, .train-card, .profile-stat-card');
    if (fadeTargets.length > 0) {
        var fadeObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    fadeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        fadeTargets.forEach(function(el) {
            fadeObserver.observe(el);
        });
    }

}); // END DOMContentLoaded

// ============================================
// LANGUAGE TOGGLE FUNCTIONALITY
// ============================================

var translations = {
    en: {
        home: "Home",
        bookTicket: "Book Ticket",
        services: "Services",
        myAccount: "My Account",
        badge: "🇮🇳 Government of India Initiative",
        heroTitle: "Book Your Journey in Seconds",
        heroSubtext: "India's fastest, simplest way to book train tickets, track journeys, and travel with confidence — redesigned for real people, not just forms.",
        bookNow: "Book Now",
        liveStatus: "Live Train Status",
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
        dailyTrains: "Daily Trains",
        happyPassengers: "Happy Passengers",
        onTime: "On-Time Performance",
        digitalTicketing: "Digital Ticketing",
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
        home: "होम",
        bookTicket: "टिकट बुक करें",
        services: "सेवाएं",
        myAccount: "मेरा खाता",
        badge: "🇮🇳 भारत सरकार की पहल",
        heroTitle: "अपनी यात्रा बुक करें",
        heroSubtext: "ट्रेन टिकट बुक करने, यात्रा ट्रैक करने और आत्मविश्वास के साथ यात्रा करने का भारत का सबसे तेज़, सरल तरीका — सिर्फ फॉर्म के लिए नहीं, बल्कि वास्तविक लोगों के लिए फिर से डिज़ाइन किया गया।",
        bookNow: "अभी बुक करें",
        liveStatus: "लाइव ट्रेन स्टेटस",
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
        dailyTrains: "दैनिक ट्रेनें",
        happyPassengers: "खुश यात्री",
        onTime: "समय पर प्रदर्शन",
        digitalTicketing: "डिजिटल टिकटिंग",
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

var currentLanguage = 'en';

function updateLanguage(lang) {
    currentLanguage = lang;
    var t = translations[lang];

    document.querySelectorAll('.nav-link').forEach(function(link) {
        var text = link.textContent.trim();
        if (text === 'Home' || text === 'होम') link.textContent = t.home;
        else if (text === 'Book Ticket' || text === 'टिकट बुक करें') link.textContent = t.bookTicket;
        else if (text === 'Services' || text === 'सेवाएं') link.textContent = t.services;
        else if (text === 'My Account' || text === 'मेरा खाता') link.textContent = t.myAccount;
    });

    var badge = document.querySelector('.badge');
    if (badge) badge.textContent = t.badge;

    var heroTitle = document.querySelector('.hero-title');
    if (heroTitle) heroTitle.textContent = t.heroTitle;

    var heroSubtext = document.querySelector('.hero-subtext');
    if (heroSubtext) heroSubtext.textContent = t.heroSubtext;

    var heroBtns = document.querySelectorAll('.hero-cta .btn');
    heroBtns.forEach(function(btn) {
        var text = btn.textContent.trim();
        if (text.includes('Book Now') || text.includes('अभी बुक करें')) {
            btn.innerHTML = '<i class="fa-solid fa-ticket"></i> ' + t.bookNow;
        } else if (text.includes('Live Train Status') || text.includes('लाइव ट्रेन स्टेटस')) {
            btn.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + t.liveStatus;
        }
    });

    var tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(function(tab) {
        var text = tab.textContent.trim();
        if (text.includes('Train') || text.includes('ट्रेन')) {
            tab.innerHTML = '<i class="fa-solid fa-train-subway"></i> ' + t.train;
        } else if (text.includes('Food') || text.includes('खाना')) {
            tab.innerHTML = '<i class="fa-solid fa-utensils"></i> ' + t.food;
        } else if (text.includes('Hotel') || text.includes('होटल')) {
            tab.innerHTML = '<i class="fa-solid fa-hotel"></i> ' + t.hotel;
        }
    });

    var labels = document.querySelectorAll('.form-group label');
    labels.forEach(function(label) {
        var text = label.textContent.trim();
        if (text === 'From' || text === 'कहां से') label.textContent = t.from;
        else if (text === 'To' || text === 'कहां तक') label.textContent = t.to;
        else if (text === 'Journey Date' || text === 'यात्रा तिथि') label.textContent = t.journeyDate;
        else if (text === 'Passengers' || text === 'यात्री') label.textContent = t.passengers;
        else if (text === 'Class' || text === 'क्लास') label.textContent = t.class;
    });

    var searchBtns = document.querySelectorAll('.btn-search, .btn-block');
    searchBtns.forEach(function(btn) {
        var text = btn.textContent.trim();
        if (text.includes('Search Trains') || text.includes('ट्रेन खोजें')) {
            btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> ' + t.searchTrains;
        } else if (text.includes('Find Food Options') || text.includes('खाने के विकल्प खोजें')) {
            btn.innerHTML = '<i class="fa-solid fa-utensils"></i> ' + t.findFood;
        } else if (text.includes('Search Hotels') || text.includes('होटल खोजें')) {
            btn.innerHTML = '<i class="fa-solid fa-hotel"></i> ' + t.searchHotels;
        }
    });

    var statLabels = document.querySelectorAll('.stat-label');
    var statTexts = [t.dailyTrains, t.happyPassengers, t.onTime, t.digitalTicketing];
    statLabels.forEach(function(label, index) {
        if (index < statTexts.length) label.textContent = statTexts[index];
    });

    var eyebrow = document.querySelector('.eyebrow');
    if (eyebrow) eyebrow.textContent = t.whyChoose;

    var featuresHeading = document.querySelector('.section-heading h2');
    if (featuresHeading) featuresHeading.textContent = t.featuresHeading;

    var featureTitles = document.querySelectorAll('.feature-card h3');
    var featureDescs = document.querySelectorAll('.feature-card p');
    var featureTitleTexts = [t.easyBooking, t.liveTracking, t.foodDelivery, t.digitalTicket, t.support, t.securePayments];
    var featureDescTexts = [t.easyBookingDesc, t.liveTrackingDesc, t.foodDeliveryDesc, t.digitalTicketDesc, t.supportDesc, t.securePaymentsDesc];

    featureTitles.forEach(function(title, index) {
        if (index < featureTitleTexts.length) title.textContent = featureTitleTexts[index];
    });

    featureDescs.forEach(function(desc, index) {
        if (index < featureDescTexts.length) desc.textContent = featureDescTexts[index];
    });

    var footerHeadings = document.querySelectorAll('.footer-col h4');
    if (footerHeadings.length >= 3) {
        footerHeadings[0].textContent = t.quickLinks;
        footerHeadings[1].textContent = t.servicesFooter;
        footerHeadings[2].textContent = t.supportFooter;
    }

    var footerLinks = document.querySelectorAll('.footer-col a');
    footerLinks.forEach(function(link) {
        var text = link.textContent.trim();
        if (text === 'Home' || text === 'होम') link.textContent = t.home;
        else if (text === 'Book Ticket' || text === 'टिकट बुक करें') link.textContent = t.bookTicket;
        else if (text === 'Services' || text === 'सेवाएं') link.textContent = t.services;
        else if (text === 'My Account' || text === 'मेरा खाता') link.textContent = t.myAccount;
        else if (text === 'Help Center' || text === 'सहायता केंद्र') link.textContent = t.helpCenter;
        else if (text === 'Cancellation Policy' || text === 'रद्दीकरण नीति') link.textContent = t.cancellation;
        else if (text === 'Contact Us' || text === 'संपर्क करें') link.textContent = t.contactUs;
        else if (text === 'Feedback' || text === 'प्रतिक्रिया') link.textContent = t.feedback;
    });

    var footerBrand = document.querySelector('.footer-brand p');
    if (footerBrand) footerBrand.textContent = t.footerText;

    var footerBottom = document.querySelector('.footer-bottom p');
    if (footerBottom) footerBottom.textContent = t.copyright;

    var langBtn = document.querySelector('.icon-btn .lang-label');
    if (langBtn) {
        langBtn.textContent = lang === 'en' ? 'EN' : 'HI';
    }

    localStorage.setItem('preferredLanguage', lang);
}

document.addEventListener('DOMContentLoaded', function() {
    var langBtn = document.getElementById('langToggle');

    if (langBtn) {
        var savedLang = localStorage.getItem('preferredLanguage') || 'en';
        currentLanguage = savedLang;

        var langLabel = langBtn.querySelector('.lang-label');
        if (langLabel) {
            langLabel.textContent = savedLang === 'en' ? 'EN' : 'HI';
        }

        updateLanguage(savedLang);

        langBtn.addEventListener('click', function() {
            var newLang = currentLanguage === 'en' ? 'hi' : 'en';
            updateLanguage(newLang);

            var label = this.querySelector('.lang-label');
            if (label) {
                label.textContent = newLang === 'en' ? 'EN' : 'HI';
            }
        });
    }
});