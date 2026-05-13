import { useEffect, useRef, useState } from 'react';

export function useActiveDocsSection(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState(sectionIds[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        let nextId = activeSection;
        let maxRatio = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= maxRatio) {
            maxRatio = entry.intersectionRatio;
            nextId = (entry.target as HTMLElement).id;
          }
        });

        if (nextId !== activeSection) {
          setActiveSection(nextId);
        }
      },
      {
        threshold: [0.2, 0.4, 0.6, 0.8],
        rootMargin: '-80px 0px -45% 0px',
      },
    );

    sectionIds.forEach((sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        observerRef.current?.observe(element);
      }
    });

    return () => observerRef.current?.disconnect();
  }, [activeSection, sectionIds]);

  return { activeSection, setActiveSection };
}
