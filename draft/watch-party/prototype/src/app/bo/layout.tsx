import { BoShell } from "@/components/bo/BoShell";

// The BO sits behind ops auth in production; the prototype assumes an
// authenticated ops admin (no in-prototype role toggle).
export default function BoLayout({ children }: { children: React.ReactNode }) {
  return <BoShell>{children}</BoShell>;
}
