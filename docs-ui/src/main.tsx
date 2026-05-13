import { CalendarDays, CheckCircle2, Code2, Gauge, GitCompareArrows, Layers3, PackageCheck, ShieldCheck } from 'lucide-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { generateMonthGrid, parseAdDate, toBik_euro, toGreg_text } from 'nepali-date-library';
import { NepaliDatePicker } from 'nepali-date-library-react';
import './styles.css';

const sampleAd = '2026-05-13';
const sampleBs = toBik_euro(sampleAd);
const grid = generateMonthGrid(2083, 1, {
  selectedDate: sampleBs,
  focusedDate: sampleBs,
  today: sampleBs,
});

const packages = [
  ['Core', 'Typed BS/AD conversion, parsers, validators, and datepicker state engine.', 'nepali-date-library'],
  ['Vanilla', 'Framework-free DOM adapter with CSS Grid styling and keyboard navigation.', 'nepali-date-library-vanilla'],
  ['React', 'A thin component and hook around the shared datepicker core.', 'nepali-date-library-react'],
  ['Vue', 'A Vue 3 component and composable using the same state engine.', 'nepali-date-library-vue'],
];

const apiRows = [
  ['parseAdDate()', JSON.stringify(parseAdDate(sampleAd))],
  ['toBik_euro()', sampleBs],
  ['toGreg_text()', toGreg_text(2083, 1, 30)],
];

function App() {
  return (
    <main>
      <aside className="rail">
        <a href="#packages">Packages</a>
        <a href="#quickstart">Quickstart</a>
        <a href="#datepicker">Datepicker</a>
        <a href="#accuracy">Accuracy</a>
      </aside>

      <section className="hero">
        <div className="heroCopy">
          <span className="eyebrow"><PackageCheck size={16} /> Modern BS date tooling</span>
          <h1>Nepali Date Library</h1>
          <p>Typed conversion, framework wrappers, and a rendering-independent datepicker core for Nepali calendar interfaces.</p>
        </div>
        <div className="heroPanel" aria-label="Conversion sample">
          <div>
            <span>Gregorian</span>
            <strong>{sampleAd}</strong>
          </div>
          <GitCompareArrows size={24} />
          <div>
            <span>Nepali BS</span>
            <strong>{sampleBs}</strong>
          </div>
        </div>
      </section>

      <section id="packages" className="band">
        <div className="sectionHead">
          <Layers3 size={22} />
          <h2>Package Surface</h2>
        </div>
        <div className="packageGrid">
          {packages.map(([name, text, install]) => (
            <article className="packageCard" key={name}>
              <h3>{name}</h3>
              <p>{text}</p>
              <code>npm i {install}</code>
            </article>
          ))}
        </div>
      </section>

      <section id="quickstart" className="split">
        <div>
          <div className="sectionHead">
            <Code2 size={22} />
            <h2>Quickstart</h2>
          </div>
          <pre>{`import { toBik_euro, parseBsDate } from 'nepali-date-library';
import { addBsDays } from 'nepali-date-library/manipulation';
import { formatBsDateNepali } from 'nepali-date-library/formatting';

const bs = toBik_euro('2026-05-13');
const parsed = parseBsDate('2083-01-30');
const next = addBsDays(parsed, 1);
const label = formatBsDateNepali(next);`}</pre>
        </div>
        <div className="apiTable">
          {apiRows.map(([name, value]) => (
            <div key={name}>
              <span>{name}</span>
              <code>{value}</code>
            </div>
          ))}
        </div>
      </section>

      <section id="datepicker" className="band">
        <div className="sectionHead">
          <CalendarDays size={22} />
          <h2>Datepicker Core</h2>
        </div>
        <div className="datepickerLayout">
          <div className="calendarGrid" aria-label="Month grid sample">
            {grid.weeks.flat().map((cell) => (
              <span
                key={`${cell.date.year}-${cell.date.month}-${cell.date.day}`}
                className={[
                  'day',
                  cell.inCurrentMonth ? 'current' : 'muted',
                  cell.isSelected ? 'selected' : '',
                  cell.isToday ? 'today' : '',
                ].join(' ')}
              >
                {cell.date.day}
              </span>
            ))}
          </div>
          <NepaliDatePicker defaultValue={sampleBs} min="2083-01-01" max="2083-12-30" />
        </div>
      </section>

      <section id="accuracy" className="split">
        <div>
          <div className="sectionHead">
            <ShieldCheck size={22} />
            <h2>Accuracy Workflow</h2>
          </div>
          <p>Reference checks are isolated from conversion code. Add verified pairs from official publications, licensed datasets, or documented public pages, then run the validation script before release.</p>
        </div>
        <div className="checks">
          {['Strict date parsers', 'Reference fixture validation', 'No undocumented scraping', 'Subpath exports for small bundles', 'No Java, Android, Bootstrap, or jQuery runtime'].map((item) => (
            <span key={item}><CheckCircle2 size={16} /> {item}</span>
          ))}
        </div>
      </section>

      <footer>
        <Gauge size={18} />
        <span>Docs UI is intentionally separate from package source so package builds stay small.</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
