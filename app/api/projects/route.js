import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: { milestones: { orderBy: { targetDate: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, description, milestones } = await req.json();

  if (!title) return NextResponse.json({ error: "Title is required." }, { status: 400 });

  const project = await prisma.project.create({
    data: {
      title,
      description,
      userId: session.user.id,
      milestones: {
        create: (milestones || []).map((m) => ({
          title: m.title,
          targetDate: new Date(m.targetDate),
        })),
      },
    },
    include: { milestones: true },
  });

  return NextResponse.json(project, { status: 201 });
}
