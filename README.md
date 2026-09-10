# El Asador — restaurant website redesign

The original React 19, TypeScript and Vite project is preserved. The Downloads archive is unchanged.

## Run

Use Node.js 22 or newer. Run `npm ci`, then `npm run dev`. For a production preview, run `npm run build` and `npm run preview`. `npm run lint` checks TypeScript. The build uses Vite's runner config loader for portable ES module configuration.

## What works

- Sticky navigation, mobile navigation with Escape dismissal, anchor links and mobile actions.
- Six menu categories, search across all dishes, and an empty-results state.
- Dish preferences, optional notes, an editable pickup list, quantity controls, removal, subtotal and copy-to-clipboard.
- Phone handoff for pickup, reservation and catering enquiries. Nothing is falsely confirmed or submitted.
- Gallery lightbox with previous/next controls, Escape dismissal, native focus containment and focus restoration.
- Address, supplied hours and Google Maps directions.
- Responsive layouts, skip link, visible keyboard focus, reduced-motion support, descriptive alternative text and semantic sections.
- Page metadata, restaurant structured data, favicon and robots.txt.

## Restaurant information and launch requirements

The original project supplies the menu/prices, address, phone number and hours. The address is also present in public listings. The supplied phone is (512) 645-1237; public search results contain a conflicting phone number. Confirm the restaurant's actual phone, hours, full menu, prices, drinks service, reservation policy and catering availability with its owner before public launch. The private preview identifies inherited menu/hours data as needing confirmation. No reviews, awards, family ownership, parking claims, precise cooking times or dietary guarantees are presented as facts.

Photos are stock images from the original project's Unsplash references, downloaded as local assets. They are labelled as illustrative, including the interior mood image. Replace them with owner-approved photographs before public launch. Images: Unsplash photo IDs 1555939594-58d7cb561ad1, 1551504734-5ee1c4a1479b, 1544025162-d76694265947, 1517248135467-4c7edcad34c4.

The site has no booking/payment backend. Pickup lists are temporary page state and reset on reload; no personal information is sent or stored. To enable online transactions, connect an owner-approved booking or ordering provider and replace the phone handoffs. A phone link opens the visitor's calling application; the site cannot verify that a call is completed.

## Editing

The active layout and interactions are in src/App.tsx. Styles are in src/index.css. Existing supplied menu and contact data are in src/data/restaurantData.ts; shorter display descriptions are in App.tsx. The old components remain as archived source context and are not imported by the new app.
