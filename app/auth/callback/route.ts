import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const providerError = requestUrl.searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/sign-in?error=oauth", request.url));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL("/sign-in?error=link_expired", request.url),
    );
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(
      new URL("/sign-in?error=link_expired", request.url),
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile?.role) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  return NextResponse.redirect(new URL("/dashboard", request.url));
}
