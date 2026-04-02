# AI Policy Coverage Matrix

A comprehensive dashboard mapping AI governance frameworks against frontier AI risks. This application provides a systematic analysis of how existing and proposed policies address 8 major risk categories and 29 subcategories.

## Features

- **Interactive Matrix**: Visual heatmap showing policy coverage across risk categories
- **Expandable Categories**: Click category headers to view detailed subcategory breakdowns
- **Filtering**: Filter by creator category (Western Gov, Non-Western Gov, Multilateral, Private Sector) and binding status
- **Detail Panels**: Click any cell to view scoring rationale and clause references
- **Risk Legend**: Visual key showing all 8 risk categories with icons and descriptions
- **Methodology Documentation**: Transparent scoring rubric (0-3 scale)
- **Responsive Design**: Mobile-friendly with horizontal scrolling for the matrix

## Tech Stack

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS v4** for styling
- **Recharts** for data visualization

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project Structure

```
app/
├── src/
│   ├── components/
│   │   ├── PolicyMatrix.tsx    # Main dashboard component
│   │   └── RiskIcons.tsx       # Custom SVG icons for 8 risk categories
│   ├── data/
│   │   ├── taxonomy.json       # Risk categories and subcategories
│   │   ├── policies.json       # Policy metadata
│   │   └── matrix.json         # Scoring data
│   ├── App.tsx
│   ├── App.css
│   └── index.css
├── dist/                       # Production build output
├── vite.config.ts
├── package.json
└── _redirects                  # SPA routing for Netlify/Vercel
```

---

## Deployment

### Quick Deploy Options

#### Vercel

**Option 1: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from app directory
cd app
vercel
```

**Option 2: GitHub Integration**

1. Push your code to GitHub
2. Visit [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Set the following:
   - **Framework Preset**: Vite
   - **Root Directory**: `app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click Deploy

**vercel.json** (optional, for advanced configuration):

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

#### Netlify

**Option 1: Netlify CLI**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy from app directory
cd app
netlify deploy --prod
```

**Option 2: GitHub Integration**

1. Push your code to GitHub
2. Visit [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Set the following build settings:
   - **Base directory**: `app`
   - **Build command**: `npm run build`
   - **Publish directory**: `app/dist`
6. Click "Deploy site"

**netlify.toml** (alternative configuration):

```toml
[build]
  base = "app"
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

#### Static Hosting (Manual)

1. Build the project:
   ```bash
   cd app
   npm run build
   ```

2. Upload the `dist/` folder to your static host:
   - **GitHub Pages**: Push `dist/` contents to `gh-pages` branch
   - **Cloudflare Pages**: Connect repo, set build command to `npm run build`, publish directory to `dist`
   - **AWS S3 + CloudFront**: Upload `dist/` contents to S3 bucket, configure CloudFront distribution
   - **Firebase Hosting**: Run `firebase deploy` after configuring `firebase.json`

---

### Environment Variables

No environment variables are required. The application loads all data from local JSON files.

### Build Configuration

The Vite configuration (`vite.config.ts`) is set up for:

- Root path deployment (`base: '/'`)
- Production minification
- Source maps disabled for smaller bundle size

For subdirectory deployment (e.g., `example.com/ai-matrix/`), update `vite.config.ts`:

```ts
export default defineConfig({
  base: '/ai-matrix/',
  // ... rest of config
})
```

---

## Data Sources

The matrix analyzes policies from:

- **Western Governments**: EU AI Act, California SB-53, EU DSA, etc.
- **Non-Western Governments**: China GenAI Measures
- **Multilateral Bodies**: CoE AI Convention, Bletchley Declaration, G7 Hiroshima, OECD, UNESCO, NIST, ISO
- **Private Sector**: Anthropic, OpenAI, Google DeepMind, Meta, Google

## Scoring Methodology

| Score | Label | Description |
|-------|-------|-------------|
| 0 | Not addressed | No explicit mention or consideration |
| 1 | Mentioned | Acknowledged in preamble/principles only |
| 2 | Provisions | Specific operative provisions exist |
| 3 | Provisions + enforcement | Backed by audits, penalties, or oversight |

## License

MIT

## Author

**Covi Franklin**  
[LinkedIn](https://www.linkedin.com/in/covi-franklin-005896190/)
