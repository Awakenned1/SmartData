// SmartData Traffic Solutions - JavaScript Functionality

// DOM Elements
const quoteForm = document.getElementById('quoteForm');
const successModal = document.getElementById('successModal');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelector('.nav-links');

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFormHandling();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeFileUpload();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('active');
            }
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('active')) {
            if (!event.target.closest('.navigation')) {
                navLinks.classList.remove('active');
                if (mobileToggle) mobileToggle.classList.remove('active');
            }
        }
    });

    // Active nav item highlighting on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navItem = document.querySelector(`.nav-item[href="#${sectionId}"]`);

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navItems.forEach(item => item.classList.remove('active'));
                if (navItem) navItem.classList.add('active');
            }
        });
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

// File Upload Handling
function initializeFileUpload() {
    const fileInput = document.getElementById('projectFiles');
    const fileList = document.getElementById('fileList');
    let selectedFiles = [];

    if (!fileInput) return;

    fileInput.addEventListener('change', function(e) {
        const files = Array.from(e.target.files);
        
        files.forEach(file => {
            // Check file size (10MB limit)
            if (file.size > 10 * 1024 * 1024) {
                alert(`File "${file.name}" is too large. Maximum size is 10MB.`);
                return;
            }
            
            // Add file if not already in list
            if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                selectedFiles.push(file);
            }
        });
        
        displayFiles();
    });

    function displayFiles() {
        fileList.innerHTML = '';
        
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            
            const fileIcon = getFileIcon(file.name);
            const fileSize = formatFileSize(file.size);
            
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="${fileIcon}"></i>
                    <div class="file-details">
                        <span class="file-name">${file.name}</span>
                        <span class="file-size">${fileSize}</span>
                    </div>
                </div>
                <button type="button" class="file-remove" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            fileList.appendChild(fileItem);
        });
        
        // Add remove listeners
        document.querySelectorAll('.file-remove').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                selectedFiles.splice(index, 1);
                displayFiles();
            });
        });
    }

    function getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'pdf': 'fas fa-file-pdf',
            'doc': 'fas fa-file-word',
            'docx': 'fas fa-file-word',
            'xls': 'fas fa-file-excel',
            'xlsx': 'fas fa-file-excel',
            'ppt': 'fas fa-file-powerpoint',
            'pptx': 'fas fa-file-powerpoint',
            'jpg': 'fas fa-file-image',
            'jpeg': 'fas fa-file-image',
            'png': 'fas fa-file-image',
            'zip': 'fas fa-file-archive'
        };
        return iconMap[ext] || 'fas fa-file';
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
}

// Export functions for global access
window.closeModal = closeModal;
