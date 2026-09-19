import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // TODO: protection des routes par rôle (Administrateur, Technicien, Lecture ARSEL)
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
