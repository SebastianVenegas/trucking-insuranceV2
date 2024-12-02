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

    // Add custom styling for the widget
    const style = document.createElement('style');
    style.innerHTML = `
      #tawk-default-container[style*="width"] {
        background-color: white !important;
        background: white !important;
      }
      
      #tawk-bubble-container[style*="width"] {
        background-color: white !important;
        background: white !important;
      }
      
      .tawk-min-container {
        background-color: white !important;
        background: white !important;
      }
      
      #tawk-card-container {
        background-color: white !important;
        background: white !important;
      }

      iframe[title*="chat"]:not([style*="display: none"]) {
        background-color: white !important;
        background: white !important;
      }

      @media (max-width: 768px) {
        #tawk-default-container {
          width: 100vw !important;
          height: 100vh !important;
          max-width: 100vw !important;
          left: 0 !important;
          right: 0 !important;
          bottom: 0 !important;
          position: fixed !important;
          margin: 0 !important;
          background: white !important;
        }
        
        .tawk-min-container {
          width: 100% !important;
          margin: 0 !important;
          left: 0 !important;
          right: 0 !important;
        }

        .tawk-card {
          width: 100% !important;
          max-width: 100%;
          margin: 0 !important;
          border-radius: 0 !important;
        }

        iframe[title*="chat"] {
          width: 100vw !important;
          left: 0 !important;
          right: 0 !important;
          background: white !important;
        }
      }
    `;
    document.head.appendChild(style);

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/673439302480f5b4f59d1644/1icupr85v';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode?.insertBefore(s1, s0);

    return () => {
      // Cleanup custom styling
      style.remove();
    };
  }, []);

  return null;
}