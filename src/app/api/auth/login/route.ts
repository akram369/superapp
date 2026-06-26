import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const { data: userRow, error } = await supabase
      .from('users')
      .select('name, username, email, mobile, agreed_to_share, selected_categories, notes')
      .eq('username', username.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!userRow) {
      return NextResponse.json({ error: 'User does not exist' }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        name: userRow.name,
        username: userRow.username,
        email: userRow.email,
        mobile: userRow.mobile,
        agreedToShare: userRow.agreed_to_share,
      },
      selectedCategories: userRow.selected_categories || [],
      notes: userRow.notes || '',
    });
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
