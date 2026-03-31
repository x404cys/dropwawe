import { prisma } from '@/app/lib/db';

type VisitorSchemaSupport = {
  enhancedColumns: boolean;
  visitorIdUnique: boolean;
};

let visitorSchemaSupportPromise: Promise<VisitorSchemaSupport> | null = null;

async function loadVisitorSchemaSupport(): Promise<VisitorSchemaSupport> {
  try {
    const [columnRows, uniqueRows] = await Promise.all([
      prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = current_schema()
          AND table_name = 'Visitor'
          AND column_name IN ('path', 'pageType', 'entityType', 'entityId', 'entityName')
      `,
      prisma.$queryRaw<Array<{ constraint_name: string }>>`
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.constraint_column_usage ccu
          ON tc.constraint_name = ccu.constraint_name
         AND tc.table_schema = ccu.table_schema
        WHERE tc.table_schema = current_schema()
          AND tc.table_name = 'Visitor'
          AND tc.constraint_type = 'UNIQUE'
          AND ccu.column_name = 'visitorId'
      `,
    ]);

    const columnSet = new Set(columnRows.map(row => row.column_name));
    const enhancedColumns = ['path', 'pageType', 'entityType', 'entityId', 'entityName'].every(
      column => columnSet.has(column)
    );

    return {
      enhancedColumns,
      visitorIdUnique: uniqueRows.length > 0,
    };
  } catch {
    return {
      enhancedColumns: false,
      visitorIdUnique: false,
    };
  }
}

export function getVisitorSchemaSupport() {
  visitorSchemaSupportPromise ??= loadVisitorSchemaSupport();
  return visitorSchemaSupportPromise;
}

export function resetVisitorSchemaSupport() {
  visitorSchemaSupportPromise = null;
}
