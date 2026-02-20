import { NextRequest, NextResponse } from "next/server";
import { getBranches, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { Branch } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const branches = getBranches();
    const branch = branches.find((b) => b.id === id);

    if (!branch) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(branch);
  } catch (error) {
    console.error("Failed to fetch branch:", error);
    return NextResponse.json(
      { error: "Failed to fetch branch" },
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
    const branches = getBranches();
    const index = branches.findIndex((b) => b.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      );
    }

    const updated: Branch = { ...branches[index], ...body, id };
    branches[index] = updated;
    writeData("branches.json", branches);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update branch:", error);
    return NextResponse.json(
      { error: "Failed to update branch" },
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
    const branches = getBranches();
    const filtered = branches.filter((b) => b.id !== id);

    if (filtered.length === branches.length) {
      return NextResponse.json(
        { error: "Branch not found" },
        { status: 404 }
      );
    }

    writeData("branches.json", filtered);

    return NextResponse.json({ message: "Branch deleted successfully" });
  } catch (error) {
    console.error("Failed to delete branch:", error);
    return NextResponse.json(
      { error: "Failed to delete branch" },
      { status: 500 }
    );
  }
}
