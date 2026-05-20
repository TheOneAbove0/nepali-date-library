import type { DocSection } from './docsData';
import { useEffect, useState } from 'react';
import { CodePanel } from './CodePanel';

export function DocsSection({ section }: { section: DocSection }) {
  const Demo = section.Demo;
  const [liveCode, setLiveCode] = useState(section.code ?? '');

  useEffect(() => {
    setLiveCode(section.code ?? '');
  }, [section.code, section.id]);

  return (
    <section className="docsSection" id={section.id}>
      <div className="sectionIntro">
        <h2>{section.title}</h2>
        <p>{section.summary}</p>
      </div>

      {Demo && section.bare ? (
        <Demo onCodeChange={setLiveCode} />
      ) : Demo ? (
        <div className="sectionCard">
          <div className="demoStage">
            <Demo onCodeChange={setLiveCode} />
          </div>
          {section.code && <CodePanel code={liveCode || section.code} />}
        </div>
      ) : null}

      {section.content}
    </section>
  );
}
