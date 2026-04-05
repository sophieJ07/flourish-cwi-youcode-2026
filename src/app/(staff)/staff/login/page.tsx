import type { Metadata } from "next";
import { StaffLoginView } from "./staff-login-view";

export const metadata: Metadata = {
  title: "Login",
};

export default function StaffLoginPage() {
  return <StaffLoginView />;
}
