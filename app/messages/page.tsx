import { Suspense } from "react";
import AuthGuard from "@/components/AuthGuard";
import MessagesView from "@/components/messages/MessagesView";

export default function MessagesPage() {
  return (
    <AuthGuard>
      <Suspense>
        <MessagesView />
      </Suspense>
    </AuthGuard>
  );
}
