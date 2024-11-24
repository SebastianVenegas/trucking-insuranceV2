'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    Tawk_API: any;
    Tawk_LoadStart: any;
  }
}

export default function TawkToWidget() {
  useEffect(() => {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/673439302480f5b4f59d1644/1icupr85v';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}