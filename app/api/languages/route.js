import { fallbackLanguages, fetchLibreTranslate } from '../_lib/libretranslate';

export async function GET() {
  try {
    const { data } = await fetchLibreTranslate('/languages', {
      next: { revalidate: 3600 },
    });

    return Response.json(Array.isArray(data) ? data : fallbackLanguages);
  } catch {
    return Response.json(fallbackLanguages);
  }
}
