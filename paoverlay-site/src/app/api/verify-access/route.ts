import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    // Add CORS headers so the Chrome extension can hit this endpoint freely
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (!email) {
      return NextResponse.json(
        { error: "Email parameter is required", hasAccess: false },
        { status: 400, headers }
      );
    }

    // Check Supabase for active subscription
    const { data, error } = await supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("email", email)
      .eq("status", "active")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 means no rows returned, which is fine (just no access)
      console.error("Supabase query error:", error);
      return NextResponse.json(
        { error: "Internal server error", hasAccess: false },
        { status: 500, headers }
      );
    }

    if (data) {
      return NextResponse.json({ hasAccess: true }, { status: 200, headers });
    } else {
      return NextResponse.json({ hasAccess: false }, { status: 200, headers });
    }

  } catch (error: any) {
    console.error("Verification API error:", error.message);
    return NextResponse.json(
      { error: "Failed to verify access", hasAccess: false },
      { status: 500 } // Fallback, CORS headers might be missing on fatal crash
    );
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
