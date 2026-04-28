import { NextResponse } from "next/server";
import { getAdminMessaging } from "@/lib/firebaseAdmin";

export async function POST(request: Request) {
  const memberId = request.headers.get("x-member-id");
  if (!memberId) {
    return NextResponse.json({ error: "missing x-member-id" }, { status: 401 });
  }

  let body: {
    tokens?: string[];
    title?: string;
    body?: string;
    roomId?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid body" }, { status: 400 });
  }

  const { tokens, title, body: msgBody, roomId } = body;
  if (!tokens?.length || !title || !msgBody) {
    return NextResponse.json({ error: "tokens, title, body required" }, { status: 400 });
  }

  try {
    const messaging = getAdminMessaging();
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body: msgBody },
      webpush: {
        notification: {
          title,
          body: msgBody,
          icon: "/images/main-logo-white.svg",
          badge: "/images/main-logo-white.svg",
        },
        fcmOptions: {
          link: `/messages${roomId ? `?room=${roomId}` : ""}`,
        },
      },
    });

    return NextResponse.json({
      success: true,
      sent: response.successCount,
      failed: response.failureCount,
    });
  } catch (err) {
    console.error("notify route failed", err);
    return NextResponse.json({ error: "send failed" }, { status: 500 });
  }
}
