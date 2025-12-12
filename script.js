// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Close mobile menu if open
            document.getElementById('mobile-menu').classList.add('hidden');
            
            // Scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active-nav');
            });
            this.classList.add('active-nav');
        }
    });
});

// Update active nav link on scroll
window.addEventListener('scroll', function() {
    const scrollPosition = window.scrollY;
    
    document.querySelectorAll('section').forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active-nav');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active-nav');
                }
            });
        }
    });
});

// Animate skill bars on scroll
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
}

// Intersection Observer for skill bars animation
const skillsSection = document.getElementById('skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

if (skillsSection) {
    observer.observe(skillsSection);
}

// Dark mode toggle with persistence
(function() {
    const root = document.documentElement;
    const desktopToggle = document.getElementById('theme-toggle');
    const mobileToggle = document.getElementById('theme-toggle-mobile');

    function setTheme(isDark) {
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (desktopToggle) {
                desktopToggle.setAttribute('aria-pressed', 'true');
                desktopToggle.innerHTML = '<i class="fas fa-sun"></i>';
                desktopToggle.title = 'Switch to light mode';
            }
            if (mobileToggle) mobileToggle.setAttribute('aria-pressed', 'true');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (desktopToggle) {
                desktopToggle.setAttribute('aria-pressed', 'false');
                desktopToggle.innerHTML = '<i class="fas fa-moon"></i>';
                desktopToggle.title = 'Switch to dark mode';
            }
            if (mobileToggle) mobileToggle.setAttribute('aria-pressed', 'false');
        }
    }

    function initTheme() {
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') return setTheme(true);
        if (saved === 'light') return setTheme(false);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark);
    }

    initTheme();

    if (desktopToggle) desktopToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    if (mobileToggle) mobileToggle.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
})();

// Initialize EmailJS
document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("uCZVHQe78prgnT8Xx"); // Your public key
});

document.getElementById("contactForm").addEventListener("submit", function(event) {
    event.preventDefault();

    emailjs.sendForm("service_rsfum6t", "template_51374aw", this)
        .then(function(response) {
            alert("Message sent successfully!");
        }, function(error) {
            alert("Failed to send message. Please try again.");
            console.error("EmailJS error:", error);
        });

    event.target.reset();
});

