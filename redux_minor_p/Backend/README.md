# 🔐 Redux Minor Project - Authentication Backend

A professional, industry-level authentication system built with Node.js, Express, MongoDB, and JWT. Features user registration, login, Google OAuth, and token management.

---

## 🎯 Features Overview

### ✅ User Authentication
- **Registration** - Email & password-based account creation
- **Login** - Secure login with bcrypt password verification
- **User Validation** - Check if user already exists (returns "user already exist" message)
- **Password Hashing** - Bcrypt with 10 salt rounds

### ✅ Token Management
- **Access Token** - Short-lived JWT (15 minutes) for API requests
- **Refresh Token** - Long-lived JWT (30 days) for token renewal
- **Token Revocation** - Logout and logout-all endpoints
- **Secure Storage** - Refresh tokens stored in MongoDB

### ✅ Google OAuth
- **Google Login** - Seamless Google account authentication
- **Auto-Signup** - Automatically creates user on first Google login
- **Account Linking** - Links Google account to existing email users
- **Profile Data** - Stores name, email, and profile picture

### ✅ Protected Routes
- **JWT Middleware** - Verify tokens on protected endpoints
- **User Context** - Attach user to request for authorization
- **Token Expiry Handling** - Proper error messages for expired tokens

### ✅ Error Handling
- **Validation Errors** - Detailed input validation feedback
- **JWT Errors** - Proper handling of token issues
- **Database Errors** - MongoDB duplicate key & validation errors
- **Global Middleware** - Centralized error response formatting

---

## 📁 Project Structure

```
Backend/
│
├── src/
│   ├── auth/                          ← Authentication Module
│   │   ├── controllers/
│   │   │   └── auth.controller.js    ← Register, login, OAuth handlers
│   │   ├── models/
│   │   │   └── user.model.js         ← User schema with bcrypt
│   │   ├── routes/
│   │   │   └── auth.routes.js        ← Auth endpoints & Google OAuth
│   │   ├── middleware/
│   │   │   └── jwt.middleware.js     ← JWT verification middleware
│   │   └── strategies/
│   │       └── google.strategy.js     ← Passport Google OAuth config
│   │
│   ├── config/                        ← Configuration
│   │   ├── config.js                 ← Environment variables
│   │   └── db.js                     ← MongoDB connection
│   │
│   ├── utils/                         ← Utility Functions
│   │   ├── jwt.utils.js              ← Token generation & verification
│   │   ├── validators.js             ← Input validation rules
│   │   └── errorHandler.js           ← Error handling utilities
│   │
│   ├── middleware/                    ← Global Middleware
│   │   └── errorMiddleware.js        ← Global error handler
│   │
│   ├── app.js                         ← Express app setup
│   └── routes/
│       └── routes.js                 ← Other API routes
│
├── server.js                          ← Server entry point
├── package.json                       ← Dependencies
├── .env                               ← Environment variables (git ignored)
├── .env.example                       ← Env template (git safe)
├── .gitignore                         ← Git ignore rules
│
├── 📖 QUICK_START.md                  ← 5-minute setup guide
├── 📖 AUTH_SETUP.md                   ← Complete setup & features
├── 📖 API_DOCUMENTATION.md            ← All endpoints documented
├── 📖 FLOW_DIAGRAMS.md                ← Visual flows & architecture
└── 📖 README.md                       ← This file
```

---

## 🚀 Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Setup Environment
Edit `.env` file with:
```env
PORT=3001
MONGO_URI=your_mongodb_connection_string
JWT_ACCESS_SECRET=your_random_secret_here
JWT_REFRESH_SECRET=your_random_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
```

### 3. Start Server
```bash
npm run dev
```

Server runs at: **http://localhost:3001**

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | Get started in 5 minutes |
| **AUTH_SETUP.md** | Complete setup & system overview |
| **API_DOCUMENTATION.md** | All endpoints with examples |
| **FLOW_DIAGRAMS.md** | Visual flows & architecture |

---

## 🔌 API Endpoints

### Public Endpoints
```
POST   /api/auth/register              Register new user
POST   /api/auth/login                 Login user
POST   /api/auth/refresh-token         Refresh access token
POST   /api/auth/google-callback       Google OAuth callback
GET    /api/auth/google                Google OAuth redirect
GET    /api/auth/google/callback       Google OAuth callback handler
```

### Protected Endpoints (require access token)
```
GET    /api/auth/me                    Get current user profile
POST   /api/auth/logout                Logout from device
POST   /api/auth/logout-all            Logout from all devices
```

---

## 💾 Database Schema

### User Model
```javascript
{
  _id: ObjectId,                    // MongoDB ID
  name: String,                     // User's name
  email: String (unique),           // Email address
  password: String (hashed),        // Bcrypt hashed password
  googleId: String (unique),        // Google OAuth ID
  profilePicture: String,           // Profile picture URL
  authProvider: "local" | "google", // Auth method used
  isVerified: Boolean,              // Email verified status
  refreshTokens: [                  // Active refresh tokens
    {
      token: String,
      createdAt: Date (expires in 30 days)
    }
  ],
  createdAt: Date,                  // Account creation time
  updatedAt: Date                   // Last update time
}
```

---

## 🔐 Security Features

- **Bcrypt Hashing** - 10 salt rounds for password security
- **JWT Verification** - Signature & expiry validation
- **Token Revocation** - Refresh tokens stored in database
- **Unique Constraints** - Email & GoogleId unique in DB
- **Input Validation** - Regex-based email & password validation
- **Error Handling** - No sensitive info leaked in responses
- **CORS Protection** - Configured for frontend URL only
- **MongoDB Validation** - Schema-level validation

---

## 🔄 Authentication Flows

### Registration Flow
```
User submits form
    ↓
Validate input
    ↓
Check if email exists
    ↓
Hash password with bcrypt
    ↓
Create user in MongoDB
    ↓
Generate access & refresh tokens
    ↓
Return tokens to frontend
```

### Login Flow
```
User submits email & password
    ↓
Validate input
    ↓
Find user by email
    ↓
Compare password with bcrypt
    ↓
Generate tokens
    ↓
Return tokens to frontend
```

### Google OAuth Flow
```
User clicks "Login with Google"
    ↓
Redirect to Google login
    ↓
User grants permission
    ↓
Google returns profile data
    ↓
Create or link user account
    ↓
Generate tokens
    ↓
Redirect to frontend with tokens
```

### Protected Route Flow
```
Frontend sends request with access token
    ↓
Middleware extracts & verifies token
    ↓
Check token signature & expiry
    ↓
Fetch user from database
    ↓
Attach user to request
    ↓
Allow route handler to proceed
```

---

## 🧪 Testing Endpoints

### Test Registration
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

### Test "User Already Exists" Message
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'

# Response: "User already exist with this email address"
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Test Protected Route
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <your_access_token>"
```

---

## ⚙️ Configuration

### Environment Variables
```env
# Server
PORT=3001
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/redux_minor_p

# JWT Tokens
JWT_ACCESS_SECRET=your_strong_secret_here
JWT_REFRESH_SECRET=your_strong_secret_here
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=30d

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3001/api/auth/google/callback

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Generate Strong Secrets
```bash
# Linux/Mac
openssl rand -base64 32

# Windows PowerShell
[Convert]::ToBase64String((Get-Random -InputObject (0..255) -Count 32))
```

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Password** | bcrypt |
| **Authentication** | JWT (JSON Web Tokens) |
| **OAuth** | Passport.js + Google Strategy |
| **Logging** | Morgan |
| **API** | REST |

---

## 📦 Dependencies

```json
{
  "bcrypt": "^5.1.1",              // Password hashing
  "cors": "^2.8.6",                // Cross-origin requests
  "dotenv": "^17.3.1",             // Environment variables
  "express": "^5.2.1",             // Web framework
  "jsonwebtoken": "^9.1.2",        // JWT tokens
  "mongoose": "^9.3.3",            // MongoDB ODM
  "morgan": "^1.10.1",             // HTTP logger
  "passport": "^0.7.0",            // Authentication middleware
  "passport-google-oauth20": "^2.0.0"  // Google OAuth strategy
}
```

---

## 🔄 Token Lifecycle

### Access Token
- **Duration:** 15 minutes
- **Usage:** API requests (Authorization header)
- **Storage:** Frontend localStorage/cookies
- **Expiry:** Manual - need to refresh when expired

### Refresh Token
- **Duration:** 30 days
- **Usage:** Get new access token
- **Storage:** Database + Frontend storage
- **Expiry:** Auto-deleted from DB after 30 days

### Token Refresh Process
```
Access token expired
    ↓
Frontend sends refresh token
    ↓
Backend verifies refresh token
    ↓
Generates new access token
    ↓
Returns new token to frontend
    ↓
Frontend retries original request with new token
```

---

## 🔒 Password Security

- **Hashing Algorithm:** Bcrypt
- **Salt Rounds:** 10
- **Verification:** bcrypt.compare() for login
- **Storage:** Never plain text
- **Reset:** Via email (future feature)

---

## 🐛 Error Messages

| Status | Message | Cause |
|--------|---------|-------|
| 201 | User registered successfully | Registration success |
| 200 | Login successful | Login success |
| 400 | Validation Error | Invalid input |
| 400 | User already exist | Email already registered |
| 400 | Passwords do not match | Confirm password mismatch |
| 401 | Invalid email or password | Login credentials wrong |
| 401 | Token has expired | Access token expired |
| 401 | Invalid token | Token is malformed/invalid |
| 404 | User not found | User doesn't exist |
| 409 | User already exist | Duplicate email |
| 500 | Internal Server Error | Server error |

---

## ✅ Implementation Checklist

- [x] User model with bcrypt
- [x] JWT utilities (generate, verify)
- [x] Input validators
- [x] Auth controller (register, login, refresh)
- [x] Auth routes with middleware
- [x] JWT middleware for protected routes
- [x] Google OAuth strategy
- [x] Global error handler
- [x] Environment configuration
- [x] Database connection
- [x] Comprehensive documentation
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA implementation
- [ ] Rate limiting
- [ ] Refresh token rotation
- [ ] Admin panel

---

## 🚀 Deployment

### Prerequisites
- Node.js 14+
- MongoDB Atlas account
- Google OAuth credentials
- Heroku/Vercel/AWS account (optional)

### Environment Setup for Production
```env
NODE_ENV=production
PORT=3001
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/db
JWT_ACCESS_SECRET=<very-long-random-string>
JWT_REFRESH_SECRET=<very-long-random-string>
GOOGLE_CLIENT_ID=<production-client-id>
GOOGLE_CLIENT_SECRET=<production-client-secret>
GOOGLE_CALLBACK_URL=https://yourdomain.com/api/auth/google/callback
FRONTEND_URL=https://yourdomain.com
```

### Production Checklist
- [ ] Use HTTPS only
- [ ] Strong random JWT secrets
- [ ] Update CORS allowed origins
- [ ] Enable rate limiting
- [ ] Setup monitoring/logging
- [ ] Use httpOnly cookies
- [ ] Regular security updates
- [ ] Backup strategy for database

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** "User already exist"
- **Solution:** Email is registered. Use login or different email.

**Issue:** "Invalid email or password"
- **Solution:** Check email and password combination.

**Issue:** "Token has expired"
- **Solution:** Use refresh-token endpoint to get new token.

**Issue:** "Unauthorized access"
- **Solution:** No valid token provided. Login again.

**Issue:** Google OAuth not working
- **Solution:** Check credentials in .env and redirect URL in Google Console.

---

## 📖 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB/Mongoose Guide](https://mongoosejs.com/)
- [JWT Introduction](https://jwt.io/)
- [Bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Passport.js OAuth](http://www.passportjs.org/)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

## 📝 License

MIT License - Feel free to use this in your projects!

---

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Forgot password functionality
- [ ] Two-Factor Authentication (2FA)
- [ ] Social OAuth (Facebook, GitHub, LinkedIn)
- [ ] User profile management
- [ ] Admin dashboard
- [ ] Activity logging
- [ ] Rate limiting
- [ ] Refresh token rotation
- [ ] API key authentication
- [ ] Role-based access control (RBAC)
- [ ] Multi-language support

---

## 👨‍💻 Developer Notes

- Keep `.env` file in `.gitignore` (never commit!)
- Always use strong random secrets in production
- Regularly update dependencies: `npm update`
- Test thoroughly before deploying
- Monitor server logs in production
- Use HTTPS in production
- Implement rate limiting on auth endpoints
- Consider using httpOnly cookies for tokens

---

## 🎉 That's It!

Your authentication system is ready! 

### Next Steps:
1. Install dependencies: `npm install`
2. Configure `.env` file
3. Start server: `npm run dev`
4. Test endpoints with Postman/curl
5. Connect frontend to these APIs
6. Deploy to production

**Happy coding! 🚀**

---

**Need help?** Check the documentation files:
- QUICK_START.md
- AUTH_SETUP.md
- API_DOCUMENTATION.md
- FLOW_DIAGRAMS.md
