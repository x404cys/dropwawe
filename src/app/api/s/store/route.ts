import { prisma } from '@/app/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const subdomain = searchParams.get('subdomain');

  if (!subdomain) {
    return Response.json({ error: 'subdomain required' }, { status: 400 });
  }

  const store = await prisma.store.findUnique({
    where: { subLink: subdomain },
  });

  if (!store) {
    return Response.json({ error: 'not found' }, { status: 404 });
  }

  const template = await prisma.storeTemplate.findUnique({
    where: { storeId: store.id },
    include: {
      services: {
        orderBy: { order: 'asc' },
        include: {
          works: {
            orderBy: { order: 'asc' },
          },
        },
      },
      testimonials: { orderBy: { order: 'asc' } },
      bannerImages: { orderBy: { order: 'asc' } },
      categorySections: { orderBy: { order: 'asc' } },
      heroButtons: { orderBy: { order: 'asc' } },
      categoryIcons: true,
      customFonts: true,
      heroSection: {
        include: {
          stats: { orderBy: { order: 'asc' } },
          features: { orderBy: { order: 'asc' } },
          trustItems: { orderBy: { order: 'asc' } },
          badges: { orderBy: { order: 'asc' } },
          socials: { orderBy: { order: 'asc' } },
        },
      },
    },
  });

  const normalizedTemplate = template
    ? {
        ...template,
        heroButtons: template.heroButtons ?? [],
        heroSection: template.heroSection
          ? {
              ...template.heroSection,
              heroButtons: template.heroButtons ?? [],
            }
          : null,
      }
    : null;

  return Response.json({
    store,
    template: normalizedTemplate,
  });
}
