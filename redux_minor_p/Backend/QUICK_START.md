# Quick Start Guide - Authentication Backend

## ⚡ 5-Minute Setup

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Environment
Edit `.env` file:
```env
PORT=3001
MONGO_URI=mongodb+srv://server:ayuXjHV15MngZmDv@cluster0.22wui8u.mongodb.net/redux_minor_p

# Generate strong secrets: https://generate-random.org/
JWT_ACCESS_SECRET=your_strong_random_secret_here
JWT_REFRESH_SECRET=your_strong_random_secret_here

# Get from Google Cloud Console: https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

FRONTEND_URL=http://localhost:3000
```

### 3. Start Server
```bash
npm run dev
```

Server runs at: `http://localhost:3001`

---

## 🧪 Test Endpoints (Using Postman/Curl)

### Register New User
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {...},
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### Login User
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Current User (Protected Route)
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Register Same Email Again
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

**Response:**
```json
{
  "success": false,
  "message": "User already exist with this email address"
}
```

---

## 📁 Project Structure Reference

```
Backend/
├── src/
│   ├── auth/
│   │   ├── controllers/      ← Business logic
│   │   │   └── auth.controller.js
│   │   ├── models/           ← Database schemas
│   │   │   └── user.model.js
│   │   ├── routes/           ← API endpoints
│   │   │   └── auth.routes.js
│   │   ├── middleware/       ← Token verification
│   │   │   └── jwt.middleware.js
│   │   └── strategies/       ← OAuth strategies
│   │       └── google.strategy.js
│   ├── config/               ← Configuration
│   │   ├── config.js
│   │   └── db.js
│   ├── utils/                ← Helper functions
│   │   ├── jwt.utils.js      ← Token generation
│   │   ├── validators.js     ← Input validation
│   │   └── errorHandler.js   ← Error utilities
│   ├── middleware/           ← Global middleware
│   │   └── errorMiddleware.js
│   ├── app.js                ← Express setup
│   └── routes/               ← Other routes
│       └── routes.js
├── server.js                 ← Server entry
├── package.json
├── .env                      ← Configuration (don't commit)
├── .env.example              ← Template
├── AUTH_SETUP.md             ← Full setup guide
├── API_DOCUMENTATION.md      ← Endpoint docs
└── FLOW_DIAGRAMS.md          ← Visual flows
```

---

## 🔑 Key Features

✅ **User Registration**
- Bcrypt password hashing (10 rounds)
- Email validation
- Duplicate email check → "User already exist"
- Access & Refresh tokens

✅ **User Login**
- Email & password verification
- JWT token generation
- Secure password comparison

✅ **Protected Routes**
- JWT middleware authentication
- User attached to request
- Token expiry handling

✅ **Google OAuth**
- Google login integration
- Automatic user creation
- Account linking
- Profile picture storage

✅ **Token Management**
- Access Token (15 minutes)
- Refresh Token (30 days)
- Token refresh endpoint
- Logout & revocation

✅ **Error Handling**
- Validation errors with details
- JWT error handling
- Duplicate key errors
- Global error middleware

---

## 🧠 How It Works

### 1. Register → Login Flow
```
User fills form → Validate → Check if exists → Hash password
→ Save to DB → Generate tokens → Return tokens → Frontend stores
```

### 2. Protected Route Flow
```
Frontend sends request + token → Extract token → Verify signature
→ Check expiry → Get user from DB → Attach to request → Allow access
```

### 3. Google OAuth Flow
```
User clicks Google → Redirect to Google → User grants permission
→ Google returns profile → Check/create user in DB → Generate tokens
→ Redirect to frontend with tokens
```

---

## 🔧 Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `PORT` | Server port | 3001 |
| `MONGO_URI` | Database URL | mongodb+srv://... |
| `JWT_ACCESS_SECRET` | Access token secret | Any random string |
| `JWT_REFRESH_SECRET` | Refresh token secret | Any random string |
| `JWT_ACCESS_EXPIRE` | Token validity | 15m |
| `JWT_REFRESH_EXPIRE` | Refresh validity | 30d |
| `GOOGLE_CLIENT_ID` | Google OAuth ID | *.apps.googleusercontent.com |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | Random string from Google |
| `GOOGLE_CALLBACK_URL` | Google redirect URL | http://localhost:3001/... |
| `FRONTEND_URL` | Frontend address | http://localhost:3000 |

---

## 🐛 Common Issues & Solutions

### Issue: "User already exist"
**Solution:** Email is registered. Use login or different email.

### Issue: "Invalid email or password"
**Solution:** Check credentials. Email or password is incorrect.

### Issue: "Token has expired"
**Solution:** Use refresh token to get new access token.

### Issue: "Unauthorized access"
**Solution:** Token not provided or invalid. Login again.

### Issue: Google OAuth not working
**Solution:** Check credentials in .env. Verify redirect URL in Google Console.

---

## 📞 API Quick Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/register` | ❌ | Create account |
| POST | `/login` | ❌ | Login user |
| POST | `/refresh-token` | ❌ | Get new access token |
| POST | `/logout` | ✅ | Logout from device |
| POST | `/logout-all` | ✅ | Logout all devices |
| GET | `/me` | ✅ | Get user profile |
| GET | `/google` | ❌ | Google OAuth flow |
| POST | `/google-callback` | ❌ | Google OAuth handler |

---

## ✨ Production Checklist

- [ ] Change `JWT_ACCESS_SECRET` to strong random secret
- [ ] Change `JWT_REFRESH_SECRET` to strong random secret
- [ ] Use HTTPS only
- [ ] Enable CORS for frontend domain only
- [ ] Set `NODE_ENV=production`
- [ ] Add rate limiting on auth endpoints
- [ ] Add email verification
- [ ] Add password reset
- [ ] Monitor failed login attempts
- [ ] Use httpOnly cookies for tokens
- [ ] Implement refresh token rotation
- [ ] Add 2FA (Two-Factor Authentication)
- [ ] Setup logging & monitoring
- [ ] Regular security audits

---

## 📚 Documentation Files

1. **AUTH_SETUP.md** - Complete setup & configuration guide
2. **API_DOCUMENTATION.md** - All endpoints with examples
3. **FLOW_DIAGRAMS.md** - Visual flows & architecture
4. **QUICK_START.md** - This file (quick reference)

---

## 🎯 Next Steps

1. **Test Locally** - Use Postman/curl to test endpoints
2. **Setup Frontend** - Create register/login components
3. **Connect Frontend** - Integrate with React app
4. **Add Features** - Email verification, password reset, 2FA
5. **Deploy** - Deploy to production server
6. **Monitor** - Setup logging & error tracking

---

## 💡 Tips

- Store tokens in `localStorage` or secure cookies
- Auto-refresh token before expiry
- Clear tokens on logout
- Validate email format on frontend & backend
- Use strong passwords (min 8 chars recommended)
- Never expose JWT secrets in frontend code
- Implement proper error messages for users

---

## ❓ Need Help?

- Check **API_DOCUMENTATION.md** for endpoint details
- See **FLOW_DIAGRAMS.md** for visual flows
- Review **AUTH_SETUP.md** for complete setup guide
- Check `.env.example` for variable reference

---

**Happy Coding! 🚀**
