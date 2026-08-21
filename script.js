// =====================================================
// MOBILE MENU
// =====================================================

const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("show");

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("show")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});


navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("show");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});


// =====================================================
// DARK / LIGHT MODE
// =====================================================

const themeToggle = document.getElementById("theme-toggle");

themeToggle.addEventListener("click", () => {

    document.body.classList.toggle("light-mode");

    const icon = themeToggle.querySelector("i");

    if (document.body.classList.contains("light-mode")) {
        icon.classList.remove("fa-moon");
        icon.classList.add("fa-sun");

        localStorage.setItem("theme", "light");
    } else {
        icon.classList.remove("fa-sun");
        icon.classList.add("fa-moon");

        localStorage.setItem("theme", "dark");
    }
});


// =====================================================
// LOAD SAVED THEME
// =====================================================

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
    document.body.classList.add("light-mode");

    const icon = themeToggle.querySelector("i");

    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
}


// =====================================================
// CURRENT YEAR
// =====================================================

document.getElementById("year").textContent = new Date().getFullYear();


// =====================================================
// ACTIVE NAVIGATION
// =====================================================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${current}`) {
            link.classList.add("active");
        }

    });

});


// =====================================================
// CONTACT FORM
// =====================================================
const contactForm = document.getElementById("contact-form");

contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = `Portfolio message from ${name}`;
    const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

    window.location.href =
        `mailto:icedricwian@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

});


// =====================================================
// VISITOR TRACKING & ANALYTICS
// =====================================================

class VisitorAnalytics {
    constructor() {
        this.storageKey = "visitorAnalytics";
        this.visitorIdKey = "visitorId";
        this.initializeAnalytics();
    }

    initializeAnalytics() {
        // Create unique visitor ID if doesn't exist
        if (!localStorage.getItem(this.visitorIdKey)) {
            localStorage.setItem(this.visitorIdKey, this.generateVisitorId());
        }

        // Get or create analytics data
        let analytics = JSON.parse(localStorage.getItem(this.storageKey)) || {
            totalVisits: 0,
            uniqueVisitors: new Set(),
            lastVisit: null,
            todayVisits: 0,
            lastVisitDate: new Date().toDateString(),
            visitHistory: []
        };

        // Update visit counts
        analytics.totalVisits = (analytics.totalVisits || 0) + 1;

        const today = new Date().toDateString();
        if (analytics.lastVisitDate !== today) {
            analytics.todayVisits = 1;
            analytics.lastVisitDate = today;
        } else {
            analytics.todayVisits = (analytics.todayVisits || 0) + 1;
        }

        // Track visitor
        const visitorId = localStorage.getItem(this.visitorIdKey);
        if (!analytics.uniqueVisitors) {
            analytics.uniqueVisitors = [];
        }

        if (!Array.isArray(analytics.uniqueVisitors)) {
            analytics.uniqueVisitors = Array.from(analytics.uniqueVisitors || []);
        }

        if (!analytics.uniqueVisitors.includes(visitorId)) {
            analytics.uniqueVisitors.push(visitorId);
        }

        // Record visit time
        analytics.lastVisit = new Date().toLocaleString();

        // Track visit history
        if (!analytics.visitHistory) {
            analytics.visitHistory = [];
        }
        analytics.visitHistory.push({
            timestamp: new Date().toLocaleString(),
            visitorId: visitorId
        });

        // Keep only last 100 visits
        if (analytics.visitHistory.length > 100) {
            analytics.visitHistory = analytics.visitHistory.slice(-100);
        }

        // Save analytics
        localStorage.setItem(this.storageKey, JSON.stringify(analytics));

        // Update UI
        this.updateDisplay(analytics);
    }

    generateVisitorId() {
        return 'visitor_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    }

    updateDisplay(analytics) {
        const visitorCountElement = document.getElementById("visitor-count");
        const totalVisitsElement = document.getElementById("total-visits");
        const uniqueVisitsElement = document.getElementById("unique-visits");
        const todayVisitsElement = document.getElementById("today-visits");
        const lastVisitElement = document.getElementById("last-visit");

        if (visitorCountElement) {
            visitorCountElement.textContent = analytics.totalVisits;
            // Trigger animation
            visitorCountElement.style.animation = 'none';
            setTimeout(() => {
                visitorCountElement.style.animation = 'slideInUp 0.3s ease-out';
            }, 10);
        }

        if (totalVisitsElement) {
            totalVisitsElement.textContent = analytics.totalVisits;
        }

        if (uniqueVisitsElement) {
            uniqueVisitsElement.textContent = analytics.uniqueVisitors.length;
        }

        if (todayVisitsElement) {
            todayVisitsElement.textContent = analytics.todayVisits;
        }

        if (lastVisitElement) {
            lastVisitElement.textContent = this.formatLastVisit(analytics.lastVisit);
        }
    }

    formatLastVisit(lastVisitString) {
        if (!lastVisitString) return "Never";
        
        try {
            const lastVisitDate = new Date(lastVisitString);
            const now = new Date();
            const diffMs = now - lastVisitDate;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffMins < 1) return "Just now";
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return lastVisitDate.toLocaleDateString();
        } catch (e) {
            return lastVisitString;
        }
    }
}

// Initialize visitor analytics on page load
document.addEventListener("DOMContentLoaded", () => {
    new VisitorAnalytics();
});


// =====================================================
// WORK GALLERY CARDS
// =====================================================

const workCards = document.querySelectorAll("[data-work-card]");

workCards.forEach(card => {
    const trigger = card.querySelector(".work-card-trigger");

    trigger.addEventListener("click", () => {
        const isExpanded = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isExpanded));
    });
});


// =====================================================
// IMAGE VIEWER
// =====================================================

const imageViewer = document.getElementById("image-viewer");
const imageViewerImage = document.getElementById("image-viewer-image");
const imageViewerStage = document.querySelector(".image-viewer-stage");
const imageViewerClose = document.getElementById("image-viewer-close");
const imageZoomIn = document.getElementById("image-zoom-in");
const imageZoomOut = document.getElementById("image-zoom-out");
const imageZoomReset = document.getElementById("image-zoom-reset");
const galleryImages = document.querySelectorAll(".work-card-gallery img");
let imageZoom = 1;

function updateImageZoom() {
    imageViewerImage.style.transform = `scale(${imageZoom})`;
}

function closeImageViewer() {
    imageViewer.hidden = true;
    imageViewerImage.removeAttribute("src");
    imageZoom = 1;
    document.body.style.overflow = "";
}

function openImageViewer(image) {
    imageViewerImage.src = image.currentSrc || image.src;
    imageViewerImage.alt = image.alt;
    imageZoom = 1;
    updateImageZoom();
    imageViewer.hidden = false;
    document.body.style.overflow = "hidden";
    imageViewerClose.focus();
}

galleryImages.forEach(image => {
    image.addEventListener("click", () => openImageViewer(image));
});

imageZoomIn.addEventListener("click", () => {
    imageZoom = Math.min(imageZoom + 0.25, 3.5);
    updateImageZoom();
});

imageZoomOut.addEventListener("click", () => {
    imageZoom = Math.max(imageZoom - 0.25, 0.75);
    updateImageZoom();
});

imageZoomReset.addEventListener("click", () => {
    imageZoom = 1;
    updateImageZoom();
});

imageViewerClose.addEventListener("click", closeImageViewer);

imageViewer.addEventListener("click", event => {
    if (event.target === imageViewer) {
        closeImageViewer();
    }
});

imageViewerStage.addEventListener("wheel", event => {
    event.preventDefault();
    imageZoom = Math.max(0.75, Math.min(3.5, imageZoom + (event.deltaY < 0 ? 0.15 : -0.15)));
    updateImageZoom();
}, { passive: false });

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !imageViewer.hidden) {
        closeImageViewer();
    }
});


// =====================================================
// EXPERIENCE ROOM
// =====================================================

const journeyTrigger = document.getElementById("journey-trigger");
const journeyRoom = document.getElementById("journey-room");

journeyTrigger.addEventListener("click", () => {
    const isExpanded = journeyTrigger.getAttribute("aria-expanded") === "true";
    journeyTrigger.setAttribute("aria-expanded", String(!isExpanded));
    journeyRoom.hidden = isExpanded;
});

const achievementTrigger = document.getElementById("achievement-trigger");
const achievementRoom = document.getElementById("achievement-room");

achievementTrigger.addEventListener("click", () => {
    const isExpanded = achievementTrigger.getAttribute("aria-expanded") === "true";
    achievementTrigger.setAttribute("aria-expanded", String(!isExpanded));
    achievementRoom.hidden = isExpanded;
});


// =====================================================
// SCROLL REVEALS
// =====================================================

const revealGroups = document.querySelectorAll(
    ".section-heading, .about-grid, .skills-grid, .projects-grid, " +
    ".work-showcase, .cv-layout, .timeline, .achievements-grid, .contact-grid"
);

revealGroups.forEach(group => {
    group.classList.add("reveal-on-scroll");

    if (
        group.matches(".skills-grid, .projects-grid") ||
        group.matches(".work-showcase")
    ) {
        group.classList.add("reveal-stagger");
        Array.from(group.children).forEach(child => {
            child.classList.add("reveal-on-scroll");
        });
    }
});

const revealElements = document.querySelectorAll(".reveal-on-scroll");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px" });

    revealElements.forEach(element => revealObserver.observe(element));
} else {
    revealElements.forEach(element => element.classList.add("is-visible"));
}