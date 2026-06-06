import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all API endpoints
  if (pathname.startsWith("/api/")) {
    const method = request.method;

    // Define public read paths
    const isPublicGet =
      method === "GET" &&
      (pathname === "/api/quizzes" ||
        pathname.startsWith("/api/quiz/") ||
        pathname === "/api/leaderboard");

    // All write operations (POST/PUT/DELETE) and private read routes (users, results) require authentication
    if (!isPublicGet) {
      const authHeader = request.headers.get("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized: Missing or invalid token header" },
          { status: 401 }
        );
      }

      const token = authHeader.split("Bearer ")[1];
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;

      if (!apiKey) {
        return NextResponse.json(
          { error: "Internal Server Error: Missing auth configuration" },
          { status: 500 }
        );
      }

      try {
        // Query the Google Identity Toolkit API to verify the token
        const res = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${apiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken: token }),
          }
        );

        if (!res.ok) {
          return NextResponse.json(
            { error: "Unauthorized: Invalid or expired auth token" },
            { status: 401 }
          );
        }

        const data = await res.json();
        const userProfile = data.users?.[0];

        if (!userProfile) {
          return NextResponse.json(
            { error: "Unauthorized: Authenticated user not found" },
            { status: 401 }
          );
        }

        // Token is valid! Pass the claims downstream as headers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", userProfile.localId);
        requestHeaders.set("x-user-email", userProfile.email);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (err) {
        return NextResponse.json(
          { error: "Unauthorized: Token verification failed" },
          { status: 401 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
