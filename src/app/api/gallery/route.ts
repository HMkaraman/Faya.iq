import { NextRequest, NextResponse } from "next/server";
import { getGalleryItems, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { GalleryItem } from "@/types";

export async function GET() {
  try {
    const items = getGalleryItems();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch gallery items:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
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

    if (!body.title?.en || !body.title?.ar) {
      return NextResponse.json(
        { error: "Gallery item title is required in both languages" },
        { status: 400 }
      );
    }

    const items = getGalleryItems();

    const newItem: GalleryItem = {
      id: generateId(),
      title: body.title,
      category: body.category || "",
      type: body.type || "showcase",
      beforeImage: body.beforeImage || "",
      afterImage: body.afterImage || "",
      doctor: body.doctor || { en: "", ar: "" },
      sessions: body.sessions || 0,
      tags: body.tags || [],
      active: body.active ?? true,
    };

    items.push(newItem);
    writeData("gallery.json", items);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Failed to create gallery item:", error);
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
