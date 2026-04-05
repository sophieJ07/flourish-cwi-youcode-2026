import type { Metadata } from "next";
import { KioskWellnessFlow } from "@/components/kiosk/kiosk-wellness-flow";

export const metadata: Metadata = {
  title: "Wellness Check-In",
  description: "Anonymous wellness check-in for guests.",
};

export default function KioskHomePage() {
  return <KioskWellnessFlow />;
}
