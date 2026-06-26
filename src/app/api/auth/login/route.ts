import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const rows = await sql`
      SELECT name, username, email, mobile, agreed_to_share AS "agreedToShare", selected_categories AS "selectedCategories", notes
      FROM users
      WHERE LOWER(username) = ${username.trim().toLowerCase()}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
    }

    const userRow = rows[0];
    return NextResponse.json({
      user: {
        name: userRow.name,
        username: userRow.username,
        email: userRow.email,
        mobile: userRow.mobile,
        agreedToShare: userRow.agreedToShare,
      },
      selectedCategories: userRow.selectedCategories || [],
      notes: userRow.notes || '',
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
