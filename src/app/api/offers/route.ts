import { NextRequest, NextResponse } from "next/server";
import { getOffers, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { Offer } from "@/types";

export async function GET() {
  try {
    const offers = getOffers();
    return NextResponse.json(offers);
  } catch (error) {
    console.error("Failed to fetch offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
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
        { error: "Offer title is required in both languages" },
        { status: 400 }
      );
    }

    const offers = getOffers();

    const newOffer: Offer = {
      id: generateId(),
      title: body.title,
      description: body.description || { en: "", ar: "" },
      discount: body.discount || "",
      originalPrice: body.originalPrice || { en: "", ar: "" },
      salePrice: body.salePrice || { en: "", ar: "" },
      image: body.image || "",
      validUntil: body.validUntil || "",
      branches: body.branches || { en: "", ar: "" },
      tag: body.tag || { en: "", ar: "" },
      active: body.active ?? true,
    };

    offers.push(newOffer);
    writeData("offers.json", offers);

    return NextResponse.json(newOffer, { status: 201 });
  } catch (error) {
    console.error("Failed to create offer:", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}
