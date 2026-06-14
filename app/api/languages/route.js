import { getApiBaseUrl } from '../_lib/libretranslate';

export async function GET() {
  const response = await fetch(`${getApiBaseUrl()}/languages`, {
    next: { revalidate: 3600 },
  });
  const data = await response.json().catch(() => []);

  return Response.json(data, { status: response.status });
}
