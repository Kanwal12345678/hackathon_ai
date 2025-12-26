import React, { useEffect } from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';

export default function MobileTextbookHandler() {
  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) {
      return;
    }

    // Function to check if we're on mobile view
    function isMobile() {
      return window.innerWidth < 997;
    }

    // Function to handle textbook link clicks
    function handleTextbookLinkClick(e) {
      if (isMobile() && window.toggleMobileTextbookSidebar) {
        e.preventDefault();
        e.stopPropagation();
        window.toggleMobileTextbookSidebar();
      }
    }

    // Function to update textbook link behavior
    function updateTextbookLinkBehavior() {
      const textbookLinks = document.querySelectorAll('nav a, nav [role="button"], nav button');

      textbookLinks.forEach(link => {
        const textContent = link.textContent || link.innerText || '';
        if (textContent.trim() === 'Textbook') {
          // Remove existing listeners to avoid duplicates
          link.removeEventListener('click', handleTextbookLinkClick);
          // Add the new click handler
          link.addEventListener('click', handleTextbookLinkClick);

          // Store original href to potentially restore on desktop
          if (!link.dataset.originalHref) {
            link.dataset.originalHref = link.href || link.getAttribute('href') || '';
          }
        }
      });
    }

    // Update behavior when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', updateTextbookLinkBehavior);
    } else {
      updateTextbookLinkBehavior();
    }

    // Update behavior when window resizes (mobile/desktop switch)
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateTextbookLinkBehavior, 100);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return null;
}