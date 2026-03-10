'use client';

import Script from 'next/script';

interface SnapPixelProps {
  pixelId?: string;
}

export default function SnapPixel({ pixelId }: SnapPixelProps) {
  if (!pixelId) return null;

  return (
    <>
      <Script id="snap-pixel" strategy="afterInteractive">
        {`
          (function(e,t,n){
            if(e.snaptr)return;
            var a=e.snaptr=function(){
              a.handleRequest
                ? a.handleRequest.apply(a,arguments)
                : a.queue.push(arguments);
            };
            a.queue=[];
            var s='script';
            var r=t.createElement(s);
            r.async=true;
            r.src='https://sc-static.net/scevent.min.js';
            var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);
          })(window,document);

          snaptr('init', '${pixelId}');
          snaptr('track', 'PAGE_VIEW');
        `}
      </Script>

      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          alt=""
          src={`https://tr.snapchat.com/p?pid=${pixelId}&ev=PAGE_VIEW&noscript=1`}
        />
      </noscript>
    </>
  );
}
