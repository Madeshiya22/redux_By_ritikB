# Authentication System - Setup & Implementation Guide

## 📁 Folder Structure (Industry Standard)

```
Backend/
├── src/
│   ├── auth/
│   │   ├── controllers/
│   │   │   └── auth.controller.js       # Auth business logic
│   │   ├── models/
│   │   │   └── user.model.js           # User schema & methods
│   │   ├── routes/
│   │   │   └── auth.routes.js          # Auth endpoints
│   │   ├── middleware/
│   │   │   └── jwt.middleware.js       # JWT verification
│   │   └── strategies/
│   │       └── google.strategy.js       # Google OAuth config
│   ├── config/
│   │   ├── config.js                    # Environment config
│   │   └── db.js                        # Database connection
│   ├── utils/
│   │   ├── jwt.utils.js                # JWT generation & verification
│   │   ├── validators.js               # Input validation
│   │   └── errorHandler.js             # Error handling utilities
│   ├── middleware/
│   │   └── errorMiddleware.js          # Global error handler
│   ├── app.js                           # Express app setup
│   └── routes/
│       └── routes.js                    # Other routes
├── server.js                            # Server entry point
├── package.json                         # Dependencies
├── .env                                 # Environment variables
└── .env.example                         # Example env template
```

## 🚀 Installation & Setup

### Step 1: Install Dependencies
```bash
cd Backend
npm install
```

This installs:
- `bcrypt` - Password hashing
- `jsonwebtoken` - JWT tokens
- `passport` - Authentication middleware
- `passport-google-oauth20` - Google OAuth strategy

### Step 2: Setup Environment Variables

Copy `.env.example` to `.env` and configure:

```env
PORT=3001
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string

# Strong random secrets (use: https://generate-random.org/)
JWT_ACCESS_SECRET=your_strong_random_secret_here
JWT_REFRESH_SECRET=your_strong_random_secret_here

# Get from https://console.cloud.google.com/
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

FRONTEND_URL=http://localhost:3000
```

### Step 3: Generate JWT Secrets (Production)

```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((Get-Random -InputObject (0..255) -Count 32))
```

### Step 4: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable OAuth 2.0
4. Create OAuth 2.0 credentials (Web application)
5. Set Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
6. Copy Client ID and Secret to `.env`

### Step 5: Start Server

```bash
# Development with hot reload
npm run dev

# Production
npm start
```

Server will run on `http://localhost:3001`

---

## 🔐 Authentication Features

### 1. **User Registration**
- Email validation
- Password hashing with bcrypt (10 salt rounds)
- Duplicate email check → "user already exist" message
- Returns access & refresh tokens

### 2. **User Login**
- Email & password validation
- Bcrypt password comparison
- Returns access & refresh tokens
- Stores refresh token in DB

### 3. **JWT Tokens**
- **Access Token** (15 minutes) - For API requests
- **Refresh Token** (30 days) - To get new access token
- Token stored in database for revocation

### 4. **Google OAuth**
- Seamless Google login
- Automatic account creation
- Links to existing email users
- Returns tokens directly

### 5. **Token Refresh**
- Invalidate old token
- Generate new access token
- Keep session alive without re-login

### 6. **Logout**
- Single device logout (revoke token)
- Logout all devices (revoke all tokens)

---

## 📊 Data Flow Diagrams

### Registration Flow
```
User submits (name, email, password)
        ↓
Validate input format
        ↓
Check email doesn't exist
        ↓
Hash password with bcrypt
        ↓
Create user in MongoDB
        ↓
Generate access & refresh tokens
        ↓
Save refresh token to user.refreshTokens[]
        ↓
Return tokens to frontend
```

### Login Flow
```
User submits (email, password)
        ↓
Validate input format
        ↓
Find user by email in MongoDB
        ↓
Compare password with bcrypt
        ↓
Generate tokens
        ↓
Save refresh token to DB
        ↓
Return tokens
```

### Google OAuth Flow
```
User clicks "Login with Google"
        ↓
Redirect to Google OAuth screen
        ↓
User grants permission
        ↓
Google returns profile (id, email, name, picture)
        ↓
Check if user exists (by googleId or email)
        ↓
If new: Create user with authProvider="google"
If exists: Link googleId to existing account
        ↓
Generate access & refresh tokens
        ↓
Redirect to frontend with tokens in URL
```

### Protected Route Flow
```
Frontend sends request with "Authorization: Bearer <accessToken>"
        ↓
JWT middleware extracts token
        ↓
Verify token signature & expiry
        ↓
Extract userId from token
        ↓
Fetch user from MongoDB
        ↓
Attach user to req.user
        ↓
Allow request to proceed
```

### Token Refresh Flow
```
Frontend detects access token expired (401)
        ↓
Send refresh token to /api/auth/refresh-token
        ↓
Verify refresh token
        ↓
Check token exists in user.refreshTokens[]
        ↓
Generate new access token
        ↓
Return new token to frontend
```

---

## 📝 User Model Schema

```javascript
{
  _id: ObjectId,
  name: String (required),
  email: String (required, unique),
  password: String (bcrypt hashed),
  googleId: String (unique, sparse),
  profilePicture: String,
  authProvider: "local" | "google",
  isVerified: Boolean,
  refreshTokens: [
    {
      token: String,
      createdAt: Date (expires in 30 days)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🛡️ Security Features

1. **Bcrypt Password Hashing** - 10 salt rounds
2. **JWT Verification** - Token signature & expiry check
3. **Refresh Token Rotation** - Tokens stored in DB for revocation
4. **Email Validation** - Regex pattern validation
5. **Unique Constraint** - Email & googleId unique in DB
6. **Error Responses** - No sensitive info leaked
7. **CORS Protection** - Configured for frontend URL
8. **Mongoose Validation** - Schema level validation

---

## 🔧 Troubleshooting

### "User already exist"
- Email is already registered
- Use login or provide different email

### "Invalid email or password"
- Incorrect email or password
- Check email existence first

### "Token has expired"
- Access token expired (15 min)
- Use refresh token endpoint to get new token

### "Unauthorized access"
- No token provided
- Token is invalid/expired
- User doesn't exist

### Google OAuth not working
- Check Client ID and Secret in .env
- Verify redirect URL matches Google Console
- Ensure CORS includes Google domain

---

## ✅ Next Steps

1. Connect Frontend to these APIs
2. Store tokens securely (httpOnly cookies recommended)
3. Implement token refresh logic on frontend
4. Add email verification endpoint
5. Add password reset functionality
6. Setup rate limiting on auth endpoints
7. Add refresh token rotation strategy
8. Implement 2FA (Two-Factor Authentication)
