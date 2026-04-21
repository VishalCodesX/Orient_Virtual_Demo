# Virtual Demo Site

A production-ready React + Vite web application for interactive product discovery across the Orient Solutions portfolio, including RAPTOR smart classroom products and KYOCERA printing solutions.

The platform combines rich product storytelling, media galleries, AI-assisted chat, and AR/3D previews to help customers evaluate products before purchase.

## Highlights

- Product-focused web experience with dedicated brand pages for RAPTOR and KYOCERA.
- Dynamic product detail pages with technical specs, features, brochure links, and media.
- AR-ready product visualization for supported RAPTOR products.
- In-site chatbot with local knowledge base and optional Gemini fallback for broader questions.
- Responsive UI built with Tailwind CSS and modern interaction patterns.
- Deploy-ready configuration for Vercel.

## Product Scope

### RAPTOR Portfolio

- Interactive Panels: 65", 75", 86"
- Smart Podium
- OPS Computer
- LED Wall Display

### KYOCERA Portfolio

- TASKalfa series
- ECOSYS series

## Tech Stack

- React 18
- Vite 4
- React Router DOM 6
- Tailwind CSS 3
- Three.js + React Three Fiber + Drei (3D/AR support)
- Framer Motion
- Lucide React
- ESLint

## Project Structure

```text
src/
	components/
		ARModal.jsx
		ModelViewer.jsx
		ProductCard.jsx
		CameraAR/
		ChatBot/
	data/
		products.js
	pages/
		HomePage.jsx
		KyoceraPage.jsx
		RaptorPage.jsx
		ProductDetailPage.jsx
	utils/
		three-utils.js
public/
	images/
	models/
	brochures/
	videos/
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended LTS)
- npm 9+

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Create Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Environment Variables

The chatbot can run fully on local knowledge, but Gemini can be enabled for advanced/general queries.

Create a `.env` file in the project root:

```env
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

Notes:

- Current chatbot integration reads `REACT_APP_GEMINI_API_KEY`.
- In Vite projects, `VITE_` prefix is the standard for client-exposed variables. If you migrate this key handling, update code accordingly.

## AR and 3D Notes

- 3D model files are served from `public/models`.
- AR behavior depends on device/browser support.
- iOS Safari uses Quick Look (`.usdz`).
- Compatible Android devices use WebXR / Scene Viewer paths.
- Secure context is recommended for AR (HTTPS in production).

## Deployment

This project includes `vercel.json` for SPA routing and static asset caching.

### Deploy to Vercel

1. Import the repository into Vercel.
2. Keep framework as Vite.
3. Add required environment variables in Vercel project settings.
4. Deploy.

Configured behavior includes:

- SPA rewrite to `index.html`.
- Long cache headers for model assets.
- Optimized cache headers for image assets.

## Operational Checklist

Before promoting a release:

1. Run `npm run lint` and resolve warnings/errors.
2. Run `npm run build` and verify no build-time warnings that affect runtime.
3. Validate home navigation and product category pages.
4. Validate product detail rendering for at least one KYOCERA and one RAPTOR product.
5. Validate brochure view/download links.
6. Validate AR trigger behavior on at least one supported mobile device.
7. Validate chatbot quick replies, contact actions, and fallback responses.

## Contact

- Sales: sales@orientsolutions.com
- Phone: +91 98409 09409

## License

No open-source license is currently declared in this repository.
