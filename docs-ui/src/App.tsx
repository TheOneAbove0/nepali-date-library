import { CalendarDays, Code2, Moon, PackageCheck, Sun, Check } from 'lucide-react';
import { formatBsDateNepali } from 'nepali-date-library';
import { DocsSection } from './DocsSection';
import { sections } from './docsData';
import { sampleAd, sampleBs } from './docsShared';
import { useActiveDocsSection } from './useActiveDocsSection';
import { useDocsTheme } from './useDocsTheme';
import './styles.css';

export function App() {
  const { theme, setTheme } = useDocsTheme();
  const { activeSection, setActiveSection } = useActiveDocsSection(sections.map((section) => section.id));

  return (
    <main className="docsShell" data-theme={theme}>
      <aside className="sidebar">
        <div className="sidebarBrand">
          <CalendarDays size={18} />
          <span>Nepali React Datepicker</span>
        </div>
        <div className="sidebarGroupTitle">Dates</div>
        <nav>
          {sections.map((section) => (
            <a
              className={section.id === activeSection ? 'active' : undefined}
              href={`#${section.id}`}
              key={section.id}
              onClick={() => setActiveSection(section.id)}
            >
              {section.title}
            </a>
          ))}
        </nav>
      </aside>

      <section className="content">
        <header className="pageHeader">
          <div>
            <p className="eyebrow">Crafted for Bikram Sambat interfaces</p>
            <h1>Dates</h1>
            <p className="lede">
              Simple day, month, and year pickers for BS date workflows. The calendar engine stays shared, while the docs
              now focus on quieter inputs, cleaner dropdowns, and more breathing room.
            </p>
          </div>
          <div className="headerMeta">
            <span><PackageCheck size={14} /> React package</span>
            <span><Check size={14} /> Day, month, year pickers</span>
            <span><Code2 size={14} /> Styling API documented</span>
            <button
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              className="themeToggle"
              onClick={() => setTheme((current) => (current === 'light' ? 'dark' : 'light'))}
              type="button"
            >
              {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
              <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </button>
          </div>
        </header>

        <section className="heroStats">
          <article>
            <span>Gregorian sample</span>
            <strong>{sampleAd}</strong>
          </article>
          <article>
            <span>BS sample</span>
            <strong>{formatBsDateNepali(sampleBs)}</strong>
          </article>
          <article>
            <span>Current focus</span>
            <strong>Cleaner input + dropdown</strong>
          </article>
        </section>

        {sections.map((section) => (
          <DocsSection key={section.id} section={section} />
        ))}
      </section>
    </main>
  );
}
