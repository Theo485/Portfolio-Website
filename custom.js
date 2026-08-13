// Custom JavaScript for Theo's Portfolio

// Smooth scrolling for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });



    // Enhanced typing animation for hero section
    const typedWords = document.querySelectorAll('.word');
    if (typedWords.length > 0) {
        let currentWordIndex = 0;
        
        function showNextWord() {
            // Hide all words
            typedWords.forEach(word => word.classList.remove('active'));
            
            // Show current word
            typedWords[currentWordIndex].classList.add('active');
            
            // Move to next word
            currentWordIndex = (currentWordIndex + 1) % typedWords.length;
        }
        
        // Start the animation
        showNextWord();
        setInterval(showNextWord, 2000); // Change word every 2 seconds
    }
    
    // Add floating animation to hero elements
    const floatingElements = document.querySelectorAll('.floating-card, .orbit-item');
    floatingElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.5}s`;
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe hero elements
    const heroElements = document.querySelectorAll('.hero-greeting, .hero-description, .hero-stats, .hero-buttons');
    heroElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
    
    // Add smooth reveal animation with staggered delays
    heroElements.forEach((element, index) => {
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const message = this.querySelector('textarea').value;
            
            // Simple validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual backend)
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                this.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Project modal logic
    const overlay = document.getElementById('project-modal-overlay');
    const modalTitle = document.getElementById('project-modal-title');
    const modalDesc = document.getElementById('project-modal-desc');
    const modalCta = document.getElementById('project-modal-cta');
    const modalFeatures = document.getElementById('project-modal-features');
    const galleryWrap = document.getElementById('project-modal-gallery');
    const galleryImg = document.getElementById('gallery-image');
    const galleryPrev = document.getElementById('gallery-prev');
    const galleryNext = document.getElementById('gallery-next');
    const galleryCounter = document.getElementById('gallery-counter');
    let galleryImages = [];
    let galleryIndex = 0;
    const modalClose = document.getElementById('project-modal-close');

    function iconForFeature(name) {
        const n = (name || '').toLowerCase();
        if (n.includes('agri')) return 'fas fa-tractor';
        if (n.includes('ai') && n.includes('planner')) return 'fas fa-robot';
        if (n.includes('generate') && n.includes('grocery')) return 'fas fa-clipboard-list';
        if (n.includes('compare') && n.includes('price')) return 'fas fa-tags';
        if (n.includes('auth')) return 'fas fa-user-shield';
        if (n.includes('reservation')) return 'fas fa-calendar-check';
        if (n.includes('table')) return 'fas fa-table';
        if (n.includes('email')) return 'fas fa-bell';
        return 'fas fa-check-circle';
    }

    function openProjectModal(fromCard) {
        if (!overlay || !fromCard) return;
        const title = fromCard.getAttribute('data-title') || 'Project';
        const desc = fromCard.getAttribute('data-desc') || '';
        const cta = fromCard.getAttribute('data-cta');
        const url = cta ? fromCard.getAttribute('data-url') : '';
        const features = (fromCard.getAttribute('data-features') || '')
          .split('|')
          .map(s => s.trim())
          .filter(Boolean);
        const galleryAttr = (fromCard.getAttribute('data-gallery') || '').trim();
        galleryImages = galleryAttr ? galleryAttr.split('|').map(s => s.trim()).filter(Boolean) : [];
        galleryIndex = 0;

        if (modalTitle) modalTitle.textContent = title;
        if (modalDesc) modalDesc.innerHTML = desc.replace(/\n\n/g, '<br><br>');
        // CTA behavior: if gallery present or CTA is empty, hide CTA
        if (modalCta) {
            if (galleryImages.length > 0 || !cta) {
                modalCta.style.display = 'none';
            } else {
                modalCta.textContent = cta;
                modalCta.href = url;
                modalCta.style.display = '';
            }
        }
        if (modalFeatures) {
            if (features.length) {
                modalFeatures.innerHTML = features.map((f) => `
                  <div class="feature">
                    <i class="${iconForFeature(f)}"></i>
                    <span>${f}</span>
                  </div>
                `).join('');
                modalFeatures.style.display = 'block';
            } else {
                modalFeatures.innerHTML = '';
                modalFeatures.style.display = 'none';
            }
        }

        // Setup gallery if present
        if (galleryWrap) {
            if (galleryImages.length > 0 && galleryImg && galleryPrev && galleryNext && galleryCounter) {
                function updateGallery() {
                    if (!galleryImages.length) return;
                    const src = galleryImages[galleryIndex];
                    galleryImg.src = src;
                    galleryCounter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
                }
                updateGallery();
                galleryWrap.style.display = 'block';

                // Ensure handlers attached only once
                if (!galleryWrap.dataset.bound) {
                    galleryPrev.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (!galleryImages.length) return;
                        galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
                        updateGallery();
                    });
                    galleryNext.addEventListener('click', (e) => {
                        e.preventDefault();
                        if (!galleryImages.length) return;
                        galleryIndex = (galleryIndex + 1) % galleryImages.length;
                        updateGallery();
                    });
                    document.addEventListener('keydown', (e) => {
                        if (!overlay.classList.contains('open')) return;
                        if (!galleryImages.length) return;
                        if (e.key === 'ArrowLeft') {
                            galleryIndex = (galleryIndex - 1 + galleryImages.length) % galleryImages.length;
                            updateGallery();
                        } else if (e.key === 'ArrowRight') {
                            galleryIndex = (galleryIndex + 1) % galleryImages.length;
                            updateGallery();
                        }
                    });
                    galleryWrap.dataset.bound = 'true';
                }
            } else {
                galleryWrap.style.display = 'none';
            }
        }

        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeProjectModal() {
        if (!overlay) return;
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeProjectModal);
    if (overlay) overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeProjectModal();
    });

    // Delegate click for .btn-view inside cards
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-view');
        if (!btn) return;
        const card = e.target.closest('.project-card');
        if (!card) return;
        e.preventDefault();
        openProjectModal(card);
    });

    // Improved scroll behavior without parallax
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Navbar background on scroll
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (scrolled > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
        
        // Update active navigation links
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const sectionId = section.getAttribute('id');
            
            if (rect.top <= 100 && rect.bottom >= 100) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                const activeLink = document.querySelector(`[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    });

});

// Toggle project details panels (global)
function toggleProjectDetails(id) {
  const allDetails = document.querySelectorAll('.project-details');
  const target = document.getElementById(`${id}-details`);
  if (!target) return;
  const willOpen = !target.classList.contains('active');
  allDetails.forEach(d => d.classList.remove('active'));
  if (willOpen) {
    target.classList.add('active');
    target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Dark/Light mode toggle (optional feature)
function toggleTheme() {
    const body = document.body;
    body.classList.toggle('light-mode');
    
    // Save preference
    const isLight = body.classList.contains('light-mode');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

// Load saved theme preference
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
});

// Add CSS for mobile navigation and hamburger animation
const mobileNavStyles = `
<style>
.hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
}

.hamburger.active span:nth-child(2) {
    opacity: 0;
}

.hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
}

.hamburger span {
    transition: all 0.3s ease;
}

.navbar.scrolled .hamburger span {
    background: var(--text-primary);
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', mobileNavStyles);

// Terminal functionality
function initTerminal() {
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  
  // Available commands
  const commands = {
    help: {
      description: 'Show available commands',
      execute: () => showHelp()
    },
    about: {
      description: 'Show information about me',
      execute: () => showAbout()
    },
    projects: {
      description: 'Show my projects',
      execute: () => showProjects()
    },
    education: {
      description: 'Show my education background',
      execute: () => showEducation()
    },
    contact: {
      description: 'Show contact information',
      execute: () => showContact()
    },
    clear: {
      description: 'Clear the terminal',
      execute: () => clearTerminal()
    },
    date: {
      description: 'Show current date and time',
      execute: () => showDateTime()
    },
    echo: {
      description: 'Echo the input',
      execute: (args) => echo(args)
    }
  };

  // Command functions
  function showHelp() {
    let output = '<div class="terminal-output">';
    output += '<span class="terminal-info">Available commands:</span><br>';
    
    for (const [cmd, data] of Object.entries(commands)) {
      output += `<span class="terminal-command">${cmd.padEnd(15)}</span> - ${data.description}<br>`;
    }
    
    output += '</div>';
    addToTerminal(output);
  }

  function showAbout() {
    const about = `
      <div class="terminal-output">
        <span class="terminal-info">About Me:</span><br><br>
        I'm Theophilus Mukwevho, a passionate tech enthusiast currently pursuing a BCom in Information Systems.<br>
        I'm dedicated to continuous learning and exploring new technologies.<br><br>
        <span class="terminal-command">Skills:</span> Web Development, Mobile Development, Problem Solving<br>
        <span class="terminal-command">Interests:</span> Technology, Innovation, Learning New Things<br>
      </div>
    `;
    addToTerminal(about);
  }

  function showProjects() {
    const projects = `
      <div class="terminal-output">
        <span class="terminal-info">My Projects:</span><br><br>
        <span class="terminal-command">1. Mobile Application (In Progress)</span><br>
        • Currently developing my first mobile application<br>
        • Learning mobile development concepts and best practices<br><br>
        
        <span class="terminal-command">2. Web Development</span><br>
        • Building responsive websites and web applications<br>
        • Continuously improving my frontend and backend skills<br>
      </div>
    `;
    addToTerminal(projects);
  }

  function showEducation() {
    const education = `
      <div class="terminal-output">
        <span class="terminal-info">Education:</span><br><br>
        <span class="terminal-command">University of Johannesburg</span><br>
        • BCom Information Systems (2023-2025)<br>
        • Currently in final year (83% complete)<br><br>
        
        <span class="terminal-command">Patrick Ramaano Secondary School</span><br>
        • National Senior Certificate (2018-2022)<br>
        • Graduated with distinction<br>
      </div>
    `;
    addToTerminal(education);
  }

  function showContact() {
    const contact = `
      <div class="terminal-output">
        <span class="terminal-info">Contact Information:</span><br><br>
        <span class="terminal-command">Email:</span> theomukwevho04@gmail.com<br>
        <span class="terminal-command">Phone:</span> +27 73 372 3551<br>
        <span class="terminal-command">Location:</span> Randburg, Gauteng, South Africa<br><br>
        
        <span class="terminal-info">Connect with me:</span><br>
        • <a href="https://linkedin.com/in/theophilus-mukwevho-1377752b7" target="_blank" style="color: #6dd5fa;">LinkedIn</a><br>
        • <a href="https://github.com/Theo485" target="_blank" style="color: #6dd5fa;">GitHub</a><br>
        • <a href="https://instagram.com/theo_mkwevho" target="_blank" style="color: #6dd5fa;">Instagram</a><br>
      </div>
    `;
    addToTerminal(contact);
  }

  function clearTerminal() {
    const terminalBody = document.querySelector('.terminal-body');
    const prompt = terminalBody.querySelector('.terminal-line:last-child');
    terminalBody.innerHTML = '';
    terminalBody.appendChild(prompt);
  }

  function showDateTime() {
    const now = new Date();
    const options = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const dateTimeString = now.toLocaleDateString('en-US', options);
    addToTerminal(`<div class="terminal-output">${dateTimeString}</div>`);
  }

  function echo(args) {
    if (args.length === 0) {
      addToTerminal('<div class="terminal-output">Usage: echo [text]</div>');
      return;
    }
    addToTerminal(`<div class="terminal-output">${args.join(' ')}</div>`);
  }

  function addToTerminal(html) {
    const outputDiv = document.createElement('div');
    outputDiv.innerHTML = html;
    terminalOutput.insertBefore(outputDiv, terminalOutput.lastElementChild);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Handle command execution
  function executeCommand(input) {
    const args = input.trim().split(/\s+/);
    const command = args.shift().toLowerCase();
    
    // Add the command to the terminal
    const commandLine = document.createElement('div');
    commandLine.className = 'terminal-line';
    commandLine.innerHTML = `
      <span class="terminal-prompt">theo@portfolio:~$</span>
      <span>${input}</span>
    `;
    terminalOutput.insertBefore(commandLine, terminalOutput.lastElementChild);
    
    // Execute the command if it exists
    if (commands[command]) {
      commands[command].execute(args);
    } else if (command) {
      addToTerminal(`<div class="terminal-error">Command not found: ${command}. Type 'help' for available commands.</div>`);
    }
    
    // Reset input
    terminalInput.textContent = '';
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Event listeners
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = terminalInput.textContent.trim();
      if (input) {
        executeCommand(input);
      }
    }
  });

  // Focus the input when clicking anywhere in the terminal
  terminalOutput.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Initial welcome message
  const welcomeMessage = `
    <div class="terminal-output">
      <span class="terminal-info">Welcome to Theo's Portfolio Terminal!</span><br>
      Type 'help' to see available commands.<br><br>
    </div>
  `;
  addToTerminal(welcomeMessage);
}

// Initialize terminal when the page loads
if (document.getElementById('terminal-output')) {
  document.addEventListener('DOMContentLoaded', initTerminal);
}

// Newsletter Form Submission
// Enhanced showFormMessage function
function showFormMessage(message, type = 'info', element = null) {
  let statusElement = element;
  
  // Create a new status element if one wasn't provided
  if (!statusElement) {
    statusElement = document.createElement('div');
    statusElement.className = 'form-status';
    document.body.appendChild(statusElement);
    
    // Auto-remove after 5 seconds if it's a floating notification
    setTimeout(() => {
      statusElement.style.opacity = '0';
      setTimeout(() => {
        if (statusElement && statusElement.parentNode) {
          statusElement.parentNode.removeChild(statusElement);
        }
      }, 300);
    }, 5000);
  }
  
  statusElement.textContent = message;
  statusElement.className = `form-status ${type} show`;
  statusElement.style.display = 'block';
  statusElement.style.opacity = '1';
  
  // Scroll to show the message if it's not already visible
  statusElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  
  return statusElement;
}

function initNewsletterForm() {
  const form = document.getElementById('newsletter-form');
  if (!form) return;
  
  const submitBtn = document.getElementById('newsletter-submit');
  const loadingSpinner = submitBtn ? submitBtn.querySelector('.loading-spinner') : null;
  let formStatus = document.getElementById('newsletter-status');
  const emailInput = form.querySelector('input[type="email"]');
  
  // Create status element if it doesn't exist
  if (!formStatus) {
    formStatus = document.createElement('div');
    formStatus.id = 'newsletter-status';
    form.insertBefore(formStatus, form.firstChild);
  }

  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    
    // Simple email validation
    if (!email || !isValidEmail(email)) {
      showFormMessage('Please enter a valid email address', 'error', formStatus);
      emailInput.focus();
      return;
    }
    
    // Show loading state
    if (submitBtn && loadingSpinner) {
      submitBtn.disabled = true;
      const icon = submitBtn.querySelector('i');
      if (icon) icon.style.display = 'none';
      loadingSpinner.style.display = 'inline-block';
    }
    
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Show success message
        showFormMessage('Thank you for subscribing!', 'success', formStatus);
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      showFormMessage('Failed to subscribe. Please try again later.', 'error', formStatus);
    } finally {
      // Reset button state
      if (submitBtn && loadingSpinner) {
        submitBtn.disabled = false;
        const icon = submitBtn.querySelector('i');
        if (icon) icon.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';
      }
    }
  });
}

// Email validation helper
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Notification function
function showNotification(message, type = 'info') {
  // Check if notification element already exists
  let notification = document.querySelector('.notification');
  
  if (!notification) {
    // Create notification element if it doesn't exist
    notification = document.createElement('div');
    notification.className = 'notification';
    document.body.appendChild(notification);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: white;
        font-size: 0.9rem;
        z-index: 1000;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
        max-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      .notification.show {
        transform: translateY(0);
        opacity: 1;
      }
      .notification.success {
        background-color: #10b981;
      }
      .notification.error {
        background-color: #ef4444;
      }
      .notification.info {
        background-color: #3b82f6;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Set notification content and type
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 5000);
}

// Initialize forms when the page loads
document.addEventListener('DOMContentLoaded', function() {
  initNewsletterForm();
  initContactForm();
});

// Contact Form Handling
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  const submitBtn = document.getElementById('contact-submit');
  const submitText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const loadingSpinner = submitBtn ? submitBtn.querySelector('.loading-spinner') : null;
  const formStatus = document.getElementById('form-status');
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Show loading state
    if (submitBtn && submitText && loadingSpinner) {
      submitBtn.disabled = true;
      submitText.style.display = 'none';
      loadingSpinner.style.display = 'inline-block';
    }
    
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Show success message
        showFormMessage('Your message has been sent successfully!', 'success');
        form.reset();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      showFormMessage('Failed to send message. Please try again later.', 'error');
    } finally {
      // Reset button state
      if (submitBtn && submitText && loadingSpinner) {
        submitBtn.disabled = false;
        submitText.style.display = 'inline-block';
        loadingSpinner.style.display = 'none';
      }
    }
  });
  
  function showFormMessage(message, type = 'info') {
    if (!formStatus) return;
    
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      formStatus.style.opacity = '0';
      setTimeout(() => {
        formStatus.style.display = 'none';
        formStatus.style.opacity = '1';
      }, 300);
    }, 5000);
  }
}

// Download CV function
function downloadCV() {
    // Path to the CV file in the assets folder
    const cvUrl = 'assets/TheoMukwevhoCV.pdf';
    
    // Show a notification that the download is starting
    showNotification('Starting CV download...', 'success');
    
    // Create a temporary link element to trigger the download
    const link = document.createElement('a');
    link.href = cvUrl;
    
    // Set the download attribute with the desired filename
    link.download = 'Theophilus_Mukwevho_CV.pdf'; // Make sure the extension matches your file
    
    // Add the link to the document, click it, and then remove it
    document.body.appendChild(link);
    link.click();
    
    // Clean up by removing the link
    setTimeout(() => {
        document.body.removeChild(link);
    }, 100);
}
