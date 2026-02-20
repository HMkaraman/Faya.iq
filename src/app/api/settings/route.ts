import { NextRequest, NextResponse } from "next/server";
import { getSettings, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import type { SiteSettings } from "@/types";

// GET is public - no auth needed
export async function GET() {
  try {
    const settings = getSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT is admin only - needs manage_settings permission
export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!checkPermission(session.role, "manage_settings")) {
      return NextResponse.json(
        { error: "Forbidden: manage_settings permission required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const currentSettings = getSettings();

    const updated: SiteSettings = {
      ...currentSettings,
      ...body,
    };

    writeData("settings.json", updated);

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
