
/**
 * Sets up Intersection Observer to add animations when elements come into view
 * @param {Object} options - Configuration options
 * @param {string} options.selector - CSS selector for elements to observe
 * @param {string} options.visibleClass - Class to add when element is visible
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {number} options.rootMargin - Root margin value (e.g. "0px 0px -100px 0px")
 */
export const setupFadeInObserver = (options = {}) => {
  const {
    selector = '.fade-in-section',
    visibleClass = 'is-visible',
    threshold = 0.2,
    rootMargin = '0px 0px -50px 0px'
  } = options;
  
  const elements = document.querySelectorAll(selector);
  
  if (!elements.length) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add(visibleClass);
        // Optional: Stop observing the element after it's visible
        // observer.unobserve(entry.target);
      } else {
        // Optional: Remove the class when element is out of view
        // entry.target.classList.remove(visibleClass);
      }
    });
  }, {
    threshold,
    rootMargin
  });
  
  elements.forEach(element => {
    observer.observe(element);
  });
  
  return observer;
};

/**
 * Sets up a delay cascade for elements to create a sequence effect
 * @param {string} selector - CSS selector for parent container
 * @param {string} childSelector - CSS selector for children to animate
 * @param {number} delayStep - Delay in ms between each element
 */
export const setupCascadeAnimation = (selector, childSelector, delayStep = 100) => {
  const container = document.querySelector(selector);
  if (!container) return;
  
  const children = container.querySelectorAll(childSelector);
  
  children.forEach((child, index) => {
    child.style.transitionDelay = `${index * delayStep}ms`;
  });
};
