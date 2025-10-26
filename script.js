// SmartData Traffic Solutions - JavaScript Functionality

// DOM Elements
const quoteForm = document.getElementById('quoteForm');
const successModal = document.getElementById('successModal');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeAnimations();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(26, 26, 26, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        } else {
            navbar.style.background = '#1a1a1a';
            navbar.style.backdropFilter = 'none';
        }
    });
}

// Form handling
function initializeFormHandling() {
    if (quoteForm) {
        quoteForm.addEventListener('submit', handleFormSubmission);
    }
}

function handleFormSubmission(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(quoteForm);
    const data = Object.fromEntries(formData);
    
    // Validate required fields
    if (!validateForm(data)) {
        return;
    }
    
    // Show loading state
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Store form data (in a real app, this would be sent to a server)
        storeFormData(data);
        
        // Show success modal
        showSuccessModal();
        
        // Reset form
        quoteForm.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
    }, 2000); // Simulate network delay
}

function validateForm(data) {
    const requiredFields = ['fullName', 'company', 'email', 'phone', 'projectType', 'projectLocation'];
    const errors = [];
    
    requiredFields.forEach(field => {
        if (!data[field] || data[field].trim() === '') {
            errors.push(field);
        }
    });
    
    // Email validation
    if (data.email && !isValidEmail(data.email)) {
        errors.push('email');
    }
    
    // Phone validation
    if (data.phone && !isValidPhone(data.phone)) {
        errors.push('phone');
    }
    
    if (errors.length > 0) {
        showValidationErrors(errors);
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

function showValidationErrors(errors) {
    // Remove existing error styles
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
    
    // Add error styles to invalid fields
    errors.forEach(field => {
        const formGroup = document.querySelector(`[name="${field}"]`).closest('.form-group');
        if (formGroup) {
            formGroup.classList.add('error');
        }
    });
    
    // Show error message
    showNotification('Please fill in all required fields correctly.', 'error');
}

function storeFormData(data) {
    // In a real application, this would send data to a server
    // For now, we'll store it in localStorage for demonstration
    const submissions = JSON.parse(localStorage.getItem('quoteSubmissions') || '[]');
    submissions.push({
        ...data,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    localStorage.setItem('quoteSubmissions', JSON.stringify(submissions));
    
    // Log to console for development
    console.log('New quote request:', data);
    
    // In production, you would send this to your backend:
    // fetch('/api/quote-requests', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data)
    // });
}

function showSuccessModal() {
    if (successModal) {
        successModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (successModal) {
        successModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize animations and effects
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .contact-item, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Add animation classes
    const style = document.createElement('style');
    style.textContent = `
        .service-card, .contact-item, .hero-content {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s ease;
        }
        
        .service-card.animate-in, .contact-item.animate-in, .hero-content.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .form-group.error input,
        .form-group.error select,
        .form-group.error textarea {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
    `;
    document.head.appendChild(style);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'error' ? '#ef4444' : '#10b981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            z-index: 1500;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = notificationStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => notification.remove());
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    if (e.target === successModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && successModal.style.display === 'block') {
        closeModal();
    }
});

// Form field enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add floating labels effect
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
        
        // Check if field has value on load
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });
});

// Export functions for global access
window.closeModal = closeModal;
