import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, notes } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    await sql`
      UPDATE users
      SET notes = ${notes || ''}
      WHERE LOWER(username) = ${username.trim().toLowerCase()}
    `;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save Notes API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
