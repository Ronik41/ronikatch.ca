# Roni Katcharovski's Portfolio

A Discord-themed portfolio website with a secure AI chatbot powered by Google Gemini.

## 🚀 Features

- **Discord-themed UI** - Mimics Discord's interface design
- **AI Chatbot** - Powered by Google Gemini with secure server-side API
- **Company Servers** - Detailed experience pages for Tesla, WHOOP, Ford, Electrium, and Exceed Robotics
- **Responsive Design** - Works on desktop and mobile
- **Secure API** - API key protected with Vercel serverless functions

## 🔒 Security

- **Server-side API key** - Never exposed to client-side code
- **Rate limiting** - Prevents API abuse
- **CORS protection** - Secure cross-origin requests
- **Input validation** - Prevents harmful content

## 🛠️ Deployment

### Option 1: Vercel (Recommended for AI features)

1. **Deploy to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```

2. **Set Environment Variable:**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your-api-key-here`

3. **Update API Endpoint:**
   - Update `apiEndpoint` in `discord-app-ai.js` with your Vercel URL

### Option 2: GitHub Pages (Static only)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy portfolio"
   git push origin main
   ```

2. **Enable GitHub Pages:**
   - Go to Repository Settings → Pages
   - Select source branch: `main`
   - Set custom domain: `ronikatch.ca`

## 📁 Project Structure

```
├── api/
│   └── chat.js              # Secure serverless function
├── images/                  # Profile pictures and banners
├── logos/                   # Company logos
├── discord-portfolio.html   # Main homepage
├── *-server.html           # Company experience pages
├── discord-styles.css      # Discord-themed styling
├── discord-app-ai.js       # Frontend chatbot logic
├── vercel.json             # Vercel configuration
└── package.json            # Dependencies
```

## 🔧 Development

1. **Local Development:**
   ```bash
   # For static site
   python -m http.server 8000
   
   # For Vercel with API
   vercel dev
   ```

2. **Environment Variables:**
   - Create `.env.local` with `GEMINI_API_KEY=your-key`

## 📞 Contact

- **Email:** roni.katch@gmail.com
- **LinkedIn:** linkedin.com/in/roni-katcharovski
- **Website:** ronikatch.ca

## ⚖️ Legal

This is a personal portfolio website created as a parody/tribute to Discord's interface design. This website is not affiliated with, endorsed by, or connected to Discord Inc. in any way.
