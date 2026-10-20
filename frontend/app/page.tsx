import { AuthGuard } from "@/components/auth/AuthGuard";
import { Dashboard } from "@/components/dashboard/Dashboard";

export default function Home() {
  return (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  );
}