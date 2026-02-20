import { NextRequest, NextResponse } from "next/server";
import { getTeamMembers, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { TeamMember } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const members = getTeamMembers();
    const member = members.find((m) => m.id === id);

    if (!member) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error("Failed to fetch team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
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
    const members = getTeamMembers();
    const index = members.findIndex((m) => m.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    const updated: TeamMember = { ...members[index], ...body, id };
    members[index] = updated;
    writeData("team.json", members);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update team member:", error);
    return NextResponse.json(
      { error: "Failed to update team member" },
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
    const members = getTeamMembers();
    const filtered = members.filter((m) => m.id !== id);

    if (filtered.length === members.length) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 }
      );
    }

    writeData("team.json", filtered);

    return NextResponse.json({ message: "Team member deleted successfully" });
  } catch (error) {
    console.error("Failed to delete team member:", error);
    return NextResponse.json(
      { error: "Failed to delete team member" },
      { status: 500 }
    );
  }
}
