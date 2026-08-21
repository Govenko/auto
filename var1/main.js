/**
 * AUTO SERVICE - Main JavaScript
 * Senior Full-Stack Developer Implementation
 * Modular, clean, vanilla JS
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all modules
  Header.init();
  MobileMenu.init();
  ScrollAnimations.init();
  ServicesTabs.init();
  FAQAccordion.init();
  ReviewsSlider.init();
  GalleryLightbox.init();
  ContactForm.init();
  PhoneMask.init();
});

/**
 * Header Module - Sticky behavior on scroll
 */
const Header = {
  init() {
    this.header = document.querySelector('.header');
    if (!this.header) return;
    
    this.onScroll = this.onScroll.bind(this);
    window.addEventListener('scroll', this.onScroll);
    this.onScroll(); // Initial check
  },
  
  onScroll() {
    if (window.scrollY > 50) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
  }
};

/**
 * Mobile Menu Module
 */
const MobileMenu = {
  init() {
    this.hamburger = document.querySelector('.hamburger');
    this.mobileMenu = document.querySelector('.mobile-menu');
    this.mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    if (!this.hamburger || !this.mobileMenu) return;
    
    this.hamburger.addEventListener('click', () => this.toggle());
    this.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.close());
    });
  },
  
  toggle() {
    this.hamburger.classList.toggle('active');
    this.mobileMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  },
  
  close() {
    this.hamburger.classList.remove('active');
    this.mobileMenu.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

/**
 * Scroll Animations using Intersection Observer
 */
const ScrollAnimations = {
  init() {
    this.elements = document.querySelectorAll('.fade-in-up');
    if (!this.elements.length) return;
    
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          this.observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    this.elements.forEach(el => this.observer.observe(el));
  }
};

/**
 * Services Tabs Module
 */
const ServicesTabs = {
  init() {
    this.tabBtns = document.querySelectorAll('.tab-btn');
    this.serviceCards = document.querySelectorAll('.service-card');
    
    if (!this.tabBtns.length) return;
    
    this.tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => this.onTabClick(e));
    });
  },
  
  onTabClick(e) {
    const clickedBtn = e.currentTarget;
    const filter = clickedBtn.dataset.filter;
    
    // Update active tab
    this.tabBtns.forEach(btn => btn.classList.remove('active'));
    clickedBtn.classList.add('active');
    
    // Filter cards with fade animation
    this.serviceCards.forEach(card => {
      card.classList.add('fade-out');
      
      setTimeout(() => {
        const category = card.dataset.category;
        
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.classList.remove('fade-out');
        } else {
          card.classList.add('hidden');
          card.classList.remove('fade-out');
        }
      }, 300);
    });
  }
};

/**
 * FAQ Accordion Module
 */
const FAQAccordion = {
  init() {
    this.faqItems = document.querySelectorAll('.faq-item');
    
    if (!this.faqItems.length) return;
    
    this.faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      question.addEventListener('click', () => this.toggleItem(item));
    });
  },
  
  toggleItem(clickedItem) {
    const isActive = clickedItem.classList.contains('active');
    
    // Close all items
    this.faqItems.forEach(item => {
      item.classList.remove('active');
    });
    
    // Open clicked item if it wasn't active
    if (!isActive) {
      clickedItem.classList.add('active');
    }
  }
};

/**
 * Reviews Slider Module (Vanilla JS)
 */
const ReviewsSlider = {
  init() {
    this.slider = document.querySelector('.reviews-slider');
    if (!this.slider) return;
    
    this.track = this.slider.querySelector('.reviews-track');
    this.slides = this.slider.querySelectorAll('.review-card');
    this.prevBtn = this.slider.querySelector('.slider-btn.prev');
    this.nextBtn = this.slider.querySelector('.slider-btn.next');
    
    if (!this.track || !this.slides.length || !this.prevBtn || !this.nextBtn) return;
    
    this.currentIndex = 0;
    this.totalSlides = this.slides.length;
    this.slideWidth = 100; // percentage
    
    this.prevBtn.addEventListener('click', () => this.prev());
    this.nextBtn.addEventListener('click', () => this.next());
    
    this.updateSlider();
  },
  
  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlider();
  },
  
  next() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlider();
  },
  
  updateSlider() {
    const offset = -this.currentIndex * this.slideWidth;
    this.track.style.transform = `translateX(${offset}%)`;
  }
};

/**
 * Gallery Lightbox Module
 */
const GalleryLightbox = {
  init() {
    this.galleryItems = document.querySelectorAll('.gallery-item img');
    this.lightbox = document.createElement('div');
    this.lightbox.className = 'lightbox';
    this.lightbox.innerHTML = `
      <button class="lightbox-close" aria-label="Закрыть">×</button>
      <img class="lightbox-image" src="" alt="">
    `;
    
    if (!this.galleryItems.length) return;
    
    document.body.appendChild(this.lightbox);
    
    this.lightboxImage = this.lightbox.querySelector('.lightbox-image');
    this.closeBtn = this.lightbox.querySelector('.lightbox-close');
    
    this.galleryItems.forEach(img => {
      img.parentElement.addEventListener('click', () => this.open(img.src));
    });
    
    this.closeBtn.addEventListener('click', () => this.close());
    this.lightbox.addEventListener('click', (e) => {
      if (e.target === this.lightbox) this.close();
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox.classList.contains('active')) {
        this.close();
      }
    });
  },
  
  open(src) {
    this.lightboxImage.src = src;
    this.lightbox.classList.add('active');
    document.body.classList.add('no-scroll');
  },
  
  close() {
    this.lightbox.classList.remove('active');
    document.body.classList.remove('no-scroll');
    setTimeout(() => {
      this.lightboxImage.src = '';
    }, 300);
  }
};

/**
 * Contact Form Module with validation and submission
 */
const ContactForm = {
  init() {
    this.form = document.querySelector('.contact-form');
    if (!this.form) return;
    
    this.inputs = this.form.querySelectorAll('.form-input, .form-select');
    this.submitBtn = this.form.querySelector('button[type="submit"]');
    
    this.inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
    });
    
    this.form.addEventListener('submit', (e) => this.onSubmit(e));
  },
  
  validateField(field) {
    const errorEl = field.nextElementSibling;
    const value = field.value.trim();
    let isValid = true;
    
    // Reset error state
    field.classList.remove('error');
    
    // Required fields validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
      }
    }
    
    // Phone validation (basic)
    if (field.type === 'tel' && value) {
      const phoneDigits = value.replace(/\D/g, '');
      if (phoneDigits.length < 11) {
        isValid = false;
      }
    }
    
    if (!isValid) {
      field.classList.add('error');
    }
    
    return isValid;
  },
  
  validateForm() {
    let isValid = true;
    let firstError = null;
    
    this.inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
        if (!firstError) firstError = input;
      }
    });
    
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    return isValid;
  },
  
  async onSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;
    
    // Disable button and show loading state
    const originalText = this.submitBtn.innerHTML;
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = '<span class="spinner"></span> Отправка...';
    
    // Simulate API request
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Success state
    this.submitBtn.classList.add('btn-success');
    this.submitBtn.innerHTML = '✓ Отправлено';
    
    // Show success message
    this.showSuccessMessage();
    
    // Reset form after delay
    setTimeout(() => {
      this.form.reset();
      this.submitBtn.disabled = false;
      this.submitBtn.classList.remove('btn-success');
      this.submitBtn.innerHTML = originalText;
    }, 3000);
  },
  
  showSuccessMessage() {
    const successMsg = document.createElement('div');
    successMsg.style.cssText = `
      background: var(--success);
      color: white;
      padding: 16px;
      border-radius: var(--radius-btn);
      margin-top: 20px;
      text-align: center;
      font-weight: 600;
      animation: fadeInUp 0.3s ease;
    `;
    successMsg.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
    this.form.appendChild(successMsg);
    
    setTimeout(() => {
      successMsg.remove();
    }, 5000);
  }
};

/**
 * Phone Mask Module
 */
const PhoneMask = {
  init() {
    this.phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    this.phoneInputs.forEach(input => {
      input.addEventListener('focus', (e) => this.onFocus(e));
      input.addEventListener('input', (e) => this.onInput(e));
      input.addEventListener('blur', (e) => this.onBlur(e));
    });
  },
  
  onFocus(e) {
    const input = e.target;
    if (!input.value) {
      input.value = '+7 (';
    }
  },
  
  onInput(e) {
    const input = e.target;
    let value = input.value.replace(/\D/g, '');
    
    // Remove leading 8 or 7
    if (value.startsWith('8')) value = value.slice(1);
    if (value.startsWith('7')) value = value.slice(1);
    
    // Limit to 10 digits
    value = value.slice(0, 10);
    
    // Format: +7 (XXX) XXX-XX-XX
    let formatted = '+7 (';
    if (value.length > 0) formatted += value.slice(0, 3);
    if (value.length > 3) formatted += ') ' + value.slice(3, 6);
    if (value.length > 6) formatted += '-' + value.slice(6, 8);
    if (value.length > 8) formatted += '-' + value.slice(8, 10);
    
    input.value = formatted;
  },
  
  onBlur(e) {
    const input = e.target;
    const value = input.value.replace(/\D/g, '');
    
    // If incomplete, clear
    if (value.length < 10) {
      input.value = '';
    }
  }
};

/**
 * Smooth Scroll to Anchors
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

/**
 * Logo Click - Scroll to Top
 */
document.querySelectorAll('.logo').forEach(logo => {
  logo.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
