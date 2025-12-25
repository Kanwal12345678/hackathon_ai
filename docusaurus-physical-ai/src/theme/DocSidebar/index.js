import React, { useState, useEffect } from 'react';
import OriginalDocSidebar from '@theme-original/DocSidebar';
import styles from './styles.module.css';

// Mobile-friendly DocSidebar component
export default function DocSidebarWrapper(props) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Check if we're on mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 997);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Toggle accordion for mobile
  const toggleAccordion = (index) => {
    if (isMobile) {
      setActiveAccordion(activeAccordion === index ? null : index);
    }
  };

  // Toggle mobile sidebar visibility
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileSidebarOpen && !event.target.closest(`.${styles.sidebarContainer}`)) {
        setIsMobileSidebarOpen(false);
      }
    };

    if (isMobileSidebarOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  // Determine if we should show mobile sidebar
  const shouldShowMobile = isMobile && isMobileSidebarOpen;

  // For mobile, use custom accordion sidebar
  const { sidebar, sidebarName } = props;

  return (
    <>
      {/* Mobile sidebar overlay */}
      {shouldShowMobile && (
        <div
          className={`${styles.sidebarContainer} ${styles.open}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.sidebarHeader}>
            <h2 className={styles.sidebarTitle}>
              {sidebarName || 'Textbook Chapters'}
            </h2>
            <button
              className={styles.closeButton}
              onClick={toggleMobileSidebar}
              aria-label="Close sidebar"
            >
              ×
            </button>
          </div>

          <div className={styles.accordionList}>
            {sidebar.map((item, index) => (
              <div key={index} className={styles.accordionItem}>
                <button
                  className={`${styles.accordionHeader} ${
                    activeAccordion === index ? styles.active : ''
                  }`}
                  onClick={() => toggleAccordion(index)}
                  aria-expanded={activeAccordion === index}
                  aria-controls={`accordion-content-${index}`}
                >
                  <span>{item.label || item.title}</span>
                  <span
                    className={`${styles.accordionIcon} ${
                      activeAccordion === index ? styles.open : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                <div
                  id={`accordion-content-${index}`}
                  className={`${styles.accordionContent} ${
                    activeAccordion === index ? styles.open : ''
                  }`}
                >
                  <div className={styles.accordionContentInner}>
                    {item.type === 'category' && item.items && (
                      <ul>
                        {item.items.map((subItem, subIndex) => {
                          let href = '';
                          if (subItem.type === 'doc') {
                            href = `/${subItem.id}`;
                          } else if (typeof subItem === 'string') {
                            href = `/${subItem}`;
                          }

                          return (
                            <li key={subIndex}>
                              <a
                                href={href}
                                className={`${styles.lessonLink} ${
                                  props.activeDoc?.slug === subItem.id ? styles.active : ''
                                }`}
                                onClick={() => setIsMobileSidebarOpen(false)}
                              >
                                {subItem.label || subItem}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile menu button to open sidebar */}
      {isMobile && (
        <button
          className="button button--secondary button--sm"
          onClick={toggleMobileSidebar}
          style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            zIndex: 999,
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(236, 72, 153, 0.2)',
            color: '#f472b6',
          }}
          aria-label="Open textbook chapters"
        >
          📚 Chapters
        </button>
      )}

      {/* Render original sidebar for desktop view */}
      {!isMobile && <OriginalDocSidebar {...props} />}
    </>
  );
}