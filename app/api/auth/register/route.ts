import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role, referralCode } = await request.json();

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: 'Email ya registrado' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const userData: any = {
      email,
      password: hashedPassword,
      name,
      role: role || 'USER',
      status: role === 'AFFILIATE' ? 'PENDING' : 'ACTIVE',
      wallet: 0,
    };

    if (role === 'AFFILIATE') {
      const count = await prisma.user.count({ where: { role: 'AFFILIATE' } });
      userData.referralCode = `AFF${String(count + 1).padStart(3, '0')}`;
    }

    if (referralCode) {
      const referrer = await prisma.user.findUnique({ where: { referralCode } });
      if (referrer) userData.referredBy = referrer.id;
    }

    const user = await prisma.user.create({ data: userData });

    return NextResponse.json({
      message: 'Usuario creado',
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    return NextResponse.json({ message: 'Error del servidor' }, { status: 500 });
  }
}