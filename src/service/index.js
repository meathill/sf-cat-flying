export const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const { target, isIntersecting, intersectionRatio } = entry;
      if (intersectionRatio < 0.9) {
        const event = new CustomEvent('hit', {
          bubbles: true,
          detail: {
            ratio: intersectionRatio,
            isIntersecting,
          },
        });
        target.dispatchEvent(event);
      }
    });
  },
  {
    threshold: 0.05,
  }
);
