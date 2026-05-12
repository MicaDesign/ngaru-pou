import AuthGuard from "@/components/AuthGuard";
import SpinWheel from "@/components/SpinWheel";

export default function SpinPage() {
  return (
    <AuthGuard>
      <SpinWheel />
    </AuthGuard>
  );
}
