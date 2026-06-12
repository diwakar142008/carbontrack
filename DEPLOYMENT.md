# 🚀 DEPLOYMENT GUIDE

Quick guides for deploying your Carbon Footprint Tracker website to various platforms.

## Option 1: Netlify (Recommended - Easiest)

### Step 1: Sign Up
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub, GitLab, or email
3. Verify your email

### Step 2: Deploy
1. Click "Add new site" → "Deploy manually"
2. Drag and drop your `carbontrack` folder
3. Wait for deployment to complete
4. Your site is live!

### Step 3: Custom Domain (Optional)
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Follow the DNS instructions

**Pros:** Free, fast, automatic HTTPS, easy rollbacks
**Cons:** None really!

---

## Option 2: Vercel

### Step 1: Sign Up
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub or email
3. Verify your account

### Step 2: Deploy
1. Click "New Project"
2. Import the carbontrack folder
3. Leave settings as default
4. Click "Deploy"
5. Your site is live!

**Pros:** Lightning fast, great for static sites, Edge functions
**Cons:** Limited free tier

---

## Option 3: GitHub Pages (Free)

### Step 1: Create GitHub Repository
1. Go to [github.com](https://github.com)
2. Click "+" → "New repository"
3. Name it `carbontrack`
4. Click "Create repository"

### Step 2: Upload Files
```bash
# Clone the repository
git clone https://github.com/your-username/carbontrack.git
cd carbontrack

# Copy your files to this folder
# Then:

git add .
git commit -m "Initial commit: Carbon Footprint Tracker"
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to repository Settings
2. Click "Pages" in left sidebar
3. Under "Build and deployment"
4. Source: "Deploy from branch"
5. Branch: "main", Folder: "/ (root)"
6. Save

Your site is live at: `https://your-username.github.io/carbontrack`

**Pros:** Free, integrated with GitHub
**Cons:** Requires Git knowledge

---

## Option 4: Firebase Hosting

### Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Step 2: Initialize Firebase
```bash
firebase login
cd carbontrack
firebase init hosting
```

Choose:
- Project: Create new or select existing
- Public directory: `.` (current directory)
- Single page app: `N`
- Overwrite: `N`

### Step 3: Deploy
```bash
firebase deploy
```

Your site is live at: `https://your-project-id.web.app`

**Pros:** Free tier generous, real-time database options, functions
**Cons:** Requires Node.js setup

---

## Option 5: AWS S3 + CloudFront

### Step 1: Create S3 Bucket
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Sign up or login
3. Go to S3 service
4. Click "Create bucket"
5. Name it `carbontrack`
6. Uncheck "Block public access"
7. Create bucket

### Step 2: Upload Files
1. Open bucket
2. Click "Upload"
3. Add all your files
4. Click "Upload"

### Step 3: Enable Static Website Hosting
1. Go to bucket Settings
2. Scroll to "Static website hosting"
3. Click "Edit"
4. Enable "Static website hosting"
5. Index document: `index.html`
6. Save changes

Your site is live at: `http://carbontrack.s3-website-us-east-1.amazonaws.com`

**Pros:** Scalable, powerful
**Cons:** Costs money (even small amount)

---

## Option 6: Local Server (Development)

### Using Python 3
```bash
cd carbontrack
python -m http.server 8000
```
Visit: `http://localhost:8000`

### Using Python 2
```bash
cd carbontrack
python -m SimpleHTTPServer 8000
```
Visit: `http://localhost:8000`

### Using Node.js
```bash
npm install -g http-server
cd carbontrack
http-server
```
Visit: `http://localhost:8080`

---

## Domain Names

### Where to Buy
- [Namecheap](https://namecheap.com) - Cheap, reliable
- [GoDaddy](https://godaddy.com) - Popular, lots of options
- [Google Domains](https://domains.google) - Simple, trusted
- [Domain.com](https://domain.com) - Good deals

### Recommended Domains
- `carbontrack.com`
- `footprinttracker.io`
- `ecofootprint.app`
- `trackcarbon.com`

### Connect Domain to Netlify
1. Buy domain from registrar
2. Go to Netlify Site Settings
3. Domain management → Add domain
4. Update DNS records at registrar
5. Done!

---

## SSL/HTTPS

All hosting services below provide **free SSL certificates**:
- ✅ Netlify - Automatic
- ✅ Vercel - Automatic
- ✅ GitHub Pages - Automatic
- ✅ Firebase - Automatic
- ✅ AWS - Free (via CloudFront)

---

## Performance Tips After Deployment

### 1. Enable GZIP Compression
```bash
# Most hosts do this automatically
# Check: curl -I https://yoursite.com | grep gzip
```

### 2. Set Cache Headers
```
# .htaccess (for Apache servers)
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/html "access plus 1 days"
  ExpiresByType text/css "access plus 30 days"
  ExpiresByType text/javascript "access plus 30 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/gif "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
</IfModule>
```

### 3. Minify Resources
```bash
# Minify CSS
npm install -g csso-cli
csso styles.css -o styles.min.css

# Minify JS
npm install -g uglify-js
uglifyjs script.js -o script.min.js
```

### 4. Optimize Images
Use online tools:
- [TinyPNG](https://tinypng.com) - Compress PNG/JPG
- [Optimizilla](https://optimizilla.com) - Batch optimize
- [ImageOptim](https://imageoptim.com) - Mac app

### 5. Check Performance
- [Google PageSpeed Insights](https://pagespeed.web.dev)
- [GTmetrix](https://gtmetrix.com)
- [WebPageTest](https://webpagetest.org)

---

## SSL Certificate

If using a service without automatic SSL, you can get free certificates from:

### Let's Encrypt
```bash
# Using Certbot
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com
```

### Cloudflare (Free Plan)
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your site
3. Update nameservers at registrar
4. Enable SSL (automatic)

---

## Troubleshooting

### 404 Error
- Make sure `index.html` is in the root directory
- Check that all file paths are correct

### CSS/JS Not Loading
- Check file paths are relative (not absolute)
- Ensure files are in correct folders
- Clear browser cache (Ctrl+Shift+Delete)

### Animations Not Working
- Check browser compatibility
- Update browser to latest version
- Clear cache and reload (Ctrl+F5)

### Slow Loading
- Compress images
- Enable GZIP compression
- Use CDN for static files
- Minify CSS and JavaScript

---

## Recommended Setup

For **best experience**, use this setup:

1. **Hosting:** Netlify (free, easy, fast)
2. **Domain:** Namecheap or Google Domains
3. **CDN:** Cloudflare (optional, free tier available)
4. **Monitoring:** Google Analytics
5. **Email:** FormSubmit (for contact form)

**Total Cost:** $10-15/year (just domain)

---

## Next Steps

After deployment:

1. ✅ Test all links and animations
2. ✅ Test on mobile devices
3. ✅ Check performance with PageSpeed
4. ✅ Set up Google Analytics
5. ✅ Create sitemap.xml
6. ✅ Submit to Google Search Console
7. ✅ Share on social media
8. ✅ Monitor traffic

---

## Security Checklist

- ✅ Use HTTPS (all services provide this)
- ✅ Keep libraries updated
- ✅ No sensitive data in code
- ✅ Validate form inputs (server-side recommended)
- ✅ Use Content Security Policy header
- ✅ Regular backups of code

---

**Happy Deploying! 🚀**

Your Carbon Footprint Tracker is ready to help save the planet!
