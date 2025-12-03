// Language switching functionality
class LanguageManager {
    constructor() {
        this.currentLang = 'en';
        this.elements = document.querySelectorAll('[data-en], [data-ru]');
        this.init();
    }

    init() {
        // Add event listeners to language buttons
        document.getElementById('lang-en').addEventListener('click', () => this.switchLanguage('en'));
        document.getElementById('lang-ru').addEventListener('click', () => this.switchLanguage('ru'));

        // Set initial language
        this.updateLanguage();
    }

    switchLanguage(lang) {
        this.currentLang = lang;
        
        // Update active button
        document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`lang-${lang}`).classList.add('active');
        
        // Update all text elements
        this.updateLanguage();
        
        // Save preference
        localStorage.setItem('shastra-language', lang);
    }

    updateLanguage() {
        this.elements.forEach(element => {
            const text = element.getAttribute(`data-${this.currentLang}`);
            if (text) {
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    element.placeholder = text;
                } else {
                    element.textContent = text;
                }
            }
        });
    }
}

// Background animations
class BackgroundAnimations {
    constructor() {
        this.canvas = document.getElementById('radarCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particlesContainer = document.getElementById('particles');
        this.init();
    }

    init() {
        this.setupCanvas();
        this.createParticles();
        this.animate();
        
        // Handle window resize
        window.addEventListener('resize', () => this.setupCanvas());
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        // Create floating particles
        for (let i = 0; i < 50; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation delay
        const left = Math.random() * 100;
        const delay = Math.random() * 6;
        const duration = 4 + Math.random() * 4;
        
        particle.style.left = `${left}vw`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        this.particlesContainer.appendChild(particle);
        
        // Remove particle after animation and create new one
        setTimeout(() => {
            particle.remove();
            this.createParticle();
        }, (delay + duration) * 1000);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw grid lines
        this.drawGrid();
        
        // Draw radar circles
        this.drawRadarCircles();
        
        // Draw sweep line
        this.drawSweepLine();
        
        requestAnimationFrame(() => this.animate());
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.1)';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x < this.canvas.width; x += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y < this.canvas.height; y += 50) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    drawRadarCircles() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const maxRadius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        this.ctx.lineWidth = 2;
        
        for (let i = 1; i <= 4; i++) {
            const radius = (maxRadius / 4) * i;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }

    drawSweepLine() {
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(this.canvas.width, this.canvas.height) * 0.4;
        
        const now = Date.now() / 1000;
        const angle = (now * 0.5) % (Math.PI * 2);
        
        this.ctx.strokeStyle = 'rgba(0, 255, 0, 0.8)';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.lineTo(
            centerX + Math.cos(angle) * radius,
            centerY + Math.sin(angle) * radius
        );
        this.ctx.stroke();
        
        // Draw sweep effect
        const gradient = this.ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, radius
        );
        gradient.addColorStop(0, 'rgba(0, 255, 0, 0.1)');
        gradient.addColorStop(1, 'rgba(0, 255, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY);
        this.ctx.arc(centerX, centerY, radius, angle - 0.2, angle + 0.2);
        this.ctx.closePath();
        this.ctx.fill();
    }
}

// Interactive Demo
class InteractiveDemo {
    constructor() {
        this.soldier = document.getElementById('soldier');
        this.bullet = document.getElementById('bullet');
        this.radarTracking = document.getElementById('radar-tracking');
        this.detectionAlert = document.getElementById('detection-alert');
        this.startBtn = document.getElementById('start-demo');
        this.resetBtn = document.getElementById('reset-demo');
        
        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.startDemo());
        this.resetBtn.addEventListener('click', () => this.resetDemo());
    }

    startDemo() {
        this.resetDemo();
        
        // Soldier aims
        this.soldier.style.transform = 'translateX(20px) rotate(-5deg)';
        
        setTimeout(() => {
            // Soldier fires
            this.soldier.style.transform = 'translateX(20px) rotate(5deg)';
            this.bullet.style.opacity = '1';
            
            // Bullet travels
            this.animateBullet();
            
        }, 1000);
    }

    animateBullet() {
        const bullet = this.bullet;
        let position = 120;
        const interval = setInterval(() => {
            position += 20;
            bullet.style.left = `${position}px`;
            
            if (position > 600) {
                clearInterval(interval);
                this.showRadarDetection();
            }
        }, 50);
    }

    showRadarDetection() {
        // Show radar tracking
        this.radarTracking.style.opacity = '1';
        
        // Show detection alert
        setTimeout(() => {
            this.detectionAlert.style.opacity = '1';
        }, 1000);
        
        // Hide radar after pulse
        setTimeout(() => {
            this.radarTracking.style.opacity = '0';
        }, 3000);
    }

    resetDemo() {
        this.soldier.style.transform = 'none';
        this.bullet.style.opacity = '0';
        this.bullet.style.left = '120px';
        this.radarTracking.style.opacity = '0';
        this.detectionAlert.style.opacity = '0';
    }
}

// Scroll animations
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.setupScrollEffects();
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, this.observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.feature, .tech-card, .stat-item').forEach(el => {
            observer.observe(el);
        });
    }

    setupScrollEffects() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const scrolled = scrollY > 100;
            
            // Navbar background on scroll
            document.querySelector('.navbar').style.background = scrolled 
                ? 'rgba(10, 15, 20, 0.98)' 
                : 'rgba(10, 15, 20, 0.95)';
            
            // Parallax effect for hero elements
            const hero = document.querySelector('.hero');
            if (hero) {
                const scrolled = window.scrollY;
                const parallax = scrolled * 0.5;
                hero.style.transform = `translateY(${parallax}px)`;
            }
            
            lastScrollY = scrollY;
        });
    }
}

// Navigation functionality
class Navigation {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                this.scrollToSection(targetId);
                this.closeMenu();
            });
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
    }

    scrollToSection(sectionId) {
        const targetSection = document.querySelector(sectionId);
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new LanguageManager();
    new BackgroundAnimations();
    new InteractiveDemo();
    new ScrollAnimations();
    new Navigation();

    // Load saved language preference
    const savedLang = localStorage.getItem('shastra-language');
    if (savedLang) {
        document.querySelector(`#lang-${savedLang}`)?.click();
    }

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .feature, .tech-card, .stat-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .feature.animate-in, .tech-card.animate-in, .stat-item.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .hamburger.active .bar:nth-child(2) { opacity: 0; }
        .hamburger.active .bar:nth-child(1) { transform: translateY(8px) rotate(45deg); }
        .hamburger.active .bar:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }
        
        @media (max-width: 768px) {
            .nav-menu {
                position: fixed;
                left: -100%;
                top: 70px;
                flex-direction: column;
                background: var(--bg-dark);
                width: 100%;
                text-align: center;
                transition: 0.3s;
                box-shadow: 0 10px 27px rgba(0,0,0,0.05);
                padding: 2rem 0;
            }
            
            .nav-menu.active { left: 0; }
        }
    `;
    document.head.appendChild(style);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form submission
document.querySelector('.contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});