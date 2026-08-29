import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashPassword } from '@/lib/password';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      // If user exists without password (e.g. from Google login earlier), allow setting password
      if (!existingUser.password) {
        const hashedPassword = hashPassword(password);
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name: name?.trim() || existingUser.name || 'Creator',
            password: hashedPassword,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Account updated successfully! You can now log in.',
          user: {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
          },
        });
      }

      return NextResponse.json(
        { success: false, error: 'An account with this email already exists. Please sign in.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name: name?.trim() || 'Creator',
        email: normalizedEmail,
        password: hashedPassword,
        plan: 'pro', // Give trial access
      },
    });

    // Create default linkedIn account placeholder
    try {
      await prisma.linkedInAccount.create({
        data: {
          userId: newUser.id,
          name: newUser.name || 'LinkedIn Profile',
          headline: 'Creator & Tech Builder',
          isSandboxMode: true,
          isConnected: true,
        },
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: 'Account registered successfully!',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create account.' },
      { status: 500 }
    );
  }
}
