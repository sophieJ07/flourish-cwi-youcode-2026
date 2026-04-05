import type { Metadata } from "next";
import { StaffDashboardView } from "./staff-dashboard-view";

export const metadata: Metadata = {
  title: "Insights",
};

export default function StaffDashboardPage() {
  return <StaffDashboardView />;
}
