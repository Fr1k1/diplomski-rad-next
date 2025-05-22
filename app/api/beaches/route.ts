import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "12");
    const approved = searchParams.get("approved");

    let whereClause = {};
    if (approved !== null) {
      const approvedValue = parseInt(approved);
      if (approvedValue === 0 || approvedValue === 1) {
        whereClause = { approved: approvedValue === 1 };
      }
    }
    const beaches = await prisma.beaches.findMany({
      take: pageSize,
      skip: (page - 1) * pageSize,
      where: whereClause,
      include: {
        beach_textures: {
          select: {
            name: true,
            img_url: true,
          },
        },
        beach_types: {
          select: {
            name: true,
          },
        },
        beach_depths: {
          select: {
            description: true,
          },
        },
        cities: {
          select: {
            name: true,
            latitude: true,
            longitude: true,
            countries: {
              select: {
                name: true,
              },
            },
          },
        },
        users: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        reviews: {
          select: {
            title: true,
            description: true,
            rating: true,
            users: {
              select: {
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });
    const total = await prisma.beaches.count({
      where: whereClause,
    });

    return NextResponse.json({
      beaches,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching beaches:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
