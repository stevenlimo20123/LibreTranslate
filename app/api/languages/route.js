const apiBaseUrl = process.env.LIBRETRANSLATE_API_URL || 'https://libretranslate.com';

export async function GET() {
  const response = await fetch(`${apiBaseUrl.replace(/\/$/, '')}/languages`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json().catch(() => []);

  return Response.json(data, { status: response.status });
}
