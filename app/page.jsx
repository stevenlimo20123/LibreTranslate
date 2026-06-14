'use client';

import { useEffect, useMemo, useState } from 'react';

const fallbackLanguages = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
];

export default function Home() {
  const [languages, setLanguages] = useState(fallbackLanguages);
  const [source, setSource] = useState('auto');
  const [target, setTarget] = useState('en');
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [status, setStatus] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch('/api/languages')
      .then((response) => (response.ok ? response.json() : Promise.reject(response)))
      .then((data) => {
        if (!isMounted || !Array.isArray(data)) return;
        setLanguages([{ code: 'auto', name: 'Auto Detect' }, ...data]);
      })
      .catch(() => {
        if (isMounted) setStatus('Using default language list. Configure LIBRETRANSLATE_API_URL if needed.');
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const targetLanguages = useMemo(
    () => languages.filter((language) => language.code !== 'auto'),
    [languages],
  );

  async function translate(event) {
    event.preventDefault();
    setStatus('');
    setTranslatedText('');

    if (!text.trim()) {
      setStatus('Enter text to translate.');
      return;
    }

    setIsTranslating(true);

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source, target, format: 'text' }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Translation failed.');
      }

      setTranslatedText(data.translatedText || '');
    } catch (error) {
      setStatus(error.message);
    } finally {
      setIsTranslating(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">Dokploy-ready Next.js app</p>
        <h1>LibreTranslate</h1>
        <p className="subtitle">
          Deploy this Next.js interface and point it at any LibreTranslate-compatible API with
          <code>LIBRETRANSLATE_API_URL</code>.
        </p>
      </section>

      <form className="translator-card" onSubmit={translate}>
        <div className="language-row">
          <label>
            Source
            <select value={source} onChange={(event) => setSource(event.target.value)}>
              {languages.map((language) => (
                <option key={language.code} value={language.code}>{language.name}</option>
              ))}
            </select>
          </label>

          <label>
            Target
            <select value={target} onChange={(event) => setTarget(event.target.value)}>
              {targetLanguages.map((language) => (
                <option key={language.code} value={language.code}>{language.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          Text to translate
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Type or paste text here..."
            rows={8}
          />
        </label>

        <button type="submit" disabled={isTranslating}>
          {isTranslating ? 'Translating…' : 'Translate'}
        </button>

        {status ? <p className="status">{status}</p> : null}

        <section className="result" aria-live="polite">
          <h2>Result</h2>
          <p>{translatedText || 'Your translation will appear here.'}</p>
        </section>
      </form>
    </main>
  );
}
