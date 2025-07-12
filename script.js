// MindIgnite - Interactive JavaScript
class MindIgnite {
    constructor() {
        this.currentPage = 'home';
        this.sidebarOpen = false;
        this.carouselPosition = 0;
        this.autoPopupTimer = null;
        this.lastActivityTime = Date.now();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initScrollAnimations();
        this.initCarousel();
        this.initBrainAnimations();
        this.initAutoPopup();
        this.initProgressBars();
        this.trackUserActivity();
    }

    setupEventListeners() {
        // Hamburger menu toggle
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const sidebarOverlay = document.getElementById('sidebar-overlay');

        hamburger.addEventListener('click', () => this.toggleSidebar());
        sidebarOverlay.addEventListener('click', () => this.closeSidebar());

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
            });
        });

        // Modal controls
        const loginBtn = document.getElementById('login-btn');
        const signupBtn = document.getElementById('signup-btn');
        const loginModal = document.getElementById('login-modal');
        const signupModal = document.getElementById('signup-modal');
        const closeButtons = document.querySelectorAll('.close');

        loginBtn.addEventListener('click', () => this.openModal('login'));
        signupBtn.addEventListener('click', () => this.openModal('signup'));

        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => this.closeModal());
        });

        // Modal background click to close
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Password toggle
        const passwordToggles = document.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.togglePassword(toggle));
        });

        // Info card interactions
        const infoCards = document.querySelectorAll('.info-card');
        infoCards.forEach(card => {
            card.addEventListener('click', () => this.handleInfoCardClick(card));
        });

        // Carousel card interactions
        const carouselCards = document.querySelectorAll('.carousel-card');
        carouselCards.forEach(card => {
            card.addEventListener('click', () => this.handleCarouselCardClick(card));
        });

        // Auto popup controls
        const popupRegister = document.getElementById('popup-register');
        const popupClose = document.getElementById('popup-close');
        const autoPopup = document.getElementById('auto-popup');

        popupRegister.addEventListener('click', () => {
            this.hideAutoPopup();
            this.openModal('signup');
        });

        popupClose.addEventListener('click', () => this.hideAutoPopup());

        // Form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        });

        // Scroll-based brain rotation
        window.addEventListener('scroll', () => this.handleScroll());
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        if (this.sidebarOpen) {
            hamburger.classList.add('active');
            sidebar.classList.add('active');
            overlay.classList.add('active');
        } else {
            hamburger.classList.remove('active');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    }

    closeSidebar() {
        this.sidebarOpen = false;
        const hamburger = document.getElementById('hamburger');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebar-overlay');

        hamburger.classList.remove('active');
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    }

    navigateToPage(page) {
        if (page === this.currentPage) return;

        // Hide current page
        const currentPageEl = document.getElementById(`page-${this.currentPage}`);
        if (currentPageEl) {
            currentPageEl.classList.remove('active');
        }

        // Show new page
        const newPageEl = document.getElementById(`page-${page}`);
        if (newPageEl) {
            setTimeout(() => {
                newPageEl.classList.add('active');
                this.currentPage = page;
                this.closeSidebar();
                this.animatePageElements(page);
            }, 300);
        }
    }

    animatePageElements(page) {
        const pageEl = document.getElementById(`page-${page}`);
        if (!pageEl) return;

        const animatedElements = pageEl.querySelectorAll('.info-card, .subject-detail-card, .leaderboard-item, .carousel-card');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('fade-in-up');
            }, index * 100);
        });

        if (page === 'profile') {
            this.animateProgressBars();
        }
    }

    openModal(type) {
        const modal = document.getElementById(`${type}-modal`);
        if (modal) {
            modal.classList.add('active');
            modal.style.display = 'flex';
            
            // Add entrance animation
            const modalContent = modal.querySelector('.modal-content');
            modalContent.style.animation = 'modalSlide 0.3s ease';
        }
    }

    closeModal() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            modal.classList.remove('active');
            modal.style.display = 'none';
        });
    }

    togglePassword(toggleBtn) {
        const input = toggleBtn.previousElementSibling;
        const type = input.type === 'password' ? 'text' : 'password';
        input.type = type;
        toggleBtn.textContent = type === 'password' ? '👁' : '🙈';
        
        // Add ripple effect
        this.createRipple(toggleBtn);
    }

    handleInfoCardClick(card) {
        const quote = card.querySelector('.quote');
        const buttons = card.querySelector('.subject-buttons');
        
        if (!card.classList.contains('clicked')) {
            card.classList.add('clicked');
            
            setTimeout(() => {
                quote.classList.add('invisible');
                buttons.classList.remove('hidden');
                
                // Animate buttons
                const subjectBtns = buttons.querySelectorAll('.subject-btn');
                subjectBtns.forEach((btn, index) => {
                    setTimeout(() => {
                        btn.style.animation = `buttonRise 0.5s ease ${index * 0.1}s forwards`;
                    }, 100);
                });
            }, 300);
        }
    }

    handleCarouselCardClick(card) {
        const subject = card.getAttribute('data-subject');
        console.log(`Navigating to ${subject} subject`);
        
        // Add click animation
        card.style.transform = 'scale(0.95)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
        
        // Future: Navigate to subject-specific page
        this.createRipple(card);
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, observerOptions);

        // Observe all animatable elements
        const animatableElements = document.querySelectorAll('.info-card, .subject-detail-card, .carousel-card');
        animatableElements.forEach(el => observer.observe(el));
    }

    initCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const carouselCards = document.querySelectorAll('.carousel-card');
        
        if (!carouselTrack || carouselCards.length === 0) return;

        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let startScrollLeft = 0;

        // Mouse events
        carouselTrack.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startScrollLeft = carouselTrack.scrollLeft;
            carouselTrack.style.cursor = 'grabbing';
        });

        carouselTrack.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            
            const deltaX = e.clientX - startX;
            const newTransform = `translateX(${this.carouselPosition - deltaX}px)`;
            carouselTrack.style.transform = newTransform;
        });

        carouselTrack.addEventListener('mouseup', () => {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
        });

        carouselTrack.addEventListener('mouseleave', () => {
            isDragging = false;
            carouselTrack.style.cursor = 'grab';
        });

        // Touch events
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startScrollLeft = carouselTrack.scrollLeft;
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            const deltaX = e.touches[0].clientX - startX;
            const newTransform = `translateX(${this.carouselPosition - deltaX}px)`;
            carouselTrack.style.transform = newTransform;
        });

        carouselTrack.addEventListener('touchend', () => {
            startX = 0;
        });

        // Auto-scroll carousel
        setInterval(() => {
            this.autoScrollCarousel();
        }, 5000);
    }

    autoScrollCarousel() {
        const carouselTrack = document.querySelector('.carousel-track');
        const carouselCards = document.querySelectorAll('.carousel-card');
        
        if (!carouselTrack || carouselCards.length === 0) return;

        const cardWidth = carouselCards[0].offsetWidth + 32; // 32px for gap
        const maxPosition = -(cardWidth * (carouselCards.length - 1));
        
        this.carouselPosition -= cardWidth;
        
        if (this.carouselPosition < maxPosition) {
            this.carouselPosition = 0;
        }
        
        carouselTrack.style.transform = `translateX(${this.carouselPosition}px)`;
    }

    initBrainAnimations() {
        const brainSvg = document.getElementById('brain-svg');
        const neurons = document.querySelectorAll('.neuron');
        const synapses = document.querySelectorAll('.synapse');
        
        if (!brainSvg) return;

        // Enhanced brain rotation on scroll
        let brainRotation = 0;
        
        // Mouse interaction
        brainSvg.addEventListener('mouseenter', () => {
            brainSvg.style.animationPlayState = 'paused';
        });
        
        brainSvg.addEventListener('mouseleave', () => {
            brainSvg.style.animationPlayState = 'running';
        });

        // Create neural activity bursts
        setInterval(() => {
            this.createNeuralBurst();
        }, 2000);
    }

    createNeuralBurst() {
        const neurons = document.querySelectorAll('.neuron');
        const synapses = document.querySelectorAll('.synapse');
        
        // Random neuron activation
        const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
        const randomSynapse = synapses[Math.floor(Math.random() * synapses.length)];
        
        if (randomNeuron) {
            randomNeuron.style.animation = 'neuronPulse 0.5s ease-in-out';
            setTimeout(() => {
                randomNeuron.style.animation = 'neuronPulse 1.5s ease-in-out infinite';
            }, 500);
        }
        
        if (randomSynapse) {
            randomSynapse.style.animation = 'synapseFlow 0.8s ease-in-out';
            setTimeout(() => {
                randomSynapse.style.animation = 'synapseFlow 2s ease-in-out infinite';
            }, 800);
        }
    }

    initAutoPopup() {
        this.autoPopupTimer = setTimeout(() => {
            this.showAutoPopup();
        }, 120000); // 2 minutes
    }

    showAutoPopup() {
        const autoPopup = document.getElementById('auto-popup');
        if (autoPopup) {
            autoPopup.classList.add('show');
            
            // Add glow effect
            autoPopup.style.boxShadow = '0 0 30px rgba(139, 92, 246, 0.6)';
        }
    }

    hideAutoPopup() {
        const autoPopup = document.getElementById('auto-popup');
        if (autoPopup) {
            autoPopup.classList.remove('show');
            
            // Reset timer
            clearTimeout(this.autoPopupTimer);
            this.autoPopupTimer = setTimeout(() => {
                this.showAutoPopup();
            }, 120000);
        }
    }

    trackUserActivity() {
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
        
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivityTime = Date.now();
            }, true);
        });
    }

    initProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const progress = progressBar.getAttribute('data-progress');
                    progressBar.style.width = progress + '%';
                }
            });
        });

        progressBars.forEach(bar => observer.observe(bar));
    }

    animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress-fill');
        
        progressBars.forEach((bar, index) => {
            setTimeout(() => {
                const progress = bar.getAttribute('data-progress');
                bar.style.width = progress + '%';
                
                // Add completion celebration
                setTimeout(() => {
                    if (parseInt(progress) > 90) {
                        this.createCelebration(bar);
                    }
                }, 1000);
            }, index * 200);
        });
    }

    createCelebration(element) {
        const celebration = document.createElement('div');
        celebration.style.position = 'absolute';
        celebration.style.top = '50%';
        celebration.style.left = '100%';
        celebration.style.transform = 'translateY(-50%)';
        celebration.style.fontSize = '1.5rem';
        celebration.textContent = '🎉';
        celebration.style.animation = 'float 1s ease-in-out';
        celebration.style.pointerEvents = 'none';
        
        element.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 1000);
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        const brainSvg = document.getElementById('brain-svg');
        
        if (brainSvg) {
            const rotation = scrolled * 0.1;
            brainSvg.style.transform = `rotate(${rotation}deg)`;
        }
        
        // Parallax effect for spinal cord
        const spinalCord = document.querySelector('.spinal-cord');
        if (spinalCord) {
            const parallaxSpeed = scrolled * 0.05;
            spinalCord.style.transform = `translateY(${parallaxSpeed}px)`;
        }
    }

    handleMouseMove(e) {
        const brainSvg = document.getElementById('brain-svg');
        if (!brainSvg) return;
        
        const rect = brainSvg.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        const tiltX = deltaY / 10;
        const tiltY = deltaX / 10;
        
        brainSvg.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }

    handleKeyPress(e) {
        // Escape key closes modals and sidebar
        if (e.key === 'Escape') {
            this.closeModal();
            this.closeSidebar();
        }
        
        // Arrow keys for carousel navigation
        if (e.key === 'ArrowLeft') {
            this.navigateCarousel('prev');
        }
        if (e.key === 'ArrowRight') {
            this.navigateCarousel('next');
        }
    }

    navigateCarousel(direction) {
        const carouselTrack = document.querySelector('.carousel-track');
        const carouselCards = document.querySelectorAll('.carousel-card');
        
        if (!carouselTrack || carouselCards.length === 0) return;
        
        const cardWidth = carouselCards[0].offsetWidth + 32;
        
        if (direction === 'next') {
            const maxPosition = -(cardWidth * (carouselCards.length - 1));
            this.carouselPosition = Math.max(this.carouselPosition - cardWidth, maxPosition);
        } else {
            this.carouselPosition = Math.min(this.carouselPosition + cardWidth, 0);
        }
        
        carouselTrack.style.transform = `translateX(${this.carouselPosition}px)`;
    }

    handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Add loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Processing...';
        submitBtn.classList.add('loading');
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.classList.remove('loading');
            this.closeModal();
            this.showSuccessMessage();
        }, 2000);
    }

    showSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Neural connection established successfully!';
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(16, 185, 129, 0.9);
            color: white;
            padding: 1rem 2rem;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            z-index: 1001;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    createRipple(element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            width: ${size}px;
            height: ${size}px;
            left: ${rect.width / 2 - size / 2}px;
            top: ${rect.height / 2 - size / 2}px;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // Advanced features
    initAdvancedFeatures() {
        this.initVoiceRecognition();
        this.initThemeToggle();
        this.initOfflineMode();
        this.initAnalytics();
    }

    initVoiceRecognition() {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.handleVoiceCommand(command);
            };
            
            // Add voice activation button
            const voiceBtn = document.createElement('button');
            voiceBtn.innerHTML = '🎤';
            voiceBtn.className = 'voice-btn';
            voiceBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                background: rgba(139, 92, 246, 0.8);
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                z-index: 1000;
                backdrop-filter: blur(10px);
                transition: all 0.3s ease;
            `;
            
            voiceBtn.addEventListener('click', () => {
                recognition.start();
                voiceBtn.style.background = 'rgba(236, 72, 153, 0.8)';
            });
            
            recognition.onend = () => {
                voiceBtn.style.background = 'rgba(139, 92, 246, 0.8)';
            };
            
            document.body.appendChild(voiceBtn);
        }
    }

    handleVoiceCommand(command) {
        if (command.includes('home')) {
            this.navigateToPage('home');
        } else if (command.includes('subjects')) {
            this.navigateToPage('subjects');
        } else if (command.includes('profile')) {
            this.navigateToPage('profile');
        } else if (command.includes('login')) {
            this.openModal('login');
        } else if (command.includes('register') || command.includes('sign up')) {
            this.openModal('signup');
        }
    }

    initThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '🌙';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            z-index: 1000;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        `;
        
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
        });
        
        document.body.appendChild(themeToggle);
    }

    initOfflineMode() {
        window.addEventListener('online', () => {
            this.showStatusMessage('Connection restored', 'success');
        });
        
        window.addEventListener('offline', () => {
            this.showStatusMessage('Offline mode activated', 'warning');
        });
    }

    showStatusMessage(message, type) {
        const statusDiv = document.createElement('div');
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type}`;
        statusDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            z-index: 1001;
            animation: slideIn 0.3s ease;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        if (type === 'success') {
            statusDiv.style.background = 'rgba(16, 185, 129, 0.9)';
        } else if (type === 'warning') {
            statusDiv.style.background = 'rgba(245, 158, 11, 0.9)';
        }
        
        document.body.appendChild(statusDiv);
        
        setTimeout(() => {
            statusDiv.remove();
        }, 3000);
    }

    initAnalytics() {
        // Track page views
        const originalNavigate = this.navigateToPage;
        this.navigateToPage = function(page) {
            console.log(`Analytics: Navigated to ${page}`);
            return originalNavigate.call(this, page);
        };
        
        // Track user engagement
        let engagementScore = 0;
        document.addEventListener('click', () => {
            engagementScore++;
            if (engagementScore % 10 === 0) {
                console.log(`Engagement score: ${engagementScore}`);
            }
        });
    }
}

// CSS animations for dynamic effects
const dynamicStyles = document.createElement('style');
dynamicStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .success-message {
        animation: slideIn 0.3s ease;
    }
    
    .dark-theme {
        filter: invert(1) hue-rotate(180deg);
    }
    
    .dark-theme img,
    .dark-theme video,
    .dark-theme svg {
        filter: invert(1) hue-rotate(180deg);
    }
`;

document.head.appendChild(dynamicStyles);

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new MindIgnite();
    
    // Performance optimization
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(console.error);
    }
    
    // Preload critical resources
    const preloadLinks = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
    ];
    
    preloadLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = href;
        link.as = 'style';
        document.head.appendChild(link);
    });
    
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.id = 'loading-screen';
    loadingScreen.innerHTML = `
        <div class="loading-content">
            <div class="brain-loader">🧠</div>
            <h2>Initializing Neural Network...</h2>
            <div class="loading-bar">
                <div class="loading-progress"></div>
            </div>
        </div>
    `;
    loadingScreen.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        color: white;
        text-align: center;
        transition: opacity 0.5s ease;
    `;
    
    document.body.appendChild(loadingScreen);
    
    // Hide loading screen after initialization
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MindIgnite;
}