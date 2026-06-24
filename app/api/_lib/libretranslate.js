export const fallbackLanguages = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'zh-TW', name: 'Chinese (traditional)' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
];

const defaultLibreTranslateEndpoints = [
  'https://translate.argosopentech.com',
  'https://libretranslate.de',
];

export function getLibreTranslateEndpoints() {
  const configuredEndpoint = process.env.LIBRETRANSLATE_API_URL;
  const endpoints = configuredEndpoint
    ? [configuredEndpoint, ...defaultLibreTranslateEndpoints]
    : defaultLibreTranslateEndpoints;

  return [...new Set(endpoints.map((endpoint) => endpoint.replace(/\/$/, '')))];
}

export async function fetchLibreTranslate(path, options) {
  let lastError;

  for (const endpoint of getLibreTranslateEndpoints()) {
    try {
      const response = await fetch(`${endpoint}${path}`, options);
      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return { data, response };
      }

      lastError = data?.error || data?.message || `Request failed with status ${response.status}.`;
    } catch (error) {
      lastError = error.message;
    }
  }

  throw new Error(lastError || 'Translation service is unavailable.');
}

function toGoogleLanguageCode(code) {
  if (!code || code === 'auto') return 'auto';
  if (code === 'zh') return 'zh-CN';
  if (code === 'zt' || code === 'zh_Hant') return 'zh-TW';
  return code.replace('_', '-');
}

export async function fetchGoogleTranslateFallback({ q, source, target }) {
  const params = new URLSearchParams({
    client: 'gtx',
    sl: toGoogleLanguageCode(source),
    tl: toGoogleLanguageCode(target),
    dt: 't',
    q,
  });

  const response = await fetch(`https://translate.googleapis.com/translate_a/single?${params}`);
  const data = await response.json();
  const translatedText = data?.[0]
    ?.map((translationPart) => translationPart?.[0])
    .filter(Boolean)
    .join('');

  if (!response.ok || !translatedText) {
    throw new Error('Translation service is unavailable.');
  }

  return { translatedText };
}
