import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, checkPermission } from "@/lib/auth";
import { getUsers, writeData } from "@/lib/data";
import type { AdminUser } from "@/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !checkPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const users = getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { passwordHash, ...safe } = user;
  return NextResponse.json(safe);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !checkPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = { ...users[index] };
  if (body.name) updated.name = body.name;
  if (body.email) updated.email = body.email;
  if (body.role) updated.role = body.role;
  if (typeof body.isActive === "boolean") updated.isActive = body.isActive;
  if (body.password) {
    updated.passwordHash = await bcrypt.hash(body.password, 10);
  }

  users[index] = updated;
  writeData<AdminUser[]>("users.json", users);

  const { passwordHash, ...safe } = updated;
  return NextResponse.json(safe);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || !checkPermission(session.role, "manage_users")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  if (id === session.sub) {
    return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 });
  }

  const users = getUsers();
  const filtered = users.filter((u) => u.id !== id);
  if (filtered.length === users.length) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  writeData<AdminUser[]>("users.json", filtered);
  return NextResponse.json({ success: true });
}
