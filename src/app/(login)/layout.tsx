import { ReactNode } from "react";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen items-center justify-center">{children}</div>
  );
}
