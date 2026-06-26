import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
  try {
    const { name, username, email, mobile, agreedToShare } = await request.json();

    if (!name || !username || !email || !mobile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists (case-insensitive username check)
    const { data: existingUsers, error: selectError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username.trim().toLowerCase());

    if (selectError) {
      throw selectError;
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    // Insert user
    const { data: insertedUser, error: insertError } = await supabase
      .from('users')
      .insert({
        name: name.trim(),
        username: username.trim().toLowerCase(),
        email: email.trim(),
        mobile: mobile.trim(),
        agreed_to_share: agreedToShare,
      })
      .select('name, username, email, mobile, agreed_to_share')
      .single();

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({
      user: {
        name: insertedUser.name,
        username: insertedUser.username,
        email: insertedUser.email,
        mobile: insertedUser.mobile,
        agreedToShare: insertedUser.agreed_to_share,
      },
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
