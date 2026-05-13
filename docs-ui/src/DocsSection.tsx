import type { DocSection } from './docsData';
import { CodePanel } from './CodePanel';

export function DocsSection({ section }: { section: DocSection }) {
  const Demo = section.Demo;

  return (
    <section className="docsSection" id={section.id}>
      <div className="sectionIntro">
        <h2>{section.title}</h2>
        <p>{section.summary}</p>
      </div>

      {section.content}

      {Demo && (
        <div className="sectionCard">
          <div className="demoStage">
            <Demo />
          </div>
          {section.code && <CodePanel code={section.code} />}
        </div>
      )}
    </section>
  );
}
