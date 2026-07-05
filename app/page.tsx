"use client";

import { useState } from "react";
import domtoimage from "dom-to-image-more";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Header } from "@/components/Header";
import { WorkflowWrapper } from "@/components/WorkflowWrapper";
import { GitFork, Info, CirclePlus, Fullscreen } from "lucide-react";

export default function Home() {
  const [resetKey, setResetKey] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

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
      ctx.fillText(
        "github.com/zoom1fy/tier-list-master",
        img.width - 16,
        img.height - 16,
      );

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
          {
            label: "Create new",
            icon: <CirclePlus size={18} />,
            onClick: () => setConfirmOpen(true),
          },
          {
            label: "Make screenshot",
            icon: <Fullscreen size={18} />,
            onClick: handleScreenshot,
          },
          { label: "Github", href: "https://zoom1fy.github.io/tier-list-master/", icon: <GitFork size={18} /> },
          { label: "About", icon: <Info size={18} />, onClick: () => setAboutOpen(true) },
        ]}
      />

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create new tier list?</AlertDialogTitle>
            <AlertDialogDescription>
              This will clear all your current items and tiers. Are you sure?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setResetKey((k) => k + 1);
                setConfirmOpen(false);
              }}
            >
              Yes, start over
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={aboutOpen} onOpenChange={setAboutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>How to Use Tier List Master</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-muted-foreground">
              <div className="p-3 rounded-lg border border-card-border bg-card">
                <p className="font-medium text-foreground mb-1">1. Add Items</p>
                <p>
                  Paste an image URL or upload a file from the right panel. Give each item a name before adding.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-card-border bg-card">
                <p className="font-medium text-foreground mb-1">2. Drag & Drop</p>
                <p>
                  Drag items into any tier row. Works with mouse and touch. Move items between tiers or back to the pool.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-card-border bg-card">
                <p className="font-medium text-foreground mb-1">3. Customize Tiers</p>
                <p>
                  Click a tier label to rename it (up to 15 characters). All labels stay aligned automatically.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-card-border bg-card">
                <p className="font-medium text-foreground mb-1">4. Screenshot</p>
                <p>
                  Click <strong>Make screenshot</strong> to save your tier list as PNG with a watermark.
                </p>
              </div>
              <div className="p-3 rounded-lg border border-card-border bg-card">
                <p className="font-medium text-foreground mb-1">5. Start Over</p>
                <p>
                  Use <strong>Create new</strong> to reset all tiers. A confirmation dialog prevents accidents.
                </p>
              </div>
            </div>
        </DialogContent>
      </Dialog>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-20">
        <WorkflowWrapper key={resetKey} />
      </main>
    </div>
  );
}
