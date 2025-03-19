
export const setupFadeInObserver = () => {
  try {
    const observerCallback = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };
    
    const observerOptions = {
      threshold: 0.2  // When at least 20% of the element is visible
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Get all fade-in-section elements
    const fadeElems = document.querySelectorAll('.fade-in-section');
    fadeElems.forEach(elem => {
      observer.observe(elem);
    });
    
    return observer;
  } catch (error) {
    console.error("Error setting up fade-in observer:", error);
    return null;
  }
};
