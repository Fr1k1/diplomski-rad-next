import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const characteristics = await prisma.characteristics.findMany();
    return NextResponse.json(characteristics);
  } catch (error) {
    console.error("Error fetching characteristics:", error);
    return NextResponse.json(
      { error: "Failed to fetch characteristics" },
      { status: 500 }
    );
  }
}
