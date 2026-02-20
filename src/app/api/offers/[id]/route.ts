import { NextRequest, NextResponse } from "next/server";
import { getOffers, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { Offer } from "@/types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const offers = getOffers();
    const offer = offers.find((o) => o.id === id);

    if (!offer) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(offer);
  } catch (error) {
    console.error("Failed to fetch offer:", error);
    return NextResponse.json(
      { error: "Failed to fetch offer" },
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
    const offers = getOffers();
    const index = offers.findIndex((o) => o.id === id);

    if (index === -1) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    const updated: Offer = { ...offers[index], ...body, id };
    offers[index] = updated;
    writeData("offers.json", offers);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update offer:", error);
    return NextResponse.json(
      { error: "Failed to update offer" },
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
    const offers = getOffers();
    const filtered = offers.filter((o) => o.id !== id);

    if (filtered.length === offers.length) {
      return NextResponse.json(
        { error: "Offer not found" },
        { status: 404 }
      );
    }

    writeData("offers.json", filtered);

    return NextResponse.json({ message: "Offer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete offer:", error);
    return NextResponse.json(
      { error: "Failed to delete offer" },
      { status: 500 }
    );
  }
}
