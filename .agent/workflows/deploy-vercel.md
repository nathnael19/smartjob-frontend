---
description: how to deploy the React application to Vercel
---

Follow these steps to deploy your React application to Vercel:

### 1. Prepare your Project
Ensure your project is committed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Add `vercel.json` (Required for SPAs)
Since this is a Single Page Application (SPA), you need to ensure all routes are redirected to `index.html`. Create a `vercel.json` file in your root directory:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### 3. Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New** > **Project**.
3. Import your Git repository.
4. **Project Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   Add the following variables (you can find these in your `.env` file):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - Any other variables starting with `VITE_`.
6. Click **Deploy**.

### 4. Deploy via Vercel CLI (Alternative)
If you prefer the command line:
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in your project root and follow the prompts.
3. Add your environment variables in the Vercel dashboard after the first deployment.
