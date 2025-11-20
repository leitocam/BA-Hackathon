This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Netlify

This project is configured to deploy on Netlify with full Next.js support.

### Prerequisites
- Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
- Create a [Netlify account](https://app.netlify.com/signup)

### Deploy via Netlify UI

1. Go to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Connect your Git repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/.next`
5. Click "Deploy site"

### Deploy via Netlify CLI

```bash
# Install Netlify CLI globally
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy from the project root
netlify deploy --prod
```

### Environment Variables

If you need to add environment variables (e.g., for Web3 providers):
1. Go to Site settings → Environment variables in Netlify Dashboard
2. Add your variables (e.g., `NEXT_PUBLIC_ALCHEMY_API_KEY`)

### Features Supported
- ✅ Server-Side Rendering (SSR)
- ✅ Static Site Generation (SSG)
- ✅ Incremental Static Regeneration (ISR)
- ✅ API Routes
- ✅ Image Optimization
- ✅ React Server Components

## Deploy on Vercel

Alternatively, you can deploy on [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
