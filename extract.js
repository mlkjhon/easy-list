const fs = require('fs');
const cheerio = require('cheerio');

try {
  const html = fs.readFileSync('easylist.html', 'utf8');
  const $ = cheerio.load(html);

  // 1. Extract CSS
  const css = $('style').html();
  fs.writeFileSync('src/app/globals.css', css || '', 'utf8');
  
  // 2. Format body to JSX
  $('*').each(function() {
    if (this.attribs) {
      for (let attr in this.attribs) {
        if (attr.startsWith('on')) {
          $(this).removeAttr(attr);
        }
        if (attr === 'style') {
          try {
             const styleStr = $(this).attr('style');
             if (styleStr) {
               const parts = styleStr.split(';').filter(p => p.trim());
               let styleObj = {};
               parts.forEach(p => {
                  let [k, ...v] = p.split(':');
                  if (k && v.length > 0) {
                     const camelKey = k.trim().replace(/-([a-z])/g, g => g[1]? g[1].toUpperCase() : '');
                     styleObj[camelKey] = v.join(':').trim();
                  }
               });
               $(this).removeAttr('style');
               // Store as JSON string in data-style to replace later
               $(this).attr('data-style', JSON.stringify(styleObj));
             }
          } catch(e){}
        }
      }
    }
  });

  // Self closing tags fix for JSX (input, img, br, hr)
  $('script').remove();
  let bodyHtml = $('body').html();
  bodyHtml = bodyHtml.replace(/<!--[\s\S]*?-->/g, '');
  
  // Replace data-style='{"background":"var(--coral)"}' or data-style="{...}" with style={{...}}
  // Cheerio might output it with double quotes if values have single quotes, or vice versa
  bodyHtml = bodyHtml.replace(/data-style="(\{.*?\})"/g, (match, p1) => {
      // unescape html entities like &quot;
      let json = p1.replace(/&quot;/g, '"');
      return 'style={' + json + '}';
  });
  bodyHtml = bodyHtml.replace(/data-style='(\{.*?\})'/g, (match, p1) => {
      let json = p1.replace(/&quot;/g, '"');
      return 'style={' + json + '}';
  });

  // Replace class=" with className="
  bodyHtml = bodyHtml.replace(/class="/g, 'className="');
  
  // Close inputs
  bodyHtml = bodyHtml.replace(/<input(.*?)>/g, (match) => {
      if (!match.endsWith('/>')) return match.substring(0, match.length - 1) + ' />';
      return match;
  });

  const reactCode = `"use client";
import React, { useState } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import * as Icons from "lucide-react";

export default function Home() {
  const [activeScreen, setActiveScreen] = useState('landing'); // landing, onboarding, app
  
  return (
    <>
      <div className="toast" id="toast">
        <div className="toast-icon">✓</div>
        <span id="toast-msg">Tarefa adicionada!</span>
      </div>
      ${bodyHtml}
    </>
  );
}
`;

  fs.writeFileSync('src/app/page.tsx', reactCode, 'utf8');
  console.log("Extraction complete!");
} catch (e) {
  console.error(e);
}
