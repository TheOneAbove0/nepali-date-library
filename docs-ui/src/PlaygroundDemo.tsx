import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { playgroundTabs, type PlaygroundTab } from './playgroundConfig';
import { CodePanel } from './CodePanel';
import { useNumeralSystem } from './NumeralSystemContext';

/* ------------------------------------------------------------------ */
/*  Tab content — remounts on tab change so useState resets correctly  */
/* ------------------------------------------------------------------ */

function PlaygroundTabContent({ tab }: { tab: PlaygroundTab }) {
  const [value, setValue] = useState(tab.defaultValue);
  const { numeralSystem } = useNumeralSystem();

  return (
    <>
      <div className="playgroundPreview">
        <p className="playgroundDesc">{tab.description}</p>

        <div className="playgroundDemoArea">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {tab.render(value as never, setValue as any, numeralSystem)}
        </div>

        <div className="playgroundValue">
          <span className="playgroundValueLabel">Value</span>
          <span className="playgroundValueType">{tab.valueType}</span>
          <code className="playgroundValueCode">{tab.formatValue(value as never)}</code>
        </div>
      </div>

      <CodePanel code={tab.code} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Scrollable tab bar with fade indicators                            */
/* ------------------------------------------------------------------ */

function useScrollFade(ref: React.RefObject<HTMLDivElement | null>) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      ro.disconnect();
    };
  }, [ref, update]);

  return { canScrollLeft, canScrollRight };
}

/* ------------------------------------------------------------------ */
/*  Playground — tabbed container                                      */
/* ------------------------------------------------------------------ */

export function PlaygroundDemo() {
  const [activeTab, setActiveTab] = useState(playgroundTabs[0].id);
  const tab = playgroundTabs.find((t) => t.id === activeTab) ?? playgroundTabs[0];
  const scrollRef = useRef<HTMLDivElement>(null);
  const { canScrollLeft, canScrollRight } = useScrollFade(scrollRef);

  /* Listen for sidebar tab-change events */
  useEffect(() => {
    const handler = (e: Event) => {
      const tabId = (e as CustomEvent<string>).detail;
      if (playgroundTabs.some((t) => t.id === tabId)) {
        setActiveTab(tabId);
        /* Scroll the clicked tab into view inside the tab bar */
        requestAnimationFrame(() => {
          scrollRef.current
            ?.querySelector<HTMLElement>('.playgroundTab.is-active')
            ?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        });
      }
    };
    window.addEventListener('playground-tab-change', handler);
    return () => window.removeEventListener('playground-tab-change', handler);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: direction === 'left' ? -200 : 200,
      behavior: 'smooth',
    });
  };

  return (
    <div className="playground">
      <div className="playgroundTabBarWrap">
        {canScrollLeft && (
          <button
            aria-label="Scroll tabs left"
            className="playgroundTabArrow playgroundTabArrow--left"
            onClick={() => scroll('left')}
            type="button"
          >
            <ChevronLeft size={14} />
          </button>
        )}

        <div className="playgroundTabBar" ref={scrollRef}>
          {playgroundTabs.map((t) => (
            <button
              className={`playgroundTab${t.id === activeTab ? ' is-active' : ''}`}
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <button
            aria-label="Scroll tabs right"
            className="playgroundTabArrow playgroundTabArrow--right"
            onClick={() => scroll('right')}
            type="button"
          >
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* key forces remount → useState resets per tab */}
      <PlaygroundTabContent key={tab.id} tab={tab} />
    </div>
  );
}
