RHYTHM ∞ RAATRI — RESPONSIVE STATIC WEBSITE
HTML5 + CSS3 + VANILLA JAVASCRIPT ONLY

This package is a framework-free static website. It contains 25 pre-written HTML pages, one shared CSS stylesheet, one vanilla JavaScript file, original logo/photo assets, a sitemap, robots.txt and a custom 404 page. All internal page links now point directly to the destination index.html file (for example, about/index.html) rather than relying on a server to resolve a folder URL.

NO BUILD STEP REQUIRED
- No React, Angular, Vue, TypeScript, npm, bundler or package installation.
- No Node runtime or server-side application is needed to host the static pages.
- The website can be opened locally by double-clicking index.html or hosted on any standard static hosting service. The explicit index.html route links are included for local-file compatibility.

FOLDER STRUCTURE
- index.html: Homepage
- about/, experiences/, portfolio/, our-approach/, locations/, insights/, contact/ and legal routes
- css/site.css: Shared layout, typography, components and responsive breakpoints
- js/site.js: Mobile/desktop navigation, scroll header, reveal effects, portfolio filters and enquiry helper
- assets/brand/: Original supplied logo variations
- assets/placeholders/: Temporary illustrative photography
- sitemap.xml and robots.txt: Static SEO files
- 404.html: Custom not-found page
- IMAGE-REPLACEMENT-GUIDE.txt: Temporary image replacement map
- RESPONSIVE-QA-REPORT.txt: Browser and file validation results

PREVIEW LOCALLY
Option 1 — VS Code Live Server (recommended)
1. Extract the ZIP completely.
2. Open the extracted Rhythm-Raatri-HTML-CSS-JS folder in VS Code.
3. Install the Live Server extension if it is not already installed.
4. Right-click index.html and choose “Open with Live Server”.

Option 2 — Open directly (no server required)
1. Extract the ZIP completely.
2. Open the extracted Rhythm-Raatri-HTML-CSS-JS folder.
3. Double-click index.html.
4. All internal navigation points to explicit local index.html files; relative CSS, JS and images remain inside the extracted folder.
Do not open the HTML files while they are still inside the ZIP, and do not move individual HTML files away from their CSS, JS or assets folders.

DEPLOYMENT
Upload the CONTENTS of this folder to the public web root of Netlify, GitHub Pages,
Cloudflare Pages or another static host. Ensure index.html is in the web root.

All local CSS, JavaScript, image and page-navigation paths are relative to the current HTML file. This supports direct local-file preview, deployment at a domain root and deployment within a GitHub Pages project subdirectory, provided the directory structure is preserved. Navigation routes use explicit index.html destinations; canonical SEO URLs remain clean directory URLs. Upload sitemap.xml and robots.txt to the site root. Configure rhythmooraatri.com
and its DNS records according to the hosting provider's instructions.

RESPONSIVE BEHAVIOUR
- Mobile navigation switches to an accessible hamburger menu at 1120px and below.
- Layouts are adapted for small phones, large phones, tablets, laptops and wide desktop screens.
- The enquiry form progress indicator reflows on narrow screens.
- Focus states, keyboard controls, Escape handling and reduced-motion preferences are supported.
- When JavaScript is unavailable, the navigation remains visible and the page content remains readable.

ENQUIRY FORM — STATIC LIMITATION
The form validates required fields and creates a pre-filled email draft addressed to
info@rhythmooraatri.com using the visitor's configured email application. The visitor must review
and send the draft themselves. The static site does not send email automatically and does not
claim that an enquiry has been delivered. If no email application opens, the visitor can use the
direct email and WhatsApp details displayed on the contact page.

Automatic background email delivery requires a secure serverless function or an external form
service. That is intentionally not included in this HTML/CSS/JavaScript-only package.

BRAND
- Supplied logo artwork is used without redrawing or recolouring.
- Official colours: Royal Gold #D4AF57, Midnight Blue #5B7DAE, Deep Navy #1F306D, Pearl White #F6F6F6.
- Display type: Cinzel. Body/UI type: Montserrat. Google Fonts are optional; Georgia/Arial fallbacks
  keep the pages readable when the external font service is unavailable.

PHOTOGRAPHY
All visuals under assets/placeholders/ are temporary illustrative images. They are not actual
Rhythm ∞ Raatri customer projects. Replace them with licensed and approved photographs before
promoting the website as a portfolio of completed work. Keep existing filenames for simple
replacement without editing page markup. See IMAGE-REPLACEMENT-GUIDE.txt.

BUSINESS DETAILS
Website: https://rhythmooraatri.com
Phone / WhatsApp: +91 97759 91175
Email: info@rhythmooraatri.com
Primary regions: West Bengal, Jharkhand, Odisha and Chhattisgarh; projects accepted PAN India.
No unsupported office address, awards, reviews, founding year or client names have been invented.

QA
See RESPONSIVE-QA-REPORT.txt and INTERACTION-QA-RESULTS.json for link, asset, navigation, button, form, portfolio-filter and responsive checks. No software test can guarantee identical results on every device/browser combination, so review the deployed domain on the client devices before public launch.
