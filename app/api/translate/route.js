const apiBaseUrl = process.env.LIBRETRANSLATE_API_URL || 'https://libretranslate.com';
const apiKey = process.env.LIBRETRANSLATE_API_KEY;

export async function POST(request) {
  const payload = await request.json();

  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(apiKey ? { ...payload, api_key: apiKey } : payload),
  });

  const data = await response.json().catch(() => ({}));

  return Response.json(data, { status: response.status });
}
