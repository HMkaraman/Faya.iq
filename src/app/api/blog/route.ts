import { NextRequest, NextResponse } from "next/server";
import { getBlogPosts, writeData } from "@/lib/data";
import { getSession, checkPermission } from "@/lib/auth";
import { generateId, generateSlug } from "@/lib/utils";
import type { BlogPost } from "@/types";

export async function GET() {
  try {
    const posts = getBlogPosts();
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
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
        { error: "Blog post title is required in both languages" },
        { status: 400 }
      );
    }

    const posts = getBlogPosts();

    const newPost: BlogPost = {
      id: generateId(),
      slug: body.slug || generateSlug(body.title.en),
      title: body.title,
      excerpt: body.excerpt || { en: "", ar: "" },
      content: body.content || { en: "", ar: "" },
      category: body.category || "",
      tags: body.tags || [],
      author: body.author || session.name,
      authorImage: body.authorImage || "",
      image: body.image || "",
      publishedAt: body.publishedAt || new Date().toISOString(),
      readTime: body.readTime || { en: "", ar: "" },
      featured: body.featured || false,
    };

    posts.push(newPost);
    writeData("blog.json", posts);

    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
