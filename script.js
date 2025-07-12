// MindIgnite - Interactive Neuroscience Learning Platform
class MindIgnite {
    constructor() {
        this.currentPage = 'home';
        this.isLoggedIn = false;
        this.inactiveTimer = null;
        this.lastActivity = Date.now();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeBrainAnimation();
        this.setupScrollAnimations();
        this.setupCarousel();
        this.setupLeaderboard();
        this.startInactiveTimer();
        this.hideLoadingScreen();
    }

    setupEventListeners() {
        // Navigation
        document.getElementById('nav-toggle').addEventListener('click', () => this.toggleSidebar());
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.dataset.page;
                this.navigateToPage(page);
            });
        });

        // CTA Button
        document.getElementById('cta-button').addEventListener('click', () => {
            this.showModal('signup-modal');
        });

        // Info Cards
        document.querySelectorAll('.info-card').forEach(card => {
            card.addEventListener('click', () => this.toggleSubcategories(card));
        });

        // Carousel Cards
        document.querySelectorAll('.carousel-card').forEach(card => {
            card.addEventListener('click', () => this.toggleCarouselSubcategories(card));
        });

        // Modals
        document.querySelectorAll('.close').forEach(close => {
            close.addEventListener('click', () => this.hideAllModals());
        });

        document.getElementById('show-signup').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('login-modal');
            this.showModal('signup-modal');
        });

        document.getElementById('show-login').addEventListener('click', (e) => {
            e.preventDefault();
            this.hideModal('signup-modal');
            this.showModal('login-modal');
        });

        // Forms
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('signup-form').addEventListener('submit', (e) => this.handleSignup(e));

        // Password toggles
        document.querySelectorAll('.password-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => this.togglePassword(e));
        });

        // Inactive prompt
        document.getElementById('prompt-signup').addEventListener('click', () => {
            this.hideModal('inactive-prompt');
            this.showModal('signup-modal');
        });

        document.getElementById('prompt-login').addEventListener('click', () => {
            this.hideModal('inactive-prompt');
            this.showModal('login-modal');
        });

        // Activity tracking
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, () => this.resetInactiveTimer());
        });

        // Click outside modals to close
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });
    }

    initializeBrainAnimation() {
        const brainSvg = document.getElementById('brain-svg');
        let rotation = 0;

        // Mouse interaction for brain rotation
        document.addEventListener('mousemove', (e) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const deltaX = mouseX - centerX;
            const deltaY = mouseY - centerY;
            
            rotation = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
            
            brainSvg.style.transform = `rotate(${rotation}deg)`;
        });

        // Scroll-based brain animation
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            brainSvg.style.transform = `translateY(${rate}px) rotate(${rotation}deg)`;
        });

        // Add flame gradient to SVG
        const defs = brainSvg.querySelector('defs');
        const flameGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
        flameGradient.setAttribute('id', 'flameGradient');
        flameGradient.innerHTML = `
            <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#ff8e53;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#ff6b6b;stop-opacity:1" />
        `;
        defs.appendChild(flameGradient);

        // Add glow filter
        const glowFilter = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
        glowFilter.setAttribute('id', 'glow');
        glowFilter.innerHTML = `
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        `;
        defs.appendChild(glowFilter);
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe info cards
        document.querySelectorAll('.info-card').forEach(card => {
            observer.observe(card);
        });

        // Observe subject cards
        document.querySelectorAll('.subject-card').forEach(card => {
            observer.observe(card);
        });
    }

    setupCarousel() {
        const track = document.querySelector('.carousel-track');
        let isDown = false;
        let startX;
        let scrollLeft;

        track.addEventListener('mousedown', (e) => {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', () => {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });

        // Touch support for mobile
        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('touchmove', (e) => {
            if (!startX) return;
            const x = e.touches[0].pageX - track.offsetLeft;
            const walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });

        track.addEventListener('touchend', () => {
            startX = null;
        });
    }

    setupLeaderboard() {
        const leaderboard = document.getElementById('leaderboard');
        const mockData = [
            { name: 'Dr. Sarah Chen', score: 98, subject: 'Quantum Physics' },
            { name: 'Alex Rodriguez', score: 95, subject: 'Neural Networks' },
            { name: 'Emma Thompson', score: 93, subject: 'Advanced Calculus' },
            { name: 'Marcus Johnson', score: 91, subject: 'Biochemistry' },
            { name: 'Lisa Park', score: 89, subject: 'Machine Learning' }
        ];

        mockData.forEach((user, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry glass-card p-4 flex items-center justify-between';
            entry.innerHTML = `
                <div class="flex items-center">
                    <div class="rank ${index < 3 ? 'medal' : ''} mr-4 text-2xl font-bold">
                        ${index < 3 ? ['🥇', '🥈', '🥉'][index] : `#${index + 1}`}
                    </div>
                    <div>
                        <div class="text-white font-semibold">${user.name}</div>
                        <div class="text-purple-200 text-sm">${user.subject}</div>
                    </div>
                </div>
                <div class="text-2xl font-bold text-ff6b6b">${user.score}%</div>
            `;
            leaderboard.appendChild(entry);
        });
    }

    toggleSubcategories(card) {
        const quote = card.querySelector('.quote');
        const subcategories = card.querySelector('.subcategories');
        
        if (subcategories.classList.contains('hidden')) {
            quote.style.opacity = '0';
            quote.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                quote.style.display = 'none';
                subcategories.classList.remove('hidden');
                subcategories.style.display = 'grid';
            }, 300);
        } else {
            subcategories.classList.add('hidden');
            subcategories.style.display = 'none';
            quote.style.display = 'block';
            setTimeout(() => {
                quote.style.opacity = '1';
                quote.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    toggleCarouselSubcategories(card) {
        const quote = card.querySelector('.carousel-quote');
        const subcategories = card.querySelector('.carousel-subcategories');
        
        if (subcategories.classList.contains('hidden')) {
            quote.style.opacity = '0';
            quote.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                quote.style.display = 'none';
                subcategories.classList.remove('hidden');
                subcategories.style.display = 'grid';
            }, 300);
        } else {
            subcategories.classList.add('hidden');
            subcategories.style.display = 'none';
            quote.style.display = 'block';
            setTimeout(() => {
                quote.style.opacity = '1';
                quote.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const hamburger = document.querySelector('.hamburger');
        
        sidebar.classList.toggle('open');
        hamburger.classList.toggle('active');
    }

    navigateToPage(page) {
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        const newPageElement = document.getElementById(`${page}-page`);
        
        if (currentPageElement && newPageElement) {
            currentPageElement.classList.remove('active');
            currentPageElement.classList.add('slide-out');
            
            setTimeout(() => {
                currentPageElement.classList.add('hidden');
                newPageElement.classList.remove('hidden');
                newPageElement.classList.add('active');
                
                setTimeout(() => {
                    currentPageElement.classList.remove('slide-out');
                }, 500);
            }, 250);
            
            this.currentPage = page;
        }
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.toggleSidebar();
        }
    }

    showModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('hidden');
        setTimeout(() => modal.classList.add('show'), 10);
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.remove('show');
        setTimeout(() => modal.classList.add('hidden'), 300);
    }

    hideAllModals() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('show');
            setTimeout(() => modal.classList.add('hidden'), 300);
        });
    }

    togglePassword(e) {
        const input = e.target.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        e.target.textContent = type === 'password' ? '👁️' : '🙈';
    }

    handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
        
        // Simulate login
        console.log('Login attempt:', { email, password });
        
        // Show success animation
        this.showSuccessMessage('Login successful! Welcome back to MindIgnite.');
        this.hideModal('login-modal');
        this.isLoggedIn = true;
    }

    handleSignup(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
        const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
        const password = formData.get('password') || e.target.querySelectorAll('input[type="password"]')[0].value;
        const confirmPassword = formData.get('confirmPassword') || e.target.querySelectorAll('input[type="password"]')[1].value;
        
        if (password !== confirmPassword) {
            this.showErrorMessage('Passwords do not match!');
            return;
        }
        
        // Simulate signup
        console.log('Signup attempt:', { name, email, password });
        
        // Show success animation
        this.showSuccessMessage('Account created successfully! Welcome to MindIgnite.');
        this.hideModal('signup-modal');
        this.isLoggedIn = true;
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.remove('translate-x-full'), 100);
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }

    startInactiveTimer() {
        this.inactiveTimer = setInterval(() => {
            const timeSinceLastActivity = Date.now() - this.lastActivity;
            if (timeSinceLastActivity > 120000 && !this.isLoggedIn) { // 2 minutes
                this.showInactivePrompt();
            }
        }, 10000); // Check every 10 seconds
    }

    resetInactiveTimer() {
        this.lastActivity = Date.now();
        this.hideInactivePrompt();
    }

    showInactivePrompt() {
        const prompt = document.getElementById('inactive-prompt');
        prompt.classList.remove('hidden');
        setTimeout(() => prompt.classList.add('show'), 100);
    }

    hideInactivePrompt() {
        const prompt = document.getElementById('inactive-prompt');
        prompt.classList.remove('show');
        setTimeout(() => prompt.classList.add('hidden'), 500);
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.style.opacity = '0';
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 2000);
    }

    // Advanced animations and effects
    createParticleEffect(x, y) {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 4px;
                height: 4px;
                background: linear-gradient(135deg, #ff6b6b, #a855f7);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: particleFloat 1s ease-out forwards;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                document.body.removeChild(particle);
            }, 1000);
        }
    }

    // Add particle animation CSS
    addParticleStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes particleFloat {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) scale(0);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const mindIgnite = new MindIgnite();
    
    // Add particle effect on click
    document.addEventListener('click', (e) => {
        mindIgnite.createParticleEffect(e.clientX, e.clientY);
    });
    
    // Add particle styles
    mindIgnite.addParticleStyles();
    
    // Make it globally accessible for debugging
    window.mindIgnite = mindIgnite;
});

// Additional utility functions
const Utils = {
    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Debounce function for performance
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Generate random color
    randomColor: () => {
        const colors = ['#ff6b6b', '#a855f7', '#6366f1', '#06b6d4', '#10b981'];
        return colors[Math.floor(Math.random() * colors.length)];
    },

    // Create ripple effect
    createRipple: (event) => {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
};

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', Utils.createRipple);
    });
});

// Add ripple animation CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Performance optimizations
const optimizedScrollHandler = Utils.throttle(() => {
    // Handle scroll-based animations
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
        const speed = element.dataset.speed || 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Intersection Observer for lazy loading
const lazyLoadObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            lazyLoadObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1
});

// Observe elements for lazy loading
document.addEventListener('DOMContentLoaded', () => {
    const lazyElements = document.querySelectorAll('.lazy-load');
    lazyElements.forEach(element => {
        lazyLoadObserver.observe(element);
    });
});