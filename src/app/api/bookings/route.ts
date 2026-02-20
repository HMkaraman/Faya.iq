import { NextRequest, NextResponse } from "next/server";
import { getBookings, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { Booking } from "@/types";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "read")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bookings = getBookings();
    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST is public - no auth needed for creating bookings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.fullName || !body.phone || !body.branchId || !body.serviceId) {
      return NextResponse.json(
        {
          error:
            "Full name, phone, branch, and service are required",
        },
        { status: 400 }
      );
    }

    const bookings = getBookings();

    const newBooking: Booking = {
      id: generateId(),
      fullName: body.fullName,
      phone: body.phone,
      email: body.email || "",
      notes: body.notes || "",
      branchId: body.branchId,
      serviceId: body.serviceId,
      date: body.date || "",
      time: body.time || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    bookings.push(newBooking);
    writeData("bookings.json", bookings);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}
