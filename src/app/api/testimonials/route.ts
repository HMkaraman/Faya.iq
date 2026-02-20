import { NextRequest, NextResponse } from "next/server";
import { getTestimonials, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId } from "@/lib/utils";
import type { Testimonial } from "@/types";

export async function GET() {
  try {
    const testimonials = getTestimonials();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { error: "Failed to fetch testimonials" },
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
        { error: "Testimonial name is required in both languages" },
        { status: 400 }
      );
    }

    const testimonials = getTestimonials();

    const newTestimonial: Testimonial = {
      id: generateId(),
      name: body.name,
      service: body.service || { en: "", ar: "" },
      branch: body.branch || "",
      rating: body.rating || 5,
      text: body.text || { en: "", ar: "" },
      image: body.image || "",
    };

    testimonials.push(newTestimonial);
    writeData("testimonials.json", testimonials);

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { error: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
