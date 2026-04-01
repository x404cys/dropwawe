import { prisma } from '@/app/lib/db';
import { isVisitEntityType, isVisitPageType } from '@/lib/visitor-tracking';
import { getVisitorSchemaSupport } from '@/server/utils/visitor-schema-support';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);

  const createRowId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  };

  const normalizeString = (value: unknown) => {
    if (typeof value !== 'string') return null;

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  };

  const visitorId = normalizeString(body?.visitorId);
  const storeName = normalizeString(body?.storeName) ?? normalizeString(body?.path);
  const path = normalizeString(body?.path) ?? '/';
  const referrer = normalizeString(body?.referrer);
  const pageType = isVisitPageType(body?.pageType) ? body.pageType : 'STORE_HOME';
  const entityType = isVisitEntityType(body?.entityType) ? body.entityType : null;
  const entityId = normalizeString(body?.entityId);
  const entityName = normalizeString(body?.entityName);

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';
  const schemaSupport = await getVisitorSchemaSupport();
  const rowId = createRowId();
  const effectiveVisitorId =
    schemaSupport.visitorIdUnique && visitorId ? `${visitorId}:${rowId}` : visitorId;

  if (!effectiveVisitorId || !storeName) {
    return NextResponse.json({ error: 'Missing visitorId or storeName' }, { status: 400 });
  }

  if (schemaSupport.enhancedColumns) {
    if (schemaSupport.visitorIdUnique) {
      await prisma.$executeRaw`
        INSERT INTO "Visitor" (
          "id",
          "visitorId",
          "ip",
          "userAgent",
          "storeName",
          "path",
          "pageType",
          "entityType",
          "entityId",
          "entityName",
          "referrer"
        )
        VALUES (
          ${rowId},
          ${effectiveVisitorId},
          ${ip},
          ${userAgent},
          ${storeName},
          ${path},
          ${pageType},
          ${entityType},
          ${entityId},
          ${entityName},
          ${referrer}
        )
        ON CONFLICT ("visitorId")
        DO UPDATE SET
          "ip" = EXCLUDED."ip",
          "userAgent" = EXCLUDED."userAgent",
          "storeName" = EXCLUDED."storeName",
          "path" = EXCLUDED."path",
          "pageType" = EXCLUDED."pageType",
          "entityType" = EXCLUDED."entityType",
          "entityId" = EXCLUDED."entityId",
          "entityName" = EXCLUDED."entityName",
          "referrer" = EXCLUDED."referrer",
          "createdAt" = CURRENT_TIMESTAMP
      `;
    } else {
      await prisma.$executeRaw`
        INSERT INTO "Visitor" (
          "id",
          "visitorId",
          "ip",
          "userAgent",
          "storeName",
          "path",
          "pageType",
          "entityType",
          "entityId",
          "entityName",
          "referrer"
        )
        VALUES (
          ${rowId},
          ${effectiveVisitorId},
          ${ip},  
          ${userAgent},
          ${storeName},
          ${path},
          ${pageType},
          ${entityType},
          ${entityId},
          ${entityName},
          ${referrer}
        )
      `;
    }
  } else if (schemaSupport.visitorIdUnique) {
    await prisma.$executeRaw`
      INSERT INTO "Visitor" (
        "id",
        "visitorId",
        "ip",
        "userAgent",
        "storeName",
        "referrer"
      )
      VALUES (
        ${rowId},
        ${effectiveVisitorId},
        ${ip},
        ${userAgent},
        ${storeName},
        ${referrer}
      )
      ON CONFLICT ("visitorId")
      DO UPDATE SET
        "ip" = EXCLUDED."ip",
        "userAgent" = EXCLUDED."userAgent",
        "storeName" = EXCLUDED."storeName",
        "referrer" = EXCLUDED."referrer",
        "createdAt" = CURRENT_TIMESTAMP
    `;
  } else {
    await prisma.visitor.create({
      data: {
        id: rowId,
        visitorId: effectiveVisitorId,
        ip,
        userAgent,
        storeName,
        referrer,
      },
    });
  }

  return NextResponse.json({ status: 'created' });
}
