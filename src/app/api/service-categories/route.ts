import { NextRequest, NextResponse } from "next/server";
import { getServiceCategories, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";
import type { ServiceCategory } from "@/types";

export async function GET() {
  try {
    const categories = getServiceCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch service categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch service categories" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();

    if (!body.name?.en || !body.name?.ar) {
      return NextResponse.json(
        { error: "Category name is required in both languages" },
        { status: 400 }
      );
    }

    const categories = getServiceCategories();

    const newCategory: ServiceCategory = {
      slug: body.slug || generateSlug(body.name.en),
      name: body.name,
      icon: body.icon || "",
      description: body.description || { en: "", ar: "" },
      image: body.image || "",
    };

    // Check for duplicate slug
    if (categories.some((c) => c.slug === newCategory.slug)) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    categories.push(newCategory);
    writeData("service-categories.json", categories);

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Failed to create service category:", error);
    return NextResponse.json(
      { error: "Failed to create service category" },
      { status: 500 }
    );
  }
}
