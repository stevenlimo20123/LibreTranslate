import {
  buildLibreTranslatePayload,
  getApiBaseUrl,
  normalizeLibreTranslateError,
} from '../_lib/libretranslate';

export async function POST(request) {
  const payload = await request.json();

  const response = await fetch(`${getApiBaseUrl()}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildLibreTranslatePayload(payload)),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    return Response.json({ error: normalizeLibreTranslateError(data) }, { status: response.status });
  }

  return Response.json(data, { status: response.status });
}
