# Gsplit Technical Stack

**Purpose:** Reference guide for all technical decisions, architecture, deployment, and development workflow for Gsplit.

---

## 🏗️ Architecture Overview

### **Frontend**
- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Routing:** React Router v6
- **State Management:** React hooks (useState, useLocation)
- **Notifications:** Sonner (toast library)
- **Deployment:** Vercel
- **Repository:** https://github.com/scubersteven/gsplit-app
- **Live URL:** https://gsplit-appshaffer-gnlxbdtg7-scuberstevens-projects.vercel.app (will eventually point to gsplit.app)

### **Backend**
- **Framework:** Flask (Python)
- **Deployment:** Railway
- **Live API:** https://g-split-judge-production.up.railway.app
- **Key Endpoints:**
  - `POST /analyze-split` - Main scoring endpoint
  - Accepts multipart/form-data with 'image' field
  - Returns JSON with score, feedback, distance, confidence

### **Computer Vision Pipeline**
- **Provider:** Roboflow Hosted Inference API
- **Architecture:** Three-model cascade system
  - **Model 1:** Pint detection (bounding box)
  - **Model 2:** Beer line detection (precise foam/beer boundary)
  - **Model 3:** G-bar detection (crossbar of the G logo)
- **Scoring Logic:**
  - **Tier 1 (Split detected):** 75-100% range, linear decay based on distance
  - **Tier 2 (No split):** 0-45% cap, quadratic decay
  - Formula: `score = 100 * exp(-distance_mm / 15)` with bonus tapering
- **Image Processing:** OpenCV, pytesseract for OCR

### **Domain & DNS**
- **Primary Domain:** gsplit.app
- **Instagram Handle:** @gsplit (owned)
- **DNS Provider:** TBD (need to configure)

---

## 📁 Project Structure

```
gsplit-app/
├── src/
│   ├── pages/
│   │   ├── GSplit.tsx          # Main camera/upload page
│   │   ├── GSplitResult.tsx    # Score results page
│   │   ├── PintSurvey.tsx      # Survey form
│   │   ├── PintLog.tsx         # Score history
│   │   ├── Map.tsx             # Pub map
│   │   └── Home.tsx            # Landing page
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── Layout.tsx          # App layout wrapper
│   │   └── GuidedCamera.tsx    # Live camera component
│   └── hooks/
│       └── useRoboflowDetection.ts  # Detection hook
├── api/                        # Flask backend (separate repo on Railway)
│   ├── app.py                  # Main Flask app
│   ├── requirements.txt
│   └── ...
└── public/
    └── assets/
```

---

## 🔌 API Integration

### **Frontend → Backend Communication**

**Endpoint:** `POST https://g-split-judge-production.up.railway.app/analyze-split`

**Request:**
```javascript
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('https://g-split-judge-production.up.railway.app/analyze-split', {
  method: 'POST',
  body: formData,
});
```

**Response:**
```json
{
  "score": 87.3,
  "distance_from_g_line_mm": 2.4,
  "g_line_detected": true,
  "confidence": 0.94,
  "feedback": "Perfect split. Absolute cinema 🎯",
  "detection_tier": "tier1"
}
```

**Environment Variables:**
- Frontend: `VITE_API_URL` (currently hardcoded in code)
- Backend: `ANTHROPIC_API_KEY` (for AI feedback generation)
- Backend: `ROBOFLOW_API_KEY` (for ML model access)

---

## 🚀 Deployment Workflow

### **Frontend (Vercel)**

**Automatic Deployment:**
1. Push to `main` branch on GitHub
2. Vercel auto-deploys (connected to GitHub repo)
3. Build command: `npm run build`
4. Output directory: `dist`
5. Environment variables configured in Vercel dashboard

**Manual Deployment:**
```bash
cd "/Users/justinshaffer/Desktop/GSPLIT App"
git add .
git commit -m "Description"
git push origin main
# Vercel auto-deploys in ~2 minutes
```

### **Backend (Railway)**

**Automatic Deployment:**
1. Backend is in separate git repo (inside `api/` folder)
2. Connected to Railway directly
3. Push to Railway triggers rebuild

**Manual Deployment:**
```bash
cd "/Users/justinshaffer/Desktop/GSPLIT App/api"
git add .
git commit -m "Description"
git push origin main
# Railway auto-deploys in ~3 minutes
```

---

## 🎨 Design System

### **Colors (Guinness-inspired)**
```css
--near-black: #0A0A0A        /* Primary background */
--warm-white: #F5F5F0        /* Primary text */
--foam-cream: #FFF8E7        /* Accents, highlights */
--satin-gold: #D4AF37        /* Premium accents */
--precision-green: #10B981   /* Success, good scores */
```

### **Typography**
- **Headings:** Bold, tracking-tight
- **Body:** Regular, comfortable line-height
- **Scores:** 7xl, bold, green

### **Component Style**
- Dark theme (near-black backgrounds)
- Subtle borders (border-border)
- Rounded corners (rounded-lg)
- Hover effects (scale-[1.02])
- Clean, minimal, premium feel

---

## 📊 Data Flow

### **Current (No Backend Database)**
1. User uploads/captures image
2. Frontend sends to Flask API
3. Flask calls Roboflow for detection
4. Flask calculates score
5. Returns to frontend
6. Frontend displays results
7. **No persistence** - data lost on page refresh

### **Future (With Database)**
1. Same as above, but...
2. Flask saves score to database with:
   - User ID (if logged in)
   - Timestamp
   - Location (if shared)
   - Score + metadata
3. Frontend can query historical data
4. Powers leaderboards, streaks, stats

---

## 🔮 Planned Tech Additions

### **Database (Required for Phase 2)**
**Options:**
- **PostgreSQL on Railway** (Recommended)
  - Same platform as Flask
  - Easy integration
  - Scalable
  
- **Firebase/Firestore**
  - Good for real-time leaderboards
  - Easy auth integration
  - Simpler setup

**Schema (Initial):**
```sql
users:
  - id (primary key)
  - username
  - email (optional)
  - created_at
  
scores:
  - id (primary key)
  - user_id (foreign key)
  - score (float)
  - image_url (text)
  - pub_name (text, nullable)
  - latitude (float, nullable)
  - longitude (float, nullable)
  - feedback (text)
  - created_at (timestamp)
  
streaks:
  - user_id (foreign key)
  - current_streak (int)
  - longest_streak (int)
  - last_score_date (date)
```

### **Authentication**
**Options:**
- **Clerk** (Easiest) - Drop-in auth UI
- **Supabase Auth** - If using Supabase for DB
- **Firebase Auth** - If using Firebase
- **Custom JWT** - More control, more work

**Requirements:**
- Username/email signup
- Optional - social login (Google, Apple)
- Anonymous mode (score without account)
- Account creation prompted after 2nd score

### **Push Notifications**
- **Firebase Cloud Messaging** (FCM)
- Triggers:
  - Streak reminder (daily)
  - Challenge from friend
  - Climbed leaderboard position
  - New challenge available

### **Image Storage**
**Current:** Images in memory only (not saved)

**Future:**
- **Cloudinary** (Recommended)
  - Free tier: 25GB storage
  - Image optimization
  - CDN delivery
- **AWS S3**
  - Cheaper at scale
  - More setup

---

## 🛠️ Development Setup

### **Local Development**

**Frontend:**
```bash
cd "/Users/justinshaffer/Desktop/GSPLIT App"
npm install
npm run dev
# Runs on http://localhost:5173
```

**Backend:**
```bash
cd "/Users/justinshaffer/Desktop/GSPLIT App/api"
pip install -r requirements.txt --break-system-packages
python app.py
# Runs on http://localhost:5001
```

**Full Stack:**
- Frontend points to Railway in production
- For local testing, update API URL in code to `http://localhost:5001`

### **Environment Variables**

**Frontend (.env):**
```
VITE_API_URL=https://g-split-judge-production.up.railway.app
```

**Backend (.env):**
```
ANTHROPIC_API_KEY=sk-ant-...
ROBOFLOW_API_KEY=...
FLASK_ENV=production
PORT=5001
```

---

## 🧪 Testing Strategy

### **Current Testing**
- Manual testing with known images in `/Desktop/Full pints/`
- Test images: 98.2.jpg (good), 64.4.jpg (marginal), 91.4.jpg (bad)

### **Future Testing**
- Unit tests for scoring algorithm
- Integration tests for API endpoints
- E2E tests with Playwright (camera flow)
- Visual regression tests for UI

---

## 🐛 Known Issues & Workarounds

### **Model 2 Missing Marginal Splits**
**Issue:** Beer lines barely inside G don't get detected
**Status:** Acceptable - scores correctly at 44% (Tier 2)
**Fix:** Could lower Model 2 confidence threshold, but not urgent

### **Condensation on Glass**
**Issue:** Water droplets confuse detection (91.4.jpg)
**Status:** Edge case, acceptable failure
**Fix:** Preprocessing to detect/remove condensation artifacts

### **CORS on Railway**
**Status:** Resolved - CORS headers configured
**Config:** `@cross_origin()` decorator in Flask

---

## 📦 Dependencies

### **Frontend (package.json)**
```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-router-dom": "^6.26.2",
    "tailwindcss": "^3.4.1",
    "@radix-ui/react-*": "...",
    "sonner": "^1.5.0",
    "lucide-react": "^0.index"
  }
}
```

### **Backend (requirements.txt)**
```
flask==3.0.0
flask-cors==4.0.0
requests==2.31.0
opencv-python==4.8.1
pytesseract==0.3.10
anthropic==0.7.0
pillow==10.1.0
```

---

## 🔒 Security Considerations

### **Current Security**
- No authentication (anyone can use API)
- Rate limiting: None (rely on Railway's defaults)
- API keys stored in Railway environment variables

### **Future Security**
- Add API authentication (JWT tokens)
- Rate limiting per user (prevent abuse)
- Image upload validation (file type, size)
- Sanitize user inputs (pub names, usernames)
- HTTPS enforced (already done via Vercel/Railway)

---

## 📈 Performance Considerations

### **Current Performance**
- ML inference: ~2-3 seconds via Roboflow API
- Image upload: Depends on user connection
- No caching

### **Future Optimizations**
- Cache leaderboard queries (Redis)
- Image compression before upload
- Lazy load images in pint log
- Pagination for large datasets
- CDN for static assets (Cloudinary)

---

## 🚨 Critical Technical Decisions

### **Why Flask over FastAPI?**
- Simpler for single endpoint
- Easier debugging
- Adequate performance for current scale

### **Why Roboflow Hosted vs Self-Hosted?**
- Zero infrastructure management
- Automatic scaling
- $0 cost for current usage
- Can switch to self-hosted if needed (models are trained)

### **Why Vercel over Netlify?**
- Better Next.js integration (future-proofing)
- Edge functions if needed
- Cleaner dashboard

### **Why Railway over Heroku?**
- Heroku killed free tier
- Railway has better DX
- Easier environment management

---

## 🔄 Migration Path (If Needed)

### **If Roboflow Becomes Too Expensive:**
1. Export trained models from Roboflow
2. Deploy to AWS Lambda with Torch/ONNX
3. Update Flask to call Lambda instead of Roboflow
4. Keep same API interface

### **If Railway Becomes Too Expensive:**
1. Containerize Flask app (Dockerfile)
2. Deploy to:
   - **AWS ECS/Fargate**
   - **Google Cloud Run**
   - **Fly.io**
3. Update frontend API URL

### **If Need Real-Time Features:**
1. Add WebSocket support (Flask-SocketIO)
2. Push live leaderboard updates
3. Real-time challenge notifications

---

## 📝 Technical Debt

**Current Debt:**
1. No database - can't persist scores
2. No error handling in API calls
3. Hardcoded API URL in frontend (should use env var)
4. No loading states for slow connections
5. No retry logic for failed uploads

**Prioritized Cleanup:**
1. Add database (Phase 2 blocker)
2. Proper error handling
3. Loading states
4. Environment variable cleanup

---

## 🎯 Tech Stack Decision Matrix

**When to use what:**

| Feature | Tech Choice | Why |
|---------|-------------|-----|
| User auth | Clerk | Fastest, best UX |
| Database | PostgreSQL on Railway | Same platform, familiar |
| Image storage | Cloudinary | Free tier, optimization |
| Push notifications | FCM | Cross-platform, reliable |
| Analytics | Mixpanel | Event-based, good for funnels |
| Error tracking | Sentry | Best DX, React integration |

---

## 🚀 Deployment Checklist

**Before deploying new features:**
- [ ] Test locally with backend running
- [ ] Check Railway logs for errors
- [ ] Verify API endpoint returns expected format
- [ ] Test on mobile (iOS + Android)
- [ ] Check performance (Lighthouse score)
- [ ] Verify CORS headers
- [ ] Check environment variables are set

**After deploying:**
- [ ] Test live deployment end-to-end
- [ ] Monitor Railway logs for errors
- [ ] Check Vercel deployment logs
- [ ] Test on actual mobile devices
- [ ] Verify Instagram share works

---

**Remember: Keep it simple. Ship fast. Optimize later.**
