import { NextRequest, NextResponse } from "next/server";
import { getTeamMembers, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { TeamMember } from "@/types";

export async function GET() {
  try {
    const members = getTeamMembers();
    return NextResponse.json(members);
  } catch (error) {
    console.error("Failed to fetch team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
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
        { error: "Team member name is required in both languages" },
        { status: 400 }
      );
    }

    const members = getTeamMembers();

    const newMember: TeamMember = {
      id: generateId(),
      name: body.name,
      title: body.title || { en: "", ar: "" },
      specialization: body.specialization || { en: "", ar: "" },
      bio: body.bio || { en: "", ar: "" },
      image: body.image || "",
      branches: body.branches || [],
      credentials: body.credentials || [],
      yearsExperience: body.yearsExperience || 0,
    };

    members.push(newMember);
    writeData("team.json", members);

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("Failed to create team member:", error);
    return NextResponse.json(
      { error: "Failed to create team member" },
      { status: 500 }
    );
  }
}
