import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ GET - ambil semua user
export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}

// ✅ POST - tambah user
export async function POST(request: Request) {
  const body = await request.json();
  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
    },
  });
  return NextResponse.json(user);
}

// ✅ PUT - update user
export async function PUT(request: Request) {
  const body = await request.json();
  const user = await prisma.user.update({
    where: { id: body.id },
    data: { name: body.name, email: body.email },
  });
  return NextResponse.json(user);
}

// ✅ DELETE - hapus user
export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = Number(searchParams.get('id'));
  const user = await prisma.user.delete({ where: { id } });
  return NextResponse.json(user);
}
