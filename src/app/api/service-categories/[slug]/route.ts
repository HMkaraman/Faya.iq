import { NextRequest, NextResponse } from "next/server";
import { getServiceCategories, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { ServiceCategory } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const categories = getServiceCategories();
    const category = categories.find((c) => c.slug === slug);

    if (!category) {
      return NextResponse.json(
        { error: "Service category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Failed to fetch service category:", error);
    return NextResponse.json(
      { error: "Failed to fetch service category" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await request.json();
    const categories = getServiceCategories();
    const index = categories.findIndex((c) => c.slug === slug);

    if (index === -1) {
      return NextResponse.json(
        { error: "Service category not found" },
        { status: 404 }
      );
    }

    const updated: ServiceCategory = {
      ...categories[index],
      ...body,
      slug: categories[index].slug, // Prevent slug change via PUT
    };
    categories[index] = updated;
    writeData("service-categories.json", categories);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update service category:", error);
    return NextResponse.json(
      { error: "Failed to update service category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { slug } = await params;
    const categories = getServiceCategories();
    const filtered = categories.filter((c) => c.slug !== slug);

    if (filtered.length === categories.length) {
      return NextResponse.json(
        { error: "Service category not found" },
        { status: 404 }
      );
    }

    writeData("service-categories.json", filtered);

    return NextResponse.json({
      message: "Service category deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete service category:", error);
    return NextResponse.json(
      { error: "Failed to delete service category" },
      { status: 500 }
    );
  }
}
