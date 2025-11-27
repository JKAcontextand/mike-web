# Mike Web App - Deployment Guide

## Vercel Deployment (Recommended - 5 minutes)

### Prerequisites
- GitHub account
- Vercel account (free tier is fine)
- Your Anthropic API key

### Step 1: Push to GitHub

1. **Create GitHub repo:**
   - Go to: https://github.com/new
   - Repo name: `mike-web` (or your choice)
   - Keep it **Private** (recommended - contains coaching methodology)
   - **DO NOT** add README, .gitignore, or license (we have them)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/mike-web.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your GitHub username.

### Step 2: Deploy to Vercel

1. **Go to Vercel:**
   - Visit: https://vercel.com/
   - Log in (or sign up with GitHub)

2. **Import Project:**
   - Click "Add New..." → "Project"
   - Select your `mike-web` repository from GitHub
   - Click "Import"

3. **Configure Project:**
   - Framework Preset: **Next.js** (should auto-detect)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Add Environment Variable:**
   - Click "Environment Variables"
   - Name: `ANTHROPIC_API_KEY`
   - Value: `[paste your API key]`
   - Environment: Production, Preview, Development (select all)
   - Click "Add"

5. **Deploy:**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://mike-web-abc123.vercel.app`

### Step 3: Test Production

1. Visit your Vercel URL
2. Test a coaching conversation
3. Verify everything works

### Step 4: Custom Domain (Optional)

If you want a custom domain:
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `mike.yourdomain.com`)
4. Follow DNS configuration instructions

---

## Alternative: Manual Deployment

If you prefer not to use Vercel:

### Build for Production

```bash
npm run build
npm start
```

Then deploy the built files to any Node.js hosting provider.

---

## Important Notes

### Security
- ✅ `.env.local` is git-ignored (API key safe)
- ✅ Always use environment variables for secrets
- ✅ Never commit API keys to git

### Sharing with Colleague

Once deployed, simply share the Vercel URL:
```
https://your-project.vercel.app
```

No login required - they can start using Mike immediately.

### Monitoring

Vercel provides:
- **Analytics**: Usage statistics
- **Logs**: Runtime logs for debugging
- **Performance**: Response times

Access via Vercel dashboard.

### Updates

To update the deployed app:
1. Make changes locally
2. Test with `npm run dev`
3. Commit: `git add . && git commit -m "Your message"`
4. Push: `git push`
5. Vercel auto-deploys (2-3 minutes)

---

## Troubleshooting

### Build Fails
- Check Vercel build logs
- Verify all dependencies in `package.json`
- Test build locally: `npm run build`

### API Key Issues
- Verify key is set in Vercel environment variables
- Regenerate key if compromised
- Check API key format (should start with `sk-ant-api03-`)

### Slow Responses
- Normal for first request (cold start)
- Subsequent requests faster
- Consider Vercel Pro for better performance

---

## Cost Estimates

### Vercel
- **Free tier**: Sufficient for MVP
  - 100 GB bandwidth/month
  - Unlimited deployments
  - Automatic HTTPS
- **Pro ($20/month)**: For production use
  - No cold starts
  - More bandwidth
  - Priority support

### Anthropic API
- **Sonnet 4**: ~$3/$15 per million tokens (input/output)
- **Typical coaching session**: $0.50-2.00
- **Monthly (100 sessions)**: ~$50-200

---

## Next Steps

1. ✅ Deploy to Vercel
2. ✅ Test with colleague
3. ✅ Gather feedback
4. 🔄 Iterate based on use

Ready to deploy? Follow Step 1 above!
