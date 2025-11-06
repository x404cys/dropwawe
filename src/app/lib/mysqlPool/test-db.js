import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: Number(process.env.DB_PORT)
    });
    const [rows] = await conn.query('SELECT NOW()');
    console.log('✅ Connected successfully', rows);
    await conn.end();
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  }
}

testConnection();
