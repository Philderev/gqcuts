document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');

    // Change navbar appearance on scroll
    window.addEventListener('scroll', () => {
        // Use class toggling for better performance and separation of concerns
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Mobile menu toggle
    const menuToggle = document.getElementById('mobile-menu');
    const navLinksList = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinksList.classList.toggle('active');
            menuToggle.classList.toggle('is-active');
        });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                navLinksList.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('is-active');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            } else if (targetId.endsWith('.html')) {
                // For direct page links, allow default behavior
                // No need to preventDefault or close menu here, as page reload will handle it
            }
        });
    });

    // Testimonials Carousel Drag/Swipe functionality
    const slider = document.querySelector('.testimonials-slider');
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoplayInterval;

    // Function to handle the auto-scrolling animation
    const startAutoplay = () => {
        autoplayInterval = setInterval(() => {
            if (!isDown) {
                slider.scrollLeft += 1;
                
                const endPoint = slider.scrollWidth / 2;
                const maxScroll = slider.scrollWidth - slider.clientWidth;
                // Reset if we reach the midpoint or hit the physical end of the scroll container
                if (slider.scrollLeft >= endPoint || slider.scrollLeft >= maxScroll) {
                    slider.scrollLeft = slider.scrollLeft - endPoint;
                }
            }
        }, 40); // Controls the speed of the animation (increased to 40ms for a smoother, slower crawl)
    };

    const stopAutoplay = () => {
        clearInterval(autoplayInterval);
    };

    if (slider) {
        // Dynamic Cloning: Fixes HTML redundancy while maintaining the loop
        const track = slider.querySelector('.testimonials-track');
        if (track) {
            track.innerHTML += track.innerHTML;
        }

        startAutoplay();

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            stopAutoplay();
            slider.classList.add('active-drag');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active-drag');
            startAutoplay();
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active-drag');
            startAutoplay();
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;

            const endPoint = slider.scrollWidth / 2;
            // Resilient seamless loop for manual drag
            if (slider.scrollLeft <= 0) {
                slider.scrollLeft += endPoint;
            } else if (slider.scrollLeft >= endPoint) {
                slider.scrollLeft -= endPoint;
            }
        });
    }

    // Handle form submissions locally without an external backend
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent standard submission

            // Find the submit button: either inside the form or linked via the HTML5 'form' attribute
            const submitBtn = form.querySelector('.cta-btn') || 
                             (form.id ? document.querySelector(`.cta-btn[form="${form.id}"]`) : null);

            if (submitBtn) {
                submitBtn.innerText = 'Sending...';
                submitBtn.disabled = true;

                // Determine target page: contact form goes to thank-you.html, others to confirmation.html
                const targetPage = form.id === 'contact-form' ? 'thank-you.html' : 'confirmation.html';

                // Simulate a brief processing delay then redirect to the respective success page
                setTimeout(() => {
                    window.location.href = targetPage;
                }, 1200);
            }
        });
    });

    // FAQ Accordion Toggle
    document.querySelectorAll('.faq-toggle').forEach(button => {
        button.addEventListener('click', () => {
            button.parentElement.classList.toggle('active');
        });
    });
});