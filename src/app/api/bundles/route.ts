import { NextRequest, NextResponse } from "next/server";
import { getBundles, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { Bundle } from "@/types";

export async function GET() {
  try {
    const bundles = getBundles();
    return NextResponse.json(bundles);
  } catch (error) {
    console.error("Failed to fetch bundles:", error);
    return NextResponse.json(
      { error: "Failed to fetch bundles" },
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
        { error: "Bundle name is required in both languages" },
        { status: 400 }
      );
    }

    const bundles = getBundles();

    const newBundle: Bundle = {
      id: generateId(),
      slug: body.slug || "",
      name: body.name,
      description: body.description || { en: "", ar: "" },
      includedServiceIds: body.includedServiceIds || [],
      image: body.image || "",
      imageSource: body.imageSource,
      imageLicense: body.imageLicense,
      tags: body.tags || [],
    };

    bundles.push(newBundle);
    writeData("bundles.json", bundles);

    return NextResponse.json(newBundle, { status: 201 });
  } catch (error) {
    console.error("Failed to create bundle:", error);
    return NextResponse.json(
      { error: "Failed to create bundle" },
      { status: 500 }
    );
  }
}
