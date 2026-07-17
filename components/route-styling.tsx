"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

export function RouteStyling() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const path = pathname.replace(/\/$/, "") || "/";
    const chapterMatch = path.match(/^\/galatians\/(\d+)$/);

    html.classList.add("dark");
    html.style.colorScheme = "dark";
    body.classList.add("mbe-shell-managed");
    body.removeAttribute("data-galatians-chapter");

    if (path === "/") body.dataset.galatiansRoute = "home";
    else if (path === "/background") body.dataset.galatiansRoute = "introduction";
    else if (path === "/articles" || path.startsWith("/articles/")) body.dataset.galatiansRoute = "articles";
    else if (chapterMatch) {
      body.dataset.galatiansRoute = "commentary";
      body.dataset.galatiansChapter = chapterMatch[1];
    } else body.removeAttribute("data-galatians-route");
  }, [pathname]);

  return null;
}
