import { revalidateTag, revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, tags, path, paths } = body;

    if (tag) {
      (revalidateTag as (tag: string, profile?: any) => void)(tag);
    }
    if (Array.isArray(tags)) {
      tags.forEach((t: string) => (revalidateTag as (tag: string, profile?: any) => void)(t));
    }

    if (path) {
      revalidatePath(path);
    }
    if (Array.isArray(paths)) {
      paths.forEach((p: string) => revalidatePath(p));
    }

    return NextResponse.json({
      success: true,
      message: "On-demand revalidation triggered successfully",
      revalidatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to revalidate cache" },
      { status: 500 }
    );
  }
}
