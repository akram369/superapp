import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { name, username, email, mobile, agreedToShare } = await request.json();

    if (!name || !username || !email || !mobile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await sql`
      SELECT id FROM users WHERE LOWER(username) = ${username.trim().toLowerCase()}
    `;

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Insert user
    const [user] = await sql`
      INSERT INTO users (name, username, email, mobile, agreed_to_share)
      VALUES (${name.trim()}, ${username.trim()}, ${email.trim()}, ${mobile.trim()}, ${agreedToShare})
      RETURNING name, username, email, mobile, agreed_to_share AS "agreedToShare"
    `;

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
