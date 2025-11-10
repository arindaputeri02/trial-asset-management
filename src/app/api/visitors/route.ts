import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET() {
  const visitors = await prisma.visitor.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(visitors);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newVisitor = await prisma.visitor.create({ data });
  return NextResponse.json(newVisitor, { status: 201 });
}

export async function PUT(req: Request) {
  const data = await req.json();
  const updated = await prisma.visitor.update({
    where: { id: data.id },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.visitor.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
