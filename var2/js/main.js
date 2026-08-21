/**
 * AUTOSERVICE - Main JavaScript File
 * Professional auto service website functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // STICKY HEADER
  // ============================================
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  if (header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Scroll to top button visibility
      if (scrollTopBtn) {
        if (currentScroll > 500) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }
      
      lastScroll = currentScroll;
    });
  }
  
  // Scroll to top functionality
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ============================================
  // MOBILE MENU
  // ============================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
  const body = document.body;
  
  function toggleMobileMenu() {
    mobileToggle.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileMenuOverlay.classList.toggle('active');
    body.classList.toggle('no_scroll');
  }
  
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }
  
  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', toggleMobileMenu);
  }
  
  // Close mobile menu on link click
  const mobileLinks = document.querySelectorAll('.mobile-nav a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
        toggleMobileMenu();
      }
    });
  });
  
  // ============================================
  // SERVICES TABS
  // ============================================
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      
      // Remove active class from all buttons and contents
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to clicked button and target content
      btn.classList.add('active');
      const targetContent = document.getElementById(targetTab);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
  
  // ============================================
  // FAQ ACCORDION
  // ============================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current item
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
  
  // ============================================
  // LIGHTBOX GALLERY
  // ============================================
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox-content img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  
  let currentImageIndex = 0;
  let images = [];
  
  if (galleryItems.length > 0) {
    // Collect all images
    galleryItems.forEach((item, index) => {
      const img = item.querySelector('img');
      images.push(img.src);
      
      item.addEventListener('click', () => {
        currentImageIndex = index;
        openLightbox(img.src);
      });
    });
    
    function openLightbox(src) {
      lightboxImg.src = src;
      lightbox.classList.add('active');
      body.classList.add('no_scroll');
    }
    
    function closeLightbox() {
      lightbox.classList.remove('active');
      body.classList.remove('no_scroll');
    }
    
    function showImage(index) {
      if (index < 0) {
        index = images.length - 1;
      } else if (index >= images.length) {
        index = 0;
      }
      currentImageIndex = index;
      lightboxImg.src = images[index];
    }
    
    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          closeLightbox();
        }
      });
    }
    
    if (lightboxPrev) {
      lightboxPrev.addEventListener('click', () => {
        showImage(currentImageIndex - 1);
      });
    }
    
    if (lightboxNext) {
      lightboxNext.addEventListener('click', () => {
        showImage(currentImageIndex + 1);
      });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showImage(currentImageIndex - 1);
      } else if (e.key === 'ArrowRight') {
        showImage(currentImageIndex + 1);
      }
    });
  }
  
  // ============================================
  // TESTIMONIALS SLIDER
  // ============================================
  const testimonialsTrack = document.querySelector('.testimonials-track');
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.testimonial-dot');
  
  if (testimonialsTrack && testimonialCards.length > 0) {
    let currentTestimonial = 0;
    const totalTestimonials = testimonialCards.length;
    const visibleTestimonials = getVisibleTestimonialsCount();
    
    function getVisibleTestimonialsCount() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }
    
    function updateSlider() {
      const cardWidth = testimonialCards[0].offsetWidth + 30; // including gap
      const offset = -currentTestimonial * cardWidth;
      testimonialsTrack.style.transform = `translateX(${offset}px)`;
      
      // Update dots
      testimonialDots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentTestimonial);
      });
    }
    
    testimonialDots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        currentTestimonial = index;
        updateSlider();
      });
    });
    
    // Auto slide
    let autoSlideInterval = setInterval(() => {
      currentTestimonial = (currentTestimonial + 1) % (totalTestimonials - visibleTestimonials + 1);
      updateSlider();
    }, 5000);
    
    // Pause on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
      testimonialsSection.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
      });
      
      testimonialsSection.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(() => {
          currentTestimonial = (currentTestimonial + 1) % (totalTestimonials - visibleTestimonials + 1);
          updateSlider();
        }, 5000);
      });
    }
    
    // Handle resize
    window.addEventListener('resize', () => {
      updateSlider();
    });
  }
  
  // ============================================
  // CONTACT FORM VALIDATION & SUBMISSION
  // ============================================
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    const formInputs = contactForm.querySelectorAll('.form-input, .form-select, .form-textarea');
    const formCheckbox = contactForm.querySelector('.form-checkbox');
    const formSubmit = contactForm.querySelector('.form-submit');
    const formSuccess = contactForm.querySelector('.form-success');
    
    // Phone mask
    const phoneInput = contactForm.querySelector('input[type="tel"]');
    if (phoneInput) {
      phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
          if (value[0] === '7' || value[0] === '8') {
            value = value.substring(1);
          }
          
          if (value.length > 10) value = value.substring(0, 10);
          
          let formattedValue = '+7 (';
          if (value.length > 0) formattedValue += value.substring(0, 3);
          if (value.length > 3) formattedValue += ') ' + value.substring(3, 6);
          if (value.length > 6) formattedValue += '-' + value.substring(6, 8);
          if (value.length > 8) formattedValue += '-' + value.substring(8, 10);
          
          e.target.value = formattedValue;
        } else {
          e.target.value = '';
        }
      });
    }
    
    // Validate field
    function validateField(field) {
      const value = field.value.trim();
      const fieldName = field.getAttribute('name');
      const isRequired = field.hasAttribute('required');
      
      if (isRequired && !value) {
        field.classList.add('error');
        return false;
      }
      
      if (fieldName === 'phone' && isRequired) {
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 10) {
          field.classList.add('error');
          return false;
        }
      }
      
      if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          field.classList.add('error');
          return false;
        }
      }
      
      field.classList.remove('error');
      return true;
    }
    
    // Validate all fields
    function validateForm() {
      let isValid = true;
      
      formInputs.forEach(field => {
        if (!validateField(field)) {
          isValid = false;
        }
      });
      
      if (formCheckbox && !formCheckbox.checked) {
        isValid = false;
      }
      
      return isValid;
    }
    
    // Real-time validation
    formInputs.forEach(field => {
      field.addEventListener('blur', () => validateField(field));
      field.addEventListener('input', () => {
        if (field.classList.contains('error')) {
          validateField(field);
        }
      });
    });
    
    // Form submission
    formSubmit.addEventListener('submit', (e) => {
      e.preventDefault();
      
      if (!validateForm()) {
        // Scroll to first error
        const firstError = contactForm.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      // Show loading state
      formSubmit.classList.add('loading');
      
      // Simulate form submission (replace with actual AJAX call)
      setTimeout(() => {
        formSubmit.classList.remove('loading');
        formSuccess.classList.add('active');
        
        // Reset form
        contactForm.reset();
        formInputs.forEach(field => {
          field.classList.remove('error');
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => {
          formSuccess.classList.remove('active');
        }, 5000);
      }, 1500);
    });
  }
  
  // ============================================
  // ANIMATION ON SCROLL (Intersection Observer)
  // ============================================
  const fadeElements = document.querySelectorAll('.fade-in');
  
  if (fadeElements.length > 0 && 'IntersectionObserver' in window) {
    const fadeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    fadeElements.forEach(element => {
      fadeObserver.observe(element);
    });
  }
  
  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  
  anchorLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      if (href === '#') return;
      
      const target = document.querySelector(href);
      
      if (target) {
        e.preventDefault();
        
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.offsetTop - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // ============================================
  // LOGO CLICK SCROLL TO TOP
  // ============================================
  const logo = document.querySelector('.logo');
  if (logo) {
    logo.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
  
  // ============================================
  // WORKING HOURS INDICATOR
  // ============================================
  function updateWorkingHours() {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    
    // Monday-Friday: 9-18, Saturday-Sunday: closed
    const isOpen = (day >= 1 && day <= 5) && (hour >= 9 && hour < 18);
    
    const statusElements = document.querySelectorAll('.work-status');
    statusElements.forEach(el => {
      if (isOpen) {
        el.textContent = 'Открыто';
        el.style.color = 'var(--success)';
      } else {
        el.textContent = 'Закрыто';
        el.style.color = 'var(--error)';
      }
    });
  }
  
  updateWorkingHours();
  
  console.log('AUTOSERVICE website initialized successfully!');
});
