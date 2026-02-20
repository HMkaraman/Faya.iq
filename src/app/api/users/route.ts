import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, checkPermission } from "@/lib/auth";
import { getUsers, writeData } from "@/lib/data";
import { generateId } from "@/lib/utils";
import type { AdminUser } from "@/types";

export async function GET() {
  const session = await getSession();
  if (!session || !checkPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = getUsers().map(({ passwordHash, ...u }) => u);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !checkPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { username, email, password, name, role } = body;

    if (!username || !email || !password || !name || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const users = getUsers();
    if (users.find((u) => u.username === username)) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: AdminUser = {
      id: generateId(),
      username,
      email,
      passwordHash,
      name,
      role,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    writeData<AdminUser[]>("users.json", users);

    const { passwordHash: _, ...safe } = newUser;
    return NextResponse.json(safe, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
