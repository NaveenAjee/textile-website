// Main JavaScript file for Textile Business Website

document.addEventListener('DOMContentLoaded', function() {
  // Initialize mobile menu
  initMobileMenu();
  
  // Initialize product filters if on collections page
  if (document.querySelector('.product-filters')) {
    initProductFilters();
  }
  
  // Initialize product image zoom if on product detail page
  if (document.querySelector('.product-image-zoom')) {
    initProductZoom();
  }
  
  // Initialize newsletter form
  if (document.querySelector('.newsletter-form')) {
    initNewsletterForm();
  }
  
  // Initialize contact form
  if (document.querySelector('.contact-form')) {
    initContactForm();
  }
});

// Mobile Menu Toggle
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (!menuToggle || !mobileMenu) return;
  
  menuToggle.addEventListener('click', function() {
    mobileMenu.classList.toggle('hidden');
    document.body.classList.toggle('overflow-hidden');
  });
}

// Product Filters
function initProductFilters() {
  const filterToggles = document.querySelectorAll('.filter-toggle');
  const filterOptions = document.querySelectorAll('.filter-options');
  const filterSelects = document.querySelectorAll('.filter-select');
  
  // Toggle filter dropdowns
  filterToggles.forEach(toggle => {
    toggle.addEventListener('click', function() {
      const targetId = this.getAttribute('data-target');
      const targetOptions = document.getElementById(targetId);
      
      if (targetOptions) {
        targetOptions.classList.toggle('hidden');
        this.querySelector('.toggle-icon').classList.toggle('rotate-180');
      }
    });
  });
  
  // Handle filter selections
  filterSelects.forEach(select => {
    select.addEventListener('change', function() {
      // In a real application, this would filter the products
      console.log('Filter changed:', this.name, this.value);
      // You would implement actual filtering logic here
    });
  });
}

// Product Image Zoom
function initProductZoom() {
  const productImage = document.querySelector('.product-image-zoom img');
  const zoomContainer = document.querySelector('.product-image-zoom');
  
  if (!productImage || !zoomContainer) return;
  
  zoomContainer.addEventListener('mousemove', function(e) {
    const { left, top, width, height } = zoomContainer.getBoundingClientRect();
    const x = (e.clientX - left) / width * 100;
    const y = (e.clientY - top) / height * 100;
    
    productImage.style.transformOrigin = `${x}% ${y}%`;
  });
  
  zoomContainer.addEventListener('mouseenter', function() {
    productImage.style.transform = 'scale(1.5)';
  });
  
  zoomContainer.addEventListener('mouseleave', function() {
    productImage.style.transform = 'scale(1)';
    productImage.style.transformOrigin = 'center center';
  });
}

// Newsletter Form Submission
function initNewsletterForm() {
  const form = document.querySelector('.newsletter-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    
    if (!email) {
      showFormMessage(form, 'Please enter your email address', 'error');
      return;
    }
    
    // In a real application, you would send this to your backend
    console.log('Newsletter signup:', email);
    
    // Show success message
    showFormMessage(form, 'Thank you for subscribing!', 'success');
    this.reset();
  });
}

// Contact Form Submission
function initContactForm() {
  const form = document.querySelector('.contact-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = this.querySelector('input[name="name"]').value;
    const email = this.querySelector('input[name="email"]').value;
    const message = this.querySelector('textarea[name="message"]').value;
    
    if (!name || !email || !message) {
      showFormMessage(form, 'Please fill out all fields', 'error');
      return;
    }
    
    // In a real application, you would send this to your backend
    console.log('Contact form submission:', { name, email, message });
    
    // Show success message
    showFormMessage(form, 'Thank you for your message! We\'ll get back to you soon.', 'success');
    this.reset();
  });
}

// Helper function to show form messages
function showFormMessage(form, message, type) {
  let messageEl = form.querySelector('.form-message');
  
  if (!messageEl) {
    messageEl = document.createElement('div');
    messageEl.className = 'form-message mt-3';
    form.appendChild(messageEl);
  }
  
  messageEl.textContent = message;
  messageEl.className = `form-message mt-3 text-sm ${
    type === 'error' ? 'text-red-600' : 'text-green-600'
  }`;
  
  // Clear message after 5 seconds
  setTimeout(() => {
    messageEl.textContent = '';
    messageEl.className = 'form-message mt-3 hidden';
  }, 5000);
}