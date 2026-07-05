import { Header } from "@/components/Header";
import { WorkflowWrapper } from "@/components/WorkflowWrapper";
import { Home as HomeIcon, Info, CirclePlus } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header
        logoText="TierListMaster"
        logoHref="/"
        navItems={[
          { label: "Main", href: "/", icon: <HomeIcon size={18} /> },
          { label: "About", href: "/about", icon: <Info size={18} /> },
          { label: "Create new", href: "/services", icon: <CirclePlus size={18} /> }
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <WorkflowWrapper />
      </main>
    </div>
  );
}
