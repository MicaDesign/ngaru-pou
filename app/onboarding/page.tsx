import AuthGuard from "@/components/AuthGuard";
import OnboardingView from "@/components/OnboardingView";

export default function OnboardingPage() {
  return (
    <AuthGuard>
      <OnboardingView />
    </AuthGuard>
  );
}
