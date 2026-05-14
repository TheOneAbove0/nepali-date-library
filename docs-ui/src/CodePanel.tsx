import { Check, Clipboard, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

export function CodePanel({ code }: { code: string }) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  const copy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API is not available in this browser context.');
      }

      await navigator.clipboard.writeText(code);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1000);
    } catch {
      // Copy failures should be visible to the user instead of failing silently.
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 1600);
    }
  };

  return (
    <div className="codePanel">
      <div className="codePanelHead">
        <span>TS Demo.tsx</span>
        <button
          aria-label={copyState === 'error' ? 'Copy failed' : 'Copy code'}
          onClick={copy}
          title={copyState === 'error' ? 'Clipboard copy failed' : 'Copy code'}
          type="button"
        >
          {copyState === 'copied' ? (
            <Check size={15} />
          ) : copyState === 'error' ? (
            <TriangleAlert size={15} />
          ) : (
            <Clipboard size={15} />
          )}
        </button>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
