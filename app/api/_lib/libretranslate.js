export const defaultApiBaseUrl = 'https://translate.argosopentech.com';

export function getApiBaseUrl() {
  return (process.env.LIBRETRANSLATE_API_URL || defaultApiBaseUrl).replace(/\/$/, '');
}

export function getApiKey() {
  return process.env.LIBRETRANSLATE_API_KEY || '';
}

export function buildLibreTranslatePayload(payload) {
  const apiKey = getApiKey();
  return apiKey ? { ...payload, api_key: apiKey } : payload;
}

export function normalizeLibreTranslateError(data, fallback = 'Translation failed.') {
  const message = data?.error || data?.message || fallback;

  if (/api key/i.test(message)) {
    return 'This translation server requires an API key. Set LIBRETRANSLATE_API_URL to a no-key LibreTranslate server or provide LIBRETRANSLATE_API_KEY.';
  }

  return message;
}
