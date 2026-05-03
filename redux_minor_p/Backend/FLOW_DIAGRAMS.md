# Authentication System - Complete Flow Diagrams

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│  (Stores tokens in localStorage/cookies)                        │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓
        ┌────────────────────────────────────┐
        │   Authorization Header            │
        │  Bearer <accessToken>              │
        └────────────────────┬───────────────┘
                             ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND (Node.js)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes Layer (/api/auth/...)                            │  │
│  │  - /register, /login, /refresh-token                     │  │
│  │  - /logout, /logout-all, /me, /google                    │  │
│  └──────────────┬───────────────────────────────────────────┘  │
│                 ↓                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Middleware Layer                                        │  │
│  │  - JWT Verification (jwt.middleware.js)                  │  │
│  │  - Error Handling (errorMiddleware.js)                   │  │
│  │  - CORS, Morgan Logger                                   │  │
│  └──────────────┬───────────────────────────────────────────┘  │
│                 ↓                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Controller Layer (auth.controller.js)                   │  │
│  │  - register(), login(), refreshAccessToken()             │  │
│  │  - logout(), logoutAll(), getCurrentUser()               │  │
│  │  - googleCallback()                                      │  │
│  └──────────────┬───────────────────────────────────────────┘  │
│                 ↓                                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Model Layer                                             │  │
│  │  - User.findOne(), User.create(), User.save()            │  │
│  │  - Password hashing with bcrypt                          │  │
│  └──────────────┬───────────────────────────────────────────┘  │
│                 ↓                                               │
└────────────────┼──────────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────────────────────────────┐
│              MONGODB DATABASE                                    │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  users collection                                        │  │
│  │  {                                                       │  │
│  │    _id: ObjectId,                                        │  │
│  │    name: String,                                         │  │
│  │    email: String (unique),                               │  │
│  │    password: String (bcrypt hashed),                     │  │
│  │    googleId: String (unique),                            │  │
│  │    authProvider: "local" | "google",                     │  │
│  │    refreshTokens: [{token, createdAt}],                 │  │
│  │    ...                                                   │  │
│  │  }                                                       │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Registration Flow

```
START: User fills registration form
│
├─ name: "John Doe"
├─ email: "john@example.com"
├─ password: "password123"
└─ confirmPassword: "password123"
│
↓
┌────────────────────────────────────┐
│  VALIDATION                        │
│  - Name length check               │
│  - Email format validation         │
│  - Password length check           │
│  - Confirm password match          │
└────────────┬───────────────────────┘
             ↓
        ❌ FAIL? → Send error response (400)
        ✅ PASS
             ↓
┌────────────────────────────────────┐
│  CHECK EXISTING USER               │
│  User.findOne({email})             │
└────────────┬───────────────────────┘
             ↓
        ✅ FOUND? → "User already exist" (409)
        ❌ NOT FOUND
             ↓
┌────────────────────────────────────┐
│  HASH PASSWORD                     │
│  bcrypt.hash(password, 10)         │
│  (10 salt rounds)                  │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  CREATE USER IN DATABASE           │
│  User.create({                     │
│    name,                           │
│    email (lowercase),              │
│    password (hashed),              │
│    authProvider: "local",          │
│    isVerified: false               │
│  })                                │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  GENERATE TOKENS                   │
│  - Access Token (15 min)           │
│  - Refresh Token (30 days)         │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SAVE REFRESH TOKEN TO DB          │
│  user.refreshTokens.push({         │
│    token: refreshToken,            │
│    createdAt: now                  │
│  })                                │
│  user.save()                       │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SEND SUCCESS RESPONSE (201)       │
│  {                                 │
│    user: {...},                    │
│    accessToken: "...",             │
│    refreshToken: "..."             │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
        END: Frontend stores tokens & redirects to dashboard
```

---

## 🔐 User Login Flow

```
START: User submits email & password
│
├─ email: "john@example.com"
└─ password: "password123"
│
↓
┌────────────────────────────────────┐
│  VALIDATION                        │
│  - Email format check              │
│  - Password provided               │
└────────────┬───────────────────────┘
             ↓
        ❌ FAIL? → Send error (400)
        ✅ PASS
             ↓
┌────────────────────────────────────┐
│  FIND USER BY EMAIL                │
│  User.findOne({email})             │
└────────────┬───────────────────────┘
             ↓
        ❌ NOT FOUND? → "Invalid credentials" (401)
        ✅ FOUND
             ↓
┌────────────────────────────────────┐
│  CHECK PASSWORD FIELD              │
│  if (!user.password) {             │
│    "Account is Google only"        │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
        ❌ GOOGLE ONLY? → Error (400)
        ✅ HAS PASSWORD
             ↓
┌────────────────────────────────────┐
│  COMPARE PASSWORDS                 │
│  bcrypt.compare(                   │
│    passwordAttempt,                │
│    user.password                   │
│  )                                 │
└────────────┬───────────────────────┘
             ↓
        ❌ MISMATCH? → "Invalid credentials" (401)
        ✅ MATCH
             ↓
┌────────────────────────────────────┐
│  GENERATE TOKENS                   │
│  - Access Token (15 min)           │
│  - Refresh Token (30 days)         │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SAVE REFRESH TOKEN                │
│  user.refreshTokens.push({...})    │
│  user.save()                       │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SEND SUCCESS (200)                │
│  {                                 │
│    user: {...},                    │
│    accessToken: "...",             │
│    refreshToken: "..."             │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
        END: User logged in
```

---

## 🔗 Google OAuth Flow

```
START: User clicks "Login with Google" button
│
↓
┌────────────────────────────────────┐
│  REDIRECT TO GOOGLE                │
│  GET /api/auth/google              │
│  (Passport initializes)            │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  GOOGLE LOGIN SCREEN               │
│  User enters Google credentials    │
│  User grants app permissions       │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  GOOGLE RETURNS PROFILE            │
│  {                                 │
│    id: "google_id",                │
│    displayName: "John Doe",        │
│    emails: [{value: "email"}],     │
│    photos: [{value: "pic_url"}]    │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  VERIFY WITH BACKEND               │
│  GET /api/auth/google/callback     │
│  (Passport catches response)       │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  CHECK USER EXISTS                 │
│  Find by googleId OR email         │
└────────────┬───────────────────────┘
             ↓
         ┌──┴──┐
         ↓     ↓
    ❌ FOUND  ✅ NOT FOUND
         ↓         ↓
    LINK GOOGLE  CREATE USER
    ACCOUNT      WITH GOOGLE
    (merge)      
         ↓     ↓
         └──┬──┘
            ↓
┌────────────────────────────────────┐
│  GENERATE TOKENS                   │
│  - Access Token                    │
│  - Refresh Token                   │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SAVE REFRESH TOKEN                │
│  user.refreshTokens.push({...})    │
│  user.save()                       │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  REDIRECT TO FRONTEND              │
│  FRONTEND_URL/auth/callback?       │
│  accessToken=...&                  │
│  refreshToken=...&                 │
│  userId=...                        │
└────────────┬───────────────────────┘
             ↓
        END: Frontend receives tokens & logs in user
```

---

## 🔄 Token Refresh Flow

```
START: Frontend detects access token expired (401)
│
↓
┌────────────────────────────────────┐
│  SEND REFRESH REQUEST              │
│  POST /api/auth/refresh-token      │
│  {                                 │
│    refreshToken: "stored_token"    │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  VERIFY REFRESH TOKEN              │
│  jwt.verify(token, SECRET)         │
└────────────┬───────────────────────┘
             ↓
        ❌ INVALID? → "Invalid token" (401)
        ✅ VALID
             ↓
┌────────────────────────────────────┐
│  FIND USER                         │
│  User.findById(decoded.userId)     │
└────────────┬───────────────────────┘
             ↓
        ❌ NOT FOUND? → Error (404)
        ✅ FOUND
             ↓
┌────────────────────────────────────┐
│  CHECK TOKEN IN DATABASE           │
│  user.refreshTokens.some(rt =>     │
│    rt.token === refreshToken       │
│  )                                 │
└────────────┬───────────────────────┘
             ↓
        ❌ NOT FOUND? → "Token revoked" (401)
        ✅ FOUND
             ↓
┌────────────────────────────────────┐
│  GENERATE NEW ACCESS TOKEN         │
│  jwt.sign({userId}, SECRET, {      │
│    expiresIn: "15m"                │
│  })                                │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SEND NEW TOKEN (200)              │
│  {                                 │
│    accessToken: "new_token"        │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
        END: Frontend updates token & retries original request
```

---

## 🔒 Protected Route Access Flow

```
START: Frontend makes API request
│
├─ GET /api/notes/all
├─ Headers: {
│    Authorization: "Bearer eyJhbGc..."
│  }
│
↓
┌────────────────────────────────────┐
│  EXTRACT TOKEN FROM HEADER         │
│  authHeader = "Bearer token..."    │
│  token = authHeader.split(" ")[1]  │
└────────────┬───────────────────────┘
             ↓
        ❌ NO TOKEN? → "No token provided" (401)
        ✅ HAS TOKEN
             ↓
┌────────────────────────────────────┐
│  VERIFY JWT SIGNATURE              │
│  jwt.verify(token, ACCESS_SECRET)  │
└────────────┬───────────────────────┘
             ↓
        ❌ INVALID? → "Invalid token" (401)
        ✅ VALID
             ↓
┌────────────────────────────────────┐
│  CHECK TOKEN EXPIRY                │
│  if (token.exp < now) {            │
│    throw "Token expired"           │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
        ❌ EXPIRED? → "Token has expired" (401)
        ✅ VALID & NOT EXPIRED
             ↓
┌────────────────────────────────────┐
│  EXTRACT USER ID                   │
│  decoded = jwt.decode(token)       │
│  userId = decoded.userId           │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  FETCH USER FROM DATABASE          │
│  User.findById(userId)             │
└────────────┬───────────────────────┘
             ↓
        ❌ NOT FOUND? → Error (404)
        ✅ FOUND
             ↓
┌────────────────────────────────────┐
│  ATTACH USER TO REQUEST            │
│  req.user = user                   │
│  req.userId = userId               │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  ALLOW REQUEST TO PROCEED          │
│  next() → Route Handler            │
└────────────┬───────────────────────┘
             ↓
        SUCCESS: Protected route executed with user context
```

---

## 🚪 Logout Flow

```
START: User clicks logout button
│
↓
┌────────────────────────────────────┐
│  SEND LOGOUT REQUEST               │
│  POST /api/auth/logout             │
│  Headers: {                        │
│    Authorization: "Bearer..."      │
│  }                                 │
│  Body: {                           │
│    refreshToken: "..."             │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  VERIFY ACCESS TOKEN               │
│  (middleware verifies user)        │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  REMOVE REFRESH TOKEN FROM DB      │
│  User.findByIdAndUpdate(           │
│    userId,                         │
│    { $pull: {                      │
│        refreshTokens: {            │
│          token: refreshToken       │
│        }                           │
│      }                             │
│    }                               │
│  )                                 │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  SEND SUCCESS (200)                │
│  {                                 │
│    success: true,                  │
│    message: "Logout successful"    │
│  }                                 │
└────────────┬───────────────────────┘
             ↓
┌────────────────────────────────────┐
│  FRONTEND ACTION                   │
│  - Remove tokens from storage      │
│  - Redirect to login page          │
│  - Clear user context              │
└────────────┬───────────────────────┘
             ↓
        END: User logged out (single device)
```

---

## 🔑 Token Structure

### Access Token (15 minutes)
```javascript
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id_from_db",
  "iat": 1704000000,
  "exp": 1704000900  // 15 minutes later
}

Signature: HMAC-SHA256(header.payload, JWT_ACCESS_SECRET)
```

### Refresh Token (30 days)
```javascript
Header: {
  "alg": "HS256",
  "typ": "JWT"
}

Payload: {
  "userId": "user_id_from_db",
  "iat": 1704000000,
  "exp": 1706592000  // 30 days later
}

Signature: HMAC-SHA256(header.payload, JWT_REFRESH_SECRET)
```

---

## 📊 Error Handling Flow

```
┌─────────────────────────────────────┐
│  Request Handler throws Error       │
│  throw new AppError(msg, status)    │
└────────────┬───────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Async Wrapper catches Error        │
│  catchAsync(fn)                     │
└────────────┬───────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Error Middleware processes it      │
│  errorMiddleware(err, req, res)     │
└────────────┬───────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Error Response Handler             │
│  - Mongoose Validation Error        │
│  - Duplicate Key Error (11000)      │
│  - JWT Errors                       │
│  - Custom AppError                  │
└────────────┬───────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Send JSON Response with status     │
│  {                                  │
│    success: false,                  │
│    message: "Error description",    │
│    errors?: {...}                   │
│  }                                  │
└────────────┬───────────────────────┘
             ↓
        END: Client receives error response
```

---

## 🔐 Security Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   SECURITY MEASURES                          │
├──────────────────────────────────────────────────────────────┤
│ 1. PASSWORD HASHING                                          │
│    ├─ Bcrypt with 10 salt rounds                            │
│    ├─ Never store plain text password                       │
│    └─ Compare using bcrypt.compare()                        │
│                                                              │
│ 2. JWT TOKEN VERIFICATION                                   │
│    ├─ Signature verification with SECRET                    │
│    ├─ Expiry time check                                     │
│    └─ Token revocation via DB lookup                        │
│                                                              │
│ 3. UNIQUE CONSTRAINTS                                        │
│    ├─ Email: Prevents duplicate accounts                    │
│    ├─ GoogleId: Links accounts                              │
│    └─ MongoDB unique indexes                                │
│                                                              │
│ 4. INPUT VALIDATION                                          │
│    ├─ Email format regex                                    │
│    ├─ Password length validation                            │
│    ├─ Name length validation                                │
│    └─ Server-side validation                                │
│                                                              │
│ 5. ERROR HANDLING                                            │
│    ├─ No sensitive info in error messages                   │
│    ├─ Generic "Invalid credentials"                         │
│    ├─ Prevent user enumeration                              │
│    └─ Log errors for debugging                              │
│                                                              │
│ 6. CORS PROTECTION                                           │
│    ├─ Only frontend URL allowed                             │
│    ├─ Credentials in cookies/headers                        │
│    └─ Prevent unauthorized domains                          │
│                                                              │
│ 7. TOKEN STORAGE                                             │
│    ├─ Refresh tokens stored in DB                           │
│    ├─ Can be revoked anytime                                │
│    └─ Auto-expire after 30 days                             │
│                                                              │
│ 8. PRODUCTION SECURITY                                       │
│    ├─ Use HTTPS only                                        │
│    ├─ Set httpOnly flag on cookies                          │
│    ├─ Use strong random secrets                             │
│    ├─ Rate limit auth endpoints                             │
│    └─ Monitor suspicious activities                         │
└──────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

- [x] User Model with bcrypt hashing
- [x] JWT token generation & verification
- [x] Input validators
- [x] Auth controller (register, login, refresh, logout)
- [x] JWT middleware for protected routes
- [x] Google OAuth strategy configuration
- [x] Auth routes (with Passport middleware)
- [x] Global error middleware
- [x] Environment configuration
- [x] API documentation
- [ ] Frontend integration
- [ ] Email verification
- [ ] Password reset
- [ ] 2FA implementation
- [ ] Rate limiting
- [ ] Refresh token rotation
