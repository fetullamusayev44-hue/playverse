import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = 'force-dynamic';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*");

  // Server konsolunda məlumatı və xətanı görmək üçün:
  console.log("Supabase Users Data:", data);
  console.log("Supabase Error:", error);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}