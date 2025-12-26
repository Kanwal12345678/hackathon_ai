import React, { useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import { useLocation } from '@docusaurus/router';

export default function SmoothScrollHandler() {
  const location = useLocation();

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    // Function to handle smooth scrolling to anchor
    const handleSmoothScroll = (targetId) => {
      // Close mobile navbar if it's open
      const mobileToggles = document.querySelectorAll('.navbar__toggle, .navbar-sidebar__close');
      mobileToggles.forEach(toggle => {
        if (toggle.getAttribute('aria-expanded') === 'true') {
          toggle.click(); // Close the mobile menu if it's open
        }
      });

      // Small delay to ensure menu is closed before scrolling
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          // Scroll to the target element with smooth behavior
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    };

    // Check for anchor in URL and scroll to it
    const scrollToAnchor = () => {
      const hash = window.location.hash;
      if (hash && hash === '#textbook-chapters') {
        // Scroll to the target element after a short delay to ensure content is loaded
        setTimeout(() => {
          handleSmoothScroll('textbook-chapters');
        }, 100);
      }
    };

    // Run when location changes (route changes)
    scrollToAnchor();

    // Set up a MutationObserver to handle dynamic content updates
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // Check if new content includes elements we need to handle
          const anchorLinks = document.querySelectorAll('a[href*="#textbook-chapters"]');
          anchorLinks.forEach(link => {
            // Add click handler to anchor links
            const handleClick = (e) => {
              e.preventDefault();
              handleSmoothScroll('textbook-chapters');
            };

            link.removeEventListener('click', handleClick);
            link.addEventListener('click', handleClick);
          });
        }
      });
    });

    // Start observing
    if (document.body) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    // Also check for clicks on elements that might trigger the scroll
    const handleClick = (e) => {
      const target = e.target.closest('a');
      if (target) {
        const href = target.getAttribute('href');
        const textContent = target.textContent || target.innerText || '';

        // Handle textbook-related links
        if (href && (href === '#textbook-chapters' || href.includes('#textbook-chapters'))) {
          e.preventDefault();
          handleSmoothScroll('textbook-chapters');
        }
        // Handle the navbar "Textbook" link specifically
        else if (textContent.trim() === 'Textbook' && (href === '/docs/index' || href.includes('/docs') || href === '/')) {
          // If we're on the homepage, scroll to the textbook section
          if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            e.preventDefault();
            handleSmoothScroll('textbook-chapters');
          }
        }
      }
    };

    document.addEventListener('click', handleClick);

    // Clean up
    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleClick);
    };
  }, [location]);

  return null;
}