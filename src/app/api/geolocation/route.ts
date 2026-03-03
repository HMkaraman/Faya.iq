import { NextRequest, NextResponse } from "next/server";

interface GeoResponse {
  lat: number | null;
  lng: number | null;
  city: string | null;
}

const NULL_RESPONSE: GeoResponse = { lat: null, lng: null, city: null };

function isPrivateIp(ip: string): boolean {
  return (
    ip === "127.0.0.1" ||
    ip === "::1" ||
    ip.startsWith("10.") ||
    ip.startsWith("192.168.") ||
    ip.startsWith("172.16.") ||
    ip.startsWith("172.17.") ||
    ip.startsWith("172.18.") ||
    ip.startsWith("172.19.") ||
    ip.startsWith("172.2") ||
    ip.startsWith("172.30.") ||
    ip.startsWith("172.31.") ||
    ip === "localhost"
  );
}

export async function GET(request: NextRequest) {
  try {
    // Strategy 1: Vercel geo headers (free, zero-latency)
    const vercelLat = request.headers.get("x-vercel-ip-latitude");
    const vercelLng = request.headers.get("x-vercel-ip-longitude");
    const vercelCity = request.headers.get("x-vercel-ip-city");

    if (vercelLat && vercelLng) {
      const lat = parseFloat(vercelLat);
      const lng = parseFloat(vercelLng);
      if (!isNaN(lat) && !isNaN(lng)) {
        return NextResponse.json({
          lat,
          lng,
          city: vercelCity ? decodeURIComponent(vercelCity) : null,
        });
      }
    }

    // Strategy 2: Fallback to ipwho.is
    const forwarded = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = forwarded?.split(",")[0]?.trim() || realIp || null;

    if (!ip || isPrivateIp(ip)) {
      return NextResponse.json(NULL_RESPONSE);
    }

    const res = await fetch(`https://ipwho.is/${ip}`, {
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
      return NextResponse.json(NULL_RESPONSE);
    }

    const data = await res.json();

    if (!data.success || typeof data.latitude !== "number" || typeof data.longitude !== "number") {
      return NextResponse.json(NULL_RESPONSE);
    }

    return NextResponse.json({
      lat: data.latitude,
      lng: data.longitude,
      city: data.city || null,
    });
  } catch {
    return NextResponse.json(NULL_RESPONSE);
  }
}
