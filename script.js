// ===== MOBILE MENU FUNCTIONALITY =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    let isMenuOpen = false;
    
    function openMenu() {
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = getScrollbarWidth() + 'px';
        isMenuOpen = true;
        
        // Add animation delay for menu items
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.style.opacity = '0';
            link.style.transform = 'translateY(-20px)';
            link.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            
            setTimeout(() => {
                link.style.opacity = '1';
                link.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
    
    function closeMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        isMenuOpen = false;
        
        // Reset menu items animation
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.opacity = '';
            link.style.transform = '';
            link.style.transition = '';
        });
    }
    
    function getScrollbarWidth() {
        return window.innerWidth - document.documentElement.clientWidth;
    }
    
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });
    
    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Close mobile menu on window resize (if menu is open and screen becomes larger)
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767 && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Prevent menu from closing when clicking inside it
    navMenu.addEventListener('click', (e) => {
        e.stopPropagation();
    });
}

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== ACTIVE NAVIGATION STATES =====
function updateActiveNavLink() {
    // Only manage in-page anchor links; do not touch page-to-page links
    const sections = document.querySelectorAll('section[id]');
    const navAnchorLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (navAnchorLinks.length === 0 || sections.length === 0) return;

    let currentSection = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navAnchorLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'true');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

// Highlight current page in navbar based on URL path
function setActiveNavByPath() {
    const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const navLinks = document.querySelectorAll('.nav-link');

    // Only non-anchor links
    const pageLinks = Array.from(navLinks).filter(l => {
        const href = l.getAttribute('href') || '';
        return href && !href.startsWith('#');
    });

    // Clear existing active on page links
    pageLinks.forEach(l => l.classList.remove('active'));

    // Find best match
    let matched = false;
    pageLinks.forEach(link => {
        const href = (link.getAttribute('href') || '').toLowerCase();
        const file = href.split('/').pop();
        if (file === path || (path === '' && (file === '' || file === 'index.html'))) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            matched = true;
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // If nothing matched and we're on root, try index.html
    if (!matched && (path === '' || path === '/')) {
        const indexLink = Array.from(pageLinks).find(l => (l.getAttribute('href') || '').toLowerCase().endsWith('index.html'));
        if (indexLink) {
            indexLink.classList.add('active');
            indexLink.setAttribute('aria-current', 'page');
        }
    }
}

// Update active nav link on scroll (own throttle)
let tickingActiveNav = false;
window.addEventListener('scroll', () => {
    if (!tickingActiveNav) {
        requestAnimationFrame(() => {
            updateActiveNavLink();
            tickingActiveNav = false;
        });
        tickingActiveNav = true;
    }
});

// Set initial active state
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavByPath();
    updateActiveNavLink();
});

// ===== NAVBAR SCROLL EFFECT =====
let lastScrollTop = 0;
let tickingNavbar = false;
const navbar = document.querySelector('.navbar');
const header = document.querySelector('.header');

function updateNavbar() {
    if (!navbar) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const isMobile = window.innerWidth <= 1199;
    
    if (scrollTop > 100) {
        navbar.classList.add('scrolled');
        navbar.style.background = 'rgba(17, 17, 17, 0.98)';
        navbar.style.backdropFilter = 'blur(25px)';
        navbar.style.webkitBackdropFilter = 'blur(25px)';
        navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.15)';
    } else {
        navbar.classList.remove('scrolled');
        navbar.style.background = 'rgba(17, 17, 17, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
        navbar.style.webkitBackdropFilter = 'blur(20px)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        navbar.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    }
    
    // Hide/show navbar and header on scroll (only on desktop)
    if (!isMobile) {
        const scrollThreshold = 200;
        const scrollDifference = scrollTop - lastScrollTop;
        
        if (scrollTop > scrollThreshold && Math.abs(scrollDifference) > 5) {
            if (scrollDifference > 0) {
                // Scrolling down - hide navbar and header
                navbar.classList.add('hidden');
                if (header) {
                    header.classList.add('hidden');
                }
            } else {
                // Scrolling up - show navbar and header
                navbar.classList.remove('hidden');
                if (header) {
                    header.classList.remove('hidden');
                }
            }
        } else if (scrollTop <= scrollThreshold) {
            // Near top - always show
            navbar.classList.remove('hidden');
            if (header) {
                header.classList.remove('hidden');
            }
        }
    } else {
        // On mobile - always show
        navbar.classList.remove('hidden');
        if (header) {
            header.classList.remove('hidden');
        }
    }
    
    lastScrollTop = scrollTop;
    tickingNavbar = false;
}

// Throttled scroll handler for navbar effect
function throttledNavbarScrollHandler() {
    if (!navbar) return;
    if (!tickingNavbar) {
        requestAnimationFrame(updateNavbar);
        tickingNavbar = true;
    }
}

// Add scroll event listener for navbar effect
window.addEventListener('scroll', throttledNavbarScrollHandler);

// Initialize navbar on page load
document.addEventListener('DOMContentLoaded', () => {
    if (navbar) {
        navbar.classList.remove('hidden');
        if (header) {
            header.classList.remove('hidden');
        }
    }
});

// Reset navbar position on window resize (handled below)

// Reset navbar and header position on window resize
if (navbar) {
    window.addEventListener('resize', () => {
        navbar.classList.remove('hidden');
        if (header) {
            header.classList.remove('hidden');
        }
        // Reset scroll tracking
        lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
    });
}

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// ===== INITIALIZE ANIMATIONS =====
document.addEventListener('DOMContentLoaded', () => {
    // Animate elements on load
    const animatedElements = document.querySelectorAll(
        '.overview-card, .advantage-item, .detail-card, .contact-card-new, ' +
        '.principle-card, .leadership-card, .document-item-new, .service-card, ' +
        '.value-card, .feature, .advantage-card, .detail-item'
    );
    
    animatedElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        el.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(el);
    });

    // Animate hero elements
    const heroElements = document.querySelectorAll('.hero-badge, .hero-title, .hero-description, .hero-actions');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        el.style.transitionDelay = `${index * 0.2}s`;
        
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, 100 + (index * 200));
    });
});

// ===== FORM VALIDATION =====
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        const value = input.value.trim();
        const fieldContainer = input.closest('.form-group-new') || input.closest('.form-group');
        
        if (!value) {
            input.style.borderColor = '#ef4444';
            input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
            isValid = false;
            
            // Add error message if not exists
            if (!fieldContainer.querySelector('.error-message')) {
                const errorMsg = document.createElement('span');
                errorMsg.className = 'error-message';
                errorMsg.style.color = '#ef4444';
                errorMsg.style.fontSize = '0.85rem';
                errorMsg.style.marginTop = '0.5rem';
                errorMsg.style.display = 'block';
                errorMsg.textContent = 'Це поле є обов\'язковим';
                fieldContainer.appendChild(errorMsg);
            }
        } else {
            input.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            input.style.boxShadow = 'none';
            
            // Remove error message
            const errorMsg = fieldContainer.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }
    });
    
    return isValid;
}

// ===== PHONE NUMBER FORMATTING =====
document.addEventListener('DOMContentLoaded', () => {
    const phoneInput = document.querySelector('input[name="phone"]');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove all non-digits
            
            // If user starts typing without +380, add it
            if (value && !value.startsWith('380')) {
                value = '380' + value;
            }
            
            // Format as +380 (XX) XXX-XX-XX
            if (value.length > 3) {
                value = '+380 (' + value.substring(3, 5) + ') ' + value.substring(5, 8) + '-' + value.substring(8, 10) + '-' + value.substring(10, 12);
            } else if (value.length > 0) {
                value = '+380';
            }
            
            e.target.value = value;
        });
        
        phoneInput.addEventListener('focus', function(e) {
            if (!e.target.value) {
                e.target.value = '+380';
            }
        });
    }
});

// ===== FORM SUBMISSION =====
document.addEventListener('DOMContentLoaded', () => {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            // Don't prevent default for Formspree forms
            if (form.action.includes('formspree.io')) {
                if (validateForm(form)) {
                    // Show loading state
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
                    submitBtn.disabled = true;
                    
                    // Let the form submit naturally to Formspree
                    return true;
                } else {
                    e.preventDefault();
                    showNotification('Будь ласка, заповніть всі обов\'язкові поля', 'error');
                    return false;
                }
            } else {
                e.preventDefault();
                
                if (validateForm(form)) {
                    // Show loading state
                    const submitBtn = form.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Відправка...';
                    submitBtn.disabled = true;
                    
                    // Simulate form submission (replace with actual form handling)
                    setTimeout(() => {
                        // Show success message
                        showNotification('Повідомлення успішно відправлено!', 'success');
                        
                        // Reset form
                        form.reset();
                        submitBtn.innerHTML = originalText;
                        submitBtn.disabled = false;
                    }, 2000);
                } else {
                    showNotification('Будь ласка, заповніть всі обов\'язкові поля', 'error');
                }
            }
        });
    });
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : 
                    type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 
                    'linear-gradient(135deg, #3b82f6, #2563eb)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        font-weight: 500;
        backdrop-filter: blur(10px);
    `;
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 5000);
}

// ===== LOADING ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-background, .hero-background-new');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== CARD HOVER EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.overview-card, .advantage-item, .detail-card, .contact-card-new, .principle-card, .document-item-new');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// ===== BUTTON CLICK EFFECTS =====
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.hero-btn, .cta-btn, .submit-btn-new, .action-link-new, .document-link-new');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// ===== RIPPLE ANIMATION CSS =====
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .animate-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===== SCROLL TO TOP BUTTON =====
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 1.2rem;
    box-shadow: 0 10px 30px rgba(59, 130, 246, 0.3);
    z-index: 1000;
    opacity: 0;
    transform: translateY(100px);
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
`;

scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.transform = 'translateY(0)';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.transform = 'translateY(100px)';
    }
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    // ESC key closes mobile menu
    if (e.key === 'Escape') {
        if (navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Enter key on focusable elements
    if (e.key === 'Enter') {
        const focused = document.activeElement;
        if (focused && (focused.classList.contains('nav-link') || focused.classList.contains('hero-btn') || focused.classList.contains('cta-btn'))) {
            focused.click();
        }
    }
});

// ===== PERFORMANCE OPTIMIZATION =====
// Throttle scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply throttling to scroll events
const throttledScrollHandler = throttle(() => {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// ===== CONSOLE WELCOME MESSAGE =====
console.log(`
%cТОВ "ГЛОСТЕР-ЕНЕРДЖІ" - Корпоративний сайт
%cСайт створено з використанням сучасних веб-технологій
%cВерсія: 1.0.0 | Рік: 2025
`, 
'color: #3b82f6; font-size: 16px; font-weight: bold;',
'color: #10b981; font-size: 12px;',
'color: #f59e0b; font-size: 10px;'
);
