import { NextRequest, NextResponse } from "next/server";
import { getCaseStudies, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { CaseStudy } from "@/types";

export async function GET() {
  try {
    const items = getCaseStudies();
    return NextResponse.json(items);
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return NextResponse.json(
      { error: "Failed to fetch case studies" },
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
        { error: "Case study title is required in both languages" },
        { status: 400 }
      );
    }

    const items = getCaseStudies();

    const newItem: CaseStudy = {
      id: generateId(),
      slug: body.slug || "",
      title: body.title,
      summary: body.summary || { en: "", ar: "" },
      serviceId: body.serviceId || "",
      categorySlug: body.categorySlug || "",
      doctor: body.doctor || { en: "", ar: "" },
      stages: body.stages || [],
      tags: body.tags || [],
      active: body.active ?? true,
    };

    items.push(newItem);
    writeData("case-studies.json", items);

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error("Failed to create case study:", error);
    return NextResponse.json(
      { error: "Failed to create case study" },
      { status: 500 }
    );
  }
}
