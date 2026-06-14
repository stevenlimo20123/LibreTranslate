import { fetchGoogleTranslateFallback, fetchLibreTranslate } from '../_lib/libretranslate';

export async function POST(request) {
  const payload = await request.json();

  try {
    const { data } = await fetchLibreTranslate('/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return Response.json(data);
  } catch {
    try {
      const data = await fetchGoogleTranslateFallback(payload);
      return Response.json(data);
    } catch (error) {
      return Response.json({ error: error.message || 'Translation failed.' }, { status: 502 });
    }
  }
}
