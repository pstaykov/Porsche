// === ON DOM READY ===
document.addEventListener("DOMContentLoaded", () => {

  // === COUNT-UP ANIMATION FOR STATS ===
  const counters = document.querySelectorAll(".count");
  let countTriggered = false;

  // Animate a counter from its current value to the target
  function animateCount(el, target, duration = 1500) {
    const start = parseFloat(el.textContent);
    const isFloat = target.toString().includes(".");
    const startTime = performance.now();

    function update(currentTime) {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = start + (target - start) * progress;
      el.textContent = isFloat ? value.toFixed(1) : Math.floor(value);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  // Trigger counting when specs section is visible
  function handleCountUp() {
    if (countTriggered) return;

    const section = document.getElementById("specs");
    if (!section) return;

    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      counters.forEach(counter => {
        const target = parseFloat(counter.getAttribute("data-target"));
        animateCount(counter, target);
      });
      countTriggered = true;
    }
  }

  // === FLOATING EFFECT FOR ROAD IMAGES ===
  const floatingRoadImages = document.querySelectorAll(".floating-image");
  const imageStates = new Map();

  floatingRoadImages.forEach(el => {
    imageStates.set(el, { offset: 0, lastScrollY: window.scrollY });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.dataset.active = "true";
      } else {
        el.dataset.active = "false";
        el.style.transform = "translateY(0px)";
        imageStates.get(el).offset = 0;
      }
    });
  }, { threshold: 0.1 });

  floatingRoadImages.forEach(el => observer.observe(el));

  // === FLOATING EFFECT FOR HISTORY BOXES ===
  const floatingHistory = document.querySelectorAll(".floating-history");
  const floatStates = new Map();

  floatingHistory.forEach(el => {
    floatStates.set(el, { offset: 0, lastY: window.scrollY });
  });

  const historyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const el = entry.target;
      if (entry.isIntersecting) {
        el.dataset.active = "true";
      } else {
        el.dataset.active = "false";
        el.style.transform = "translateY(0px)";
        floatStates.get(el).offset = 0;
      }
    });
  }, { threshold: 0.1 });

  floatingHistory.forEach(el => historyObserver.observe(el));

  // === SCROLL EVENT HANDLER ===
  window.addEventListener("scroll", () => {
    handleCountUp();

    // Road images parallax effect
    floatingRoadImages.forEach(el => {
      if (el.dataset.active !== "true") return;

      const state = imageStates.get(el);
      const currentY = window.scrollY;
      const delta = currentY - state.lastScrollY;
      const newOffset = state.offset - delta * 0.3; // Adjust sensitivity here

      state.offset = Math.max(-30, Math.min(30, newOffset));
      el.style.transform = `translateY(${state.offset}px)`;

      state.lastScrollY = currentY;
    });

    // History images parallax effect
    floatingHistory.forEach(el => {
      if (el.dataset.active !== "true") return;

      const state = floatStates.get(el);
      const currentY = window.scrollY;
      const delta = currentY - state.lastY;
      state.offset = Math.max(-20, Math.min(20, state.offset - delta * 0.3));
      el.style.transform = `translateY(${state.offset}px)`;
      state.lastY = currentY;
    });
  });

  // Run counter on load in case already visible
  handleCountUp();

  // === BACKGROUND IMAGES FOR TRACK STATS ===
  document.querySelectorAll(".track-stat").forEach(el => {
    const bg = el.getAttribute("data-bg");
    if (bg) {
      el.style.backgroundImage = `url(${bg})`;
    }
  });

});
