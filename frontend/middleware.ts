import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import type { NextRequest } from "next/server";

interface DecodedToken {
  exp: number;
  user_id: string;
  email: string;
  role: string;
}

// Custom type that extends NextRequest
interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function middleware(request: AuthenticatedRequest) {
  let token = request.cookies.get("access")?.value;
  let isLoggedIn = false;
  let userRole = "student";

  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      const { exp, user_id, email, role } = decodedToken;
      const currentTime = Math.floor(Date.now() / 1000);

      if (currentTime < exp) {
        isLoggedIn = true;
        request.user = {
          id: user_id,
          email,
          role,
        };
        userRole = role;
        if (
          isLoggedIn &&
          role !== "admin" &&
          request.nextUrl.pathname.includes("/admin")
        ) {
          return NextResponse.rewrite(new URL("/", request.url));
        }
        if (
          isLoggedIn &&
          role !== "instructor" &&
          request.nextUrl.pathname.includes("/teacher")
        ) {
          return NextResponse.rewrite(new URL("/", request.url));
        }
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  if (isLoggedIn && request.nextUrl.pathname.includes("/login")) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
  if (!isLoggedIn && request.nextUrl.pathname.includes("/profile")) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
  if (!isLoggedIn && request.nextUrl.pathname.includes("/watch")) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
  if (!isLoggedIn && request.nextUrl.pathname.includes("/quiz")) {
    return NextResponse.rewrite(new URL("/", request.url));
  }
  if (!isLoggedIn && request.nextUrl.pathname.includes(`/courses`)) {
    return NextResponse.rewrite(new URL("/login", request.url));
  }
}
