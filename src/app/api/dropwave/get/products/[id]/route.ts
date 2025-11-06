import { pool } from '@/app/lib/mysqlPool/createPool';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

    if (Array.isArray(rows) && rows.length > 0) {
      return Response.json(rows[0]);
    } else {
      return Response.json({ message: 'Product not found' }, { status: 404 });
    }
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
