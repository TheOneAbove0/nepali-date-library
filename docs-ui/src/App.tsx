import { Fragment } from 'react';
import { CalendarDays, Moon, Sun } from 'lucide-react';
import { DocsSection } from './DocsSection';
import { sections } from './docsData';
import { playgroundTabs } from './playgroundConfig';
import { useActiveDocsSection } from './useActiveDocsSection';
import { useDocsTheme } from './useDocsTheme';
import { NumeralSystemProvider, useNumeralSystem } from './NumeralSystemContext';
import './styles.css';

function AppInner() {
  const { theme, setTheme } = useDocsTheme();
  const { activeSection, setActiveSection } = useActiveDocsSection(
    sections.map((section) => section.id),
  );
  const { numeralSystem, setNumeralSystem } = useNumeralSystem();

  const openPlaygroundTab = (tabId: string) => {
    setActiveSection('playground');
    document.getElementById('playground')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('playground-tab-change', { detail: tabId }));
  };

  return (
    <main className="docsShell" data-theme={theme}>
      <aside className="sidebar">
        <div className="sidebarBrand">
          <CalendarDays size={18} />
          <span>Nepali React Datepicker</span>
        </div>
        <div className="sidebarGroupTitle">Documentation</div>
        <nav>
          {sections.map((section) => (
            <Fragment key={section.id}>
              <a
                className={section.id === activeSection ? 'active' : undefined}
                href={`#${section.id}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.title}
              </a>
              {section.id === 'playground' &&
                playgroundTabs.map((tab) => (
                  <a
                    className="sidebarSub"
                    href="#playground"
                    key={tab.id}
                    onClick={(e) => {
                      e.preventDefault();
                      openPlaygroundTab(tab.id);
                    }}
                  >
                    {tab.label}
                  </a>
                ))}
            </Fragment>
          ))}
        </nav>
      </aside>

      <section className="content">
        <header className="pageHeader">
          <div>
            <h1>Nepali React Datepicker</h1>
            <p className="lede">
              Day, month, year, time, and date-range pickers for Bikram Sambat interfaces.
              Lightweight, composable, and fully styleable.
            </p>
          </div>
          <div className="headerActions">
            <button
              aria-label={`Switch numerals to ${numeralSystem === 'nepali' ? 'Latin (English)' : 'Nepali (देवनागरी)'}`}
              className="numeralToggle"
              onClick={() =>
                setNumeralSystem(numeralSystem === 'nepali' ? 'latin' : 'nepali')
              }
              title={`Currently: ${numeralSystem === 'nepali' ? 'नेपाली' : 'English'} numerals`}
              type="button"
            >
              <span className="numeralToggleLabel">
                {numeralSystem === 'nepali' ? 'क' : 'A'}
              </span>
              <span className="numeralToggleHint">
                {numeralSystem === 'nepali' ? 'नेपाली' : 'English'}
              </span>
            </button>
            <button
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="themeToggle"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              type="button"
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
            </button>
          </div>
        </header>

        {sections.map((section) => (
          <DocsSection key={section.id} section={section} />
        ))}
      </section>
    </main>
  );
}

export function App() {
  return (
    <NumeralSystemProvider>
      <AppInner />
    </NumeralSystemProvider>
  );
}
