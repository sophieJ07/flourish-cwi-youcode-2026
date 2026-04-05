import type { Metadata } from "next";
import { StaffAccessCodeView } from "./staff-access-code-view";

export const metadata: Metadata = {
  title: "Shelter access code",
};

export default function StaffAccessCodePage() {
  return <StaffAccessCodeView />;
}
