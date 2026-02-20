import { NextRequest, NextResponse } from "next/server";
import { getServices, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId, generateSlug } from "@/lib/utils";
import type { Service } from "@/types";

export async function GET() {
  try {
    const services = getServices();
    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json(
      { error: "Failed to fetch services" },
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
        { error: "Service name is required in both languages" },
        { status: 400 }
      );
    }

    const services = getServices();

    const newService: Service = {
      id: generateId(),
      slug: generateSlug(body.name.en),
      category: body.category || "",
      categorySlug: body.categorySlug || generateSlug(body.category || ""),
      name: body.name,
      shortDescription: body.shortDescription || { en: "", ar: "" },
      description: body.description || { en: "", ar: "" },
      icon: body.icon || "",
      image: body.image || "",
      tags: body.tags || [],
      branches: body.branches || [],
      duration: body.duration,
      priceRange: body.priceRange,
      benefits: body.benefits || { en: [], ar: [] },
      steps: body.steps || { en: [], ar: [] },
      downtime: body.downtime || { en: "", ar: "" },
      faq: body.faq || [],
    };

    services.push(newService);
    writeData("services.json", services);

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500 }
    );
  }
}
