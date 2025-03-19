
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
      threshold: 0.1  // Lower threshold to make animations trigger earlier
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Get all fade-in-section elements
    const fadeElems = document.querySelectorAll('.fade-in-section');
    fadeElems.forEach(elem => {
      observer.observe(elem);
    });
    
    // Also observe result container specifically
    const resultContainers = document.querySelectorAll('.result-container');
    resultContainers.forEach(elem => {
      observer.observe(elem);
    });
    
    return observer;
  } catch (error) {
    console.error("Error setting up fade-in observer:", error);
    return null;
  }
};

// Function to specifically observe the results section
export const observeResultsSection = () => {
  try {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) return null;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    
    observer.observe(resultsSection);
    return observer;
  } catch (error) {
    console.error("Error setting up results observer:", error);
    return null;
  }
};
