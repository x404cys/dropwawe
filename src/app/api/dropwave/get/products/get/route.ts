import { pool } from "@/app/lib/mysqlPool/createPool";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM products");
    return Response.json(rows);
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
