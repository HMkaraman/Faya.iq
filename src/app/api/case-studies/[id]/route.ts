import { NextRequest, NextResponse } from "next/server";
import { getCaseStudies, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { CaseStudy } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const items = getCaseStudies();
    const item = items.find((i) => i.id === id);

    if (!item) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Failed to fetch case study:", error);
    return NextResponse.json(
      { error: "Failed to fetch case study" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const items = getCaseStudies();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    const updated: CaseStudy = { ...items[index], ...body, id };
    items[index] = updated;
    writeData("case-studies.json", items);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update case study:", error);
    return NextResponse.json(
      { error: "Failed to update case study" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "write")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const items = getCaseStudies();
    const filtered = items.filter((i) => i.id !== id);

    if (filtered.length === items.length) {
      return NextResponse.json(
        { error: "Case study not found" },
        { status: 404 }
      );
    }

    writeData("case-studies.json", filtered);

    return NextResponse.json({
      message: "Case study deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete case study:", error);
    return NextResponse.json(
      { error: "Failed to delete case study" },
      { status: 500 }
    );
  }
}
