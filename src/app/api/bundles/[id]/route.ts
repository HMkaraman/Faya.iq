import { NextRequest, NextResponse } from "next/server";
import { getBundles, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { Bundle } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bundles = getBundles();
    const bundle = bundles.find((b) => b.id === id);

    if (!bundle) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bundle);
  } catch (error) {
    console.error("Failed to fetch bundle:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundle" },
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
    const bundles = getBundles();
    const index = bundles.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      );
    }

    const updated: Bundle = { ...bundles[index], ...body, id };
    bundles[index] = updated;
    writeData("bundles.json", bundles);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update bundle:", error);
    return NextResponse.json(
      { error: "Failed to update bundle" },
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
    const bundles = getBundles();
    const filtered = bundles.filter((b) => b.id !== id);

    if (filtered.length === bundles.length) {
      return NextResponse.json(
        { error: "Bundle not found" },
        { status: 404 }
      );
    }

    writeData("bundles.json", filtered);

    return NextResponse.json({ message: "Bundle deleted successfully" });
  } catch (error) {
    console.error("Failed to delete bundle:", error);
    return NextResponse.json(
      { error: "Failed to delete bundle" },
      { status: 500 }
    );
  }
}
