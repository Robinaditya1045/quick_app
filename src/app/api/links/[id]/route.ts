import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await prisma.link.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: "Link deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete link" }, { status: 500 });
  }
}
