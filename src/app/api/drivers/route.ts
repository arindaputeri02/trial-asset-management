import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export const runtime = "nodejs";
export async function GET() {
  const drivers = await prisma.driver.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(drivers);
}

export async function POST(req: Request) {
  const data = await req.json();
  const newDriver = await prisma.driver.create({ data });
  return NextResponse.json(newDriver, { status: 201 });
}

export async function PUT(req: Request) {
  const data = await req.json();
  const updated = await prisma.driver.update({
    where: { id: data.id },
    data,
  });
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await prisma.driver.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
