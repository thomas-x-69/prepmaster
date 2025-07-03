// src/app/api/github-stars/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.github.com/repos/thomas-x-69/prepmaster",
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "PrepMaster-App",
        },
        // No caching - always get fresh data
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error(
        "GitHub API response not ok:",
        response.status,
        response.statusText
      );
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("GitHub API success, stars:", data.stargazers_count);

    return NextResponse.json({
      stars: data.stargazers_count,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching GitHub stars:", error);

    return NextResponse.json(
      {
        stars: null,
        success: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
