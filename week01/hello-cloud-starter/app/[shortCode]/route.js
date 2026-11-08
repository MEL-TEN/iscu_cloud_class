import { findUrlByShortCode } from "../../lib/db";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { shortCode } = await params;

  const originalUrl = await findUrlByShortCode(shortCode);

  // TODO
  // originalUrl이 존재하지 않는 경우
  // 404 Not Found 응답을 반환하세요.
  if (!originalUrl) {
    return NextResponse.json(
      {
        error: {
          code: "SHORT_URL_NOT_FOUND",
          message: "The requested short URL could not be found.",
        },
      },
      { status: 404 }
    );
  }

  return new Response(null, {
    status: 307,
    headers: {
      Location: originalUrl,
      "Cache-Control": "no-store",
    },
  });
}