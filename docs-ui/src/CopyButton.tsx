import { Check, Clipboard, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

type CopyState = 'idle' | 'copied' | 'error';

export function CopyButton({ text }: { text: string }) {
  const [state, setState] = useState<CopyState>('idle');

  const copy = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard API unavailable');
      }
      await navigator.clipboard.writeText(text);
      setState('copied');
      window.setTimeout(() => setState('idle'), 1200);
    } catch {
      setState('error');
      window.setTimeout(() => setState('idle'), 1600);
    }
  };

  return (
    <button
      aria-label={state === 'error' ? 'Copy failed' : 'Copy'}
      className="copyBtn"
      onClick={copy}
      type="button"
    >
      {state === 'copied' ? (
        <Check size={14} />
      ) : state === 'error' ? (
        <TriangleAlert size={14} />
      ) : (
        <Clipboard size={14} />
      )}
    </button>
  );
}
