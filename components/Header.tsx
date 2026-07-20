"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

type NavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
};

type HeaderProps = {
  logoText: string;
  logoHref: string;
  navItems: NavItem[];
};

export function Header({ logoText, logoHref, navItems }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <a
            href={logoHref}
            className="text-lg font-bold text-foreground hover:text-accent transition-colors"
          >
            {logoText}
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) =>
              item.onClick ? (
                <button
                  key={item.label}
                  type="button"
                  onClick={item.onClick}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all cursor-pointer"
                >
                  {item.icon}
                  {item.label}
                </button>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  target={item.href?.startsWith("http") ? "_blank" : undefined}
                  rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                >
                  {item.icon}
                  {item.label}
                </a>
              )
            )}
          </nav>
        </div>

        <span className="absolute right-14 hidden md:inline text-xs text-muted-foreground/50 select-none">v0.3.1</span>
        <div className="absolute right-4 md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" />
              }
            >
              <Menu className="size-5" />
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{logoText}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 mt-6">
                {navItems.map((item) => (
                  <SheetClose
                    key={item.href ?? item.label}
                    render={
                      <a
                        href={item.href ?? "#"}
                        target={item.href?.startsWith("http") ? "_blank" : undefined}
                        rel={item.href?.startsWith("http") ? "noopener noreferrer" : undefined}
                        onClick={item.onClick}
                        className="inline-flex items-center gap-2 h-10 px-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                      />
                    }
                  >
                    {item.icon}
                    {item.label}
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
