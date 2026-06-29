const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");
const navLinks = [...document.querySelectorAll('.nav-link, #mobile-menu a[href^="#"]')];
const desktopNavLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("section[id]")];
const skillBars = [...document.querySelectorAll(".skill-progress")];
const revealElements = [...document.querySelectorAll(".reveal-up, .reveal-left, .reveal-right, .reveal-scale")];
const tiltElements = [...document.querySelectorAll("[data-tilt]")];
const counterElements = [...document.querySelectorAll("[data-counter]")];
const spotlightElements = [...document.querySelectorAll("[data-spotlight]")];
const magneticElements = [...document.querySelectorAll("[data-magnetic]")];
const parallaxElements = [...document.querySelectorAll("[data-parallax]")];
const pointerReactiveElements = [...document.querySelectorAll(".project-card, .service-card, #contactForm, .stat-card")];
const typedRole = document.getElementById("typed-role");
const contactForm = document.getElementById("contactForm");
const root = document.documentElement;
const desktopToggle = document.getElementById("theme-toggle");
const mobileToggle = document.getElementById("theme-toggle-mobile");
const progressBar = document.getElementById("scroll-progress-bar");
const siteNav = document.getElementById("site-nav");
const pageLoader = document.getElementById("page-loader");
const cursorDot = document.getElementById("cursor-dot");
const cursorRing = document.getElementById("cursor-ring");

document.body.classList.add("is-loading");

const rolePhrases = [
    "responsive interfaces",
    "RESTful APIs",
    "scalable web apps"
];

if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
    });
}

function closeMobileMenu() {
    if (mobileMenu) {
        mobileMenu.classList.add("hidden");
    }
}

function updateScrollState() {
    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (progressBar) {
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    }

    if (siteNav) {
        siteNav.classList.toggle("is-scrolled", scrollTop > 24);
    }
}

function updateActiveNav(sectionId) {
    desktopNavLinks.forEach((link) => {
        link.classList.toggle("active-nav", link.getAttribute("href") === `#${sectionId}`);
    });
}

function hidePageLoader() {
    if (!pageLoader) {
        document.body.classList.remove("is-loading");
        return;
    }

    pageLoader.classList.add("is-hidden");
    document.body.classList.remove("is-loading");
}

navLinks.forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const targetId = anchor.getAttribute("href");
        if (!targetId || !targetId.startsWith("#")) {
            return;
        }

        const targetElement = document.querySelector(targetId);
        if (!targetElement) {
            return;
        }

        event.preventDefault();
        closeMobileMenu();

        const offset = 80;
        const top = targetElement.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({
            top,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        updateActiveNav(targetElement.id);
    });
});

if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    updateActiveNav(entry.target.id);
                }
            });
        },
        {
            rootMargin: "-35% 0px -45% 0px",
            threshold: 0.1
        }
    );

    sections.forEach((section) => sectionObserver.observe(section));

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry, index) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.transitionDelay = prefersReducedMotion ? "0ms" : `${Math.min(index * 60, 240)}ms`;
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.16 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));

    const skillsAnimated = new WeakSet();
    const skillObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || skillsAnimated.has(entry.target)) {
                    return;
                }

                const bar = entry.target;
                const targetWidth = bar.dataset.width || bar.style.width;
                bar.dataset.width = targetWidth;
                requestAnimationFrame(() => {
                    bar.style.width = targetWidth;
                });
                skillsAnimated.add(bar);
                observer.unobserve(bar);
            });
        },
        { threshold: 0.45 }
    );

    skillBars.forEach((bar) => {
        bar.dataset.width = bar.style.width;
        bar.style.width = prefersReducedMotion ? bar.dataset.width : "0";
        skillObserver.observe(bar);
    });

    const counted = new WeakSet();
    const counterObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || counted.has(entry.target)) {
                    return;
                }

                animateCounter(entry.target);
                counted.add(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.55 }
    );

    counterElements.forEach((counter) => counterObserver.observe(counter));
} else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
    skillBars.forEach((bar) => {
        bar.dataset.width = bar.style.width;
    });
    counterElements.forEach((counter) => {
        counter.textContent = counter.dataset.counter;
    });
}

function animateCounter(element) {
    const target = Number(element.dataset.counter || 0);
    if (prefersReducedMotion) {
        element.textContent = String(target);
        return;
    }

    const duration = 1200;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

tiltElements.forEach((element) => {
    if (prefersReducedMotion) {
        return;
    }

    element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 8;
        const rotateY = (x - 0.5) * 10;
        element.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });

    element.addEventListener("pointerleave", () => {
        element.style.transform = "";
    });
});

spotlightElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        element.style.setProperty("--spotlight-x", `${x}%`);
        element.style.setProperty("--spotlight-y", `${y}%`);
    });
});

magneticElements.forEach((element) => {
    if (prefersReducedMotion) {
        return;
    }

    element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const offsetX = ((event.clientX - rect.left) / rect.width - 0.5) * 12;
        const offsetY = ((event.clientY - rect.top) / rect.height - 0.5) * 12;
        element.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });

    element.addEventListener("pointerleave", () => {
        element.style.transform = "";
    });
});

pointerReactiveElements.forEach((element) => {
    element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        element.style.setProperty("--pointer-x", `${x}%`);
        element.style.setProperty("--pointer-y", `${y}%`);
    });
});

if (!prefersReducedMotion && cursorDot && cursorRing && window.innerWidth > 768) {
    let ringX = 0;
    let ringY = 0;
    let mouseX = 0;
    let mouseY = 0;

    const animateCursorRing = () => {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
        requestAnimationFrame(animateCursorRing);
    };

    document.addEventListener("pointermove", (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
        document.body.classList.add("cursor-active");
    });

    document.addEventListener("pointerleave", () => {
        document.body.classList.remove("cursor-active");
    });

    animateCursorRing();
}

if (!prefersReducedMotion) {
    const heroSection = document.getElementById("home");

    if (heroSection && parallaxElements.length > 0) {
        heroSection.addEventListener("pointermove", (event) => {
            const rect = heroSection.getBoundingClientRect();
            const offsetX = event.clientX - rect.left - rect.width / 2;
            const offsetY = event.clientY - rect.top - rect.height / 2;

            parallaxElements.forEach((element) => {
                const speed = Number(element.dataset.parallaxSpeed || 10);
                const moveX = offsetX / speed;
                const moveY = offsetY / speed;
                element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
            });
        });

        heroSection.addEventListener("pointerleave", () => {
            parallaxElements.forEach((element) => {
                element.style.transform = "";
            });
        });
    }
}

function runTypedRole() {
    if (!typedRole || prefersReducedMotion) {
        return;
    }

    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const step = () => {
        const phrase = rolePhrases[phraseIndex];

        typedRole.textContent = phrase.slice(0, charIndex);

        if (!deleting && charIndex < phrase.length) {
            charIndex += 1;
            setTimeout(step, 85);
            return;
        }

        if (!deleting && charIndex === phrase.length) {
            deleting = true;
            setTimeout(step, 1300);
            return;
        }

        if (deleting && charIndex > 0) {
            charIndex -= 1;
            setTimeout(step, 35);
            return;
        }

        deleting = false;
        phraseIndex = (phraseIndex + 1) % rolePhrases.length;
        setTimeout(step, 250);
    };

    step();
}

function setTheme(isDark) {
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");

    if (desktopToggle) {
        desktopToggle.setAttribute("aria-pressed", String(isDark));
        desktopToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        desktopToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
    }

    if (mobileToggle) {
        mobileToggle.setAttribute("aria-pressed", String(isDark));
        mobileToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
        setTheme(true);
        return;
    }
    if (savedTheme === "light") {
        setTheme(false);
        return;
    }

    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(prefersDark);
}

initTheme();
runTypedRole();
updateScrollState();

window.addEventListener("scroll", updateScrollState, { passive: true });
window.addEventListener("load", hidePageLoader);

if (desktopToggle) {
    desktopToggle.addEventListener("click", () => {
        setTheme(!root.classList.contains("dark"));
    });
}

if (mobileToggle) {
    mobileToggle.addEventListener("click", () => {
        setTheme(!root.classList.contains("dark"));
    });
}

if (typeof emailjs !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        emailjs.init("uCZVHQe78prgnT8Xx");
    });
}

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (typeof emailjs === "undefined") {
            alert("Email service is unavailable right now. Please try again later.");
            return;
        }

        emailjs.sendForm("service_rsfum6t", "template_51374aw", contactForm).then(
            () => {
                alert("Message sent successfully!");
                contactForm.reset();
            },
            (error) => {
                alert("Failed to send message. Please try again.");
                console.error("EmailJS error:", error);
            }
        );
    });
}
