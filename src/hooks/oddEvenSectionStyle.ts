// hooks/useSectionStyles.ts

import { useEffect } from 'react';

const useSectionStyles = () => {
  useEffect(() => {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
      if (index % 2 === 0) {
        section.classList.add('section-odd');
      } else {
        section.classList.add('section-even');
      }
    });
  }, []);
};

export default useSectionStyles;