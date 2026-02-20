import { NextRequest, NextResponse } from "next/server";
import { getBranches, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId, generateSlug } from "@/lib/utils";
import type { Branch } from "@/types";

export async function GET() {
  try {
    const branches = getBranches();
    return NextResponse.json(branches);
  } catch (error) {
    console.error("Failed to fetch branches:", error);
    return NextResponse.json(
      { error: "Failed to fetch branches" },
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
        { error: "Branch name is required in both languages" },
        { status: 400 }
      );
    }

    const branches = getBranches();

    const newBranch: Branch = {
      id: generateId(),
      slug: body.slug || generateSlug(body.name.en),
      name: body.name,
      city: body.city || { en: "", ar: "" },
      address: body.address || { en: "", ar: "" },
      phone: body.phone || "",
      whatsapp: body.whatsapp || "",
      email: body.email || "",
      hours: body.hours || { en: "", ar: "" },
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      image: body.image || "",
      mapUrl: body.mapUrl || "",
      coordinates: body.coordinates || { lat: 0, lng: 0 },
      availableServices: body.availableServices || [],
      hasGallery: body.hasGallery || false,
      teamMembers: body.teamMembers || [],
      features: body.features || { en: [], ar: [] },
    };

    branches.push(newBranch);
    writeData("branches.json", branches);

    return NextResponse.json(newBranch, { status: 201 });
  } catch (error) {
    console.error("Failed to create branch:", error);
    return NextResponse.json(
      { error: "Failed to create branch" },
      { status: 500 }
    );
  }
}
