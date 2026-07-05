"use client";

import domtoimage from "dom-to-image-more";
import { Header } from "@/components/Header";
import { WorkflowWrapper } from "@/components/WorkflowWrapper";
import { Home as HomeIcon, Info, CirclePlus, Fullscreen } from "lucide-react";

export default function Home() {
  const handleScreenshot = async () => {
    const el = document.getElementById("tier-list");
    if (!el) return;

    const dataUrl = await domtoimage.toPng(el, {
      bgcolor: "#09090b",
      scale: 2,
    });

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;

      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
      ctx.font = `${Math.round(img.width / 40)}px sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText("github.com/zoom1fy/tier-list-master", img.width - 16, img.height - 16);

      const date = new Date().toISOString().slice(0, 10);
      const link = document.createElement("a");
      link.download = `tierlist-master-${date}.png`;
      link.href = canvas.toDataURL();
      link.click();
    };
    img.src = dataUrl;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        logoText="TierListMaster"
        logoHref="/"
        navItems={[
          { label: "Main", href: "/", icon: <HomeIcon size={18} /> },
          { label: "About", href: "/about", icon: <Info size={18} /> },
          {
            label: "Create new",
            href: "/services",
            icon: <CirclePlus size={18} />,
          },
          {
            label: "Make screenshot",
            icon: <Fullscreen size={18} />,
            onClick: handleScreenshot,
          },
        ]}
      />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        <WorkflowWrapper />
      </main>
    </div>
  );
}
