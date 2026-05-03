# Architecture & Implementation Overview

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                               │
│  - Login/Register Forms                                              │
│  - Store tokens (localStorage/cookies)                              │
│  - Send requests with Authorization header                          │
└───────────────────────────────────────────┬──────────────────────────┘
                                            │
                                            ↓
                    ┌─────────────────────────────────────────┐
                    │  HTTP Requests with JWT Tokens          │
                    │  GET /api/auth/me                       │
                    │  POST /api/auth/register                │
                    │  POST /api/auth/login                   │
                    │  POST /api/auth/refresh-token           │
                    │  GET /api/auth/google                   │
                    └─────────────┬───────────────────────────┘
                                  │
                                  ↓
┌──────────────────────────────────────────────────────────────────────┐
│                    EXPRESS BACKEND (Node.js)                          │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ ROUTES LAYER                                                   │  │
│  │ /api/auth/register        → register controller               │  │
│  │ /api/auth/login           → login controller                  │  │
│  │ /api/auth/refresh-token   → refreshAccessToken controller    │  │
│  │ /api/auth/logout          → logout controller                │  │
│  │ /api/auth/logout-all      → logoutAll controller             │  │
│  │ /api/auth/me              → getCurrentUser controller        │  │
│  │ /api/auth/google          → Passport Google strategy         │  │
│  │ /api/auth/google/callback → Google OAuth callback            │  │
│  └────────────────┬──────────────────────────────────────────────┘  │
│                   │                                                  │
│                   ↓                                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ MIDDLEWARE LAYER                                               │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ JWT Middleware (authenticateToken)                      │   │  │
│  │ │ - Extract token from Authorization header              │   │  │
│  │ │ - Verify token signature                               │   │  │
│  │ │ - Check token expiry                                   │   │  │
│  │ │ - Fetch user from database                             │   │  │
│  │ │ - Attach user to request.user                          │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                 │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ Error Middleware                                        │   │  │
│  │ │ - Catch all errors from routes                         │   │  │
│  │ │ - Format error responses                               │   │  │
│  │ │ - Handle JWT, MongoDB, validation errors               │   │  │
│  │ │ - Never leak sensitive information                     │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  │                                                                 │  │
│  │ ┌─────────────────────────────────────────────────────────┐   │  │
│  │ │ Passport Middleware (Google OAuth)                      │   │  │
│  │ │ - Handle Google login/callback                         │   │  │
│  │ │ - Verify Google credentials                            │   │  │
│  │ │ - Serialize/Deserialize user                           │   │  │
│  │ └─────────────────────────────────────────────────────────┘   │  │
│  └────────────────┬──────────────────────────────────────────────┘  │
│                   │                                                  │
│                   ↓                                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ CONTROLLER LAYER                                               │  │
│  │ ┌──────────────────────────────────────────────────────────┐   │  │
│  │ │ authController                                           │   │  │
│  │ │ - register(name, email, password)                       │   │  │
│  │ │  └─ Validate input                                      │   │  │
│  │ │  └─ Check if user exists                                │   │  │
│  │ │  └─ Hash password with bcrypt                           │   │  │
│  │ │  └─ Create user in DB                                   │   │  │
│  │ │  └─ Generate tokens                                     │   │  │
│  │ │  └─ Return user & tokens                                │   │  │
│  │ │                                                          │   │  │
│  │ │ - login(email, password)                                │   │  │
│  │ │  └─ Validate input                                      │   │  │
│  │ │  └─ Find user by email                                  │   │  │
│  │ │  └─ Compare password with bcrypt                        │   │  │
│  │ │  └─ Generate tokens                                     │   │  │
│  │ │  └─ Return tokens                                       │   │  │
│  │ │                                                          │   │  │
│  │ │ - refreshAccessToken(refreshToken)                      │   │  │
│  │ │  └─ Verify refresh token                                │   │  │
│  │ │  └─ Check token in DB                                   │   │  │
│  │ │  └─ Generate new access token                           │   │  │
│  │ │  └─ Return new token                                    │   │  │
│  │ │                                                          │   │  │
│  │ │ - logout(refreshToken)                                  │   │  │
│  │ │  └─ Remove token from DB                                │   │  │
│  │ │                                                          │   │  │
│  │ │ - logoutAll()                                           │   │  │
│  │ │  └─ Clear all tokens for user                           │   │  │
│  │ │                                                          │   │  │
│  │ │ - getCurrentUser()                                      │   │  │
│  │ │  └─ Return authenticated user from request              │   │  │
│  │ │                                                          │   │  │
│  │ │ - googleCallback(googleId, email, name)                 │   │  │
│  │ │  └─ Find or create user                                 │   │  │
│  │ │  └─ Generate tokens                                     │   │  │
│  │ │  └─ Return user & tokens                                │   │  │
│  │ └──────────────────────────────────────────────────────────┘   │  │
│  └────────────────┬──────────────────────────────────────────────┘  │
│                   │                                                  │
│                   ↓                                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ UTILITY LAYER                                                  │  │
│  │ ┌──────────────────┐  ┌──────────────────┐  ┌────────────────┐ │  │
│  │ │ jwt.utils.js     │  │ validators.js    │  │errorHandler.js │ │  │
│  │ │                  │  │                  │  │                │ │  │
│  │ │Generate tokens   │  │Validate email    │  │Custom errors   │ │  │
│  │ │Verify tokens     │  │Validate password │  │Error response  │ │  │
│  │ │Decode tokens     │  │Validate name     │  │Try-catch wrap  │ │  │
│  │ └──────────────────┘  └──────────────────┘  └────────────────┘ │  │
│  └────────────────┬──────────────────────────────────────────────┘  │
│                   │                                                  │
│                   ↓                                                  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ MODEL LAYER                                                    │  │
│  │ ┌──────────────────────────────────────────────────────────┐   │  │
│  │ │ User Model                                               │   │  │
│  │ │ ┌────────────────────────────────────────────────────┐   │   │  │
│  │ │ │ Schema:                                            │   │   │  │
│  │ │ │ - name (String)                                    │   │   │  │
│  │ │ │ - email (String, unique, lowercase)                │   │   │  │
│  │ │ │ - password (String, bcrypt hashed)                 │   │   │  │
│  │ │ │ - googleId (String, unique)                        │   │   │  │
│  │ │ │ - profilePicture (String)                          │   │   │  │
│  │ │ │ - authProvider (local | google)                    │   │   │  │
│  │ │ │ - isVerified (Boolean)                             │   │   │  │
│  │ │ │ - refreshTokens [{ token, createdAt }]             │   │   │  │
│  │ │ │ - createdAt, updatedAt                             │   │   │  │
│  │ │ ├────────────────────────────────────────────────────┤   │   │  │
│  │ │ │ Methods:                                           │   │   │  │
│  │ │ │ - comparePassword() - bcrypt comparison            │   │   │  │
│  │ │ │ - toJSON() - remove sensitive fields               │   │   │  │
│  │ │ ├────────────────────────────────────────────────────┤   │   │  │
│  │ │ │ Hooks:                                             │   │   │  │
│  │ │ │ - pre('save') - hash password if modified          │   │   │  │
│  │ │ └────────────────────────────────────────────────────┘   │   │  │
│  │ └──────────────────────────────────────────────────────────┘   │  │
│  └────────────────┬──────────────────────────────────────────────┘  │
│                   │                                                  │
└───────────────────┼──────────────────────────────────────────────────┘
                    │
                    ↓
┌──────────────────────────────────────────────────────────────────────┐
│                      MONGODB DATABASE                                 │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ users collection                                               │  │
│  │                                                                │  │
│  │ Document Example:                                              │  │
│  │ {                                                              │  │
│  │   _id: ObjectId("..."),                                        │  │
│  │   name: "John Doe",                                            │  │
│  │   email: "john@example.com",                                   │  │
│  │   password: "$2b$10$... (bcrypt hashed)",                      │  │
│  │   googleId: "110...123",                                       │  │
│  │   profilePicture: "https://...",                               │  │
│  │   authProvider: "local",                                       │  │
│  │   isVerified: false,                                           │  │
│  │   refreshTokens: [                                             │  │
│  │     {                                                          │  │
│  │       token: "eyJhbGciOiJIUzI1NiIs...",                        │  │
│  │       createdAt: Date(2024-01-15),                             │  │
│  │       expiresAt: Date(2024-02-14)  // Auto-delete              │  │
│  │     }                                                          │  │
│  │   ],                                                           │  │
│  │   createdAt: Date("2024-01-15"),                               │  │
│  │   updatedAt: Date("2024-01-15")                                │  │
│  │ }                                                              │  │
│  │                                                                │  │
│  │ Indexes:                                                       │  │
│  │ - email: unique                                                │  │
│  │ - googleId: unique                                             │  │
│  │ - refreshTokens.createdAt: TTL (30 days)                       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  Connection:                                                          │
│  mongoose.connect(MONGO_URI)                                         │
│  Database: redux_minor_p                                             │
│  Collection: users                                                   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Request/Response Flow Example

### Registration Request Flow

```
FRONTEND                          BACKEND                          DATABASE
┌─────────┐                      ┌───────────┐                    ┌──────────┐
│ React   │                      │ Express   │                    │ MongoDB  │
└────┬────┘                      └────┬──────┘                    └────┬─────┘
     │                                │                               │
     │ POST /api/auth/register        │                               │
     │ Body: {                        │                               │
     │   name, email, password        │                               │
     │ }                              │                               │
     ├───────────────────────────────>│                               │
     │                                │ Extract request body          │
     │                                ├───────────────────────────┐   │
     │                                │ Validate input            │   │
     │                                ├───────────────────────────┘   │
     │                                │ Check if user exists          │
     │                                ├──────────────────────────────>│
     │                                │                           Find│
     │                                │<──────────────────────────────┤
     │                                │ Not found                     │
     │                                │                               │
     │                                │ Hash password (bcrypt)        │
     │                                │ Create user in DB             │
     │                                ├──────────────────────────────>│
     │                                │                          Save │
     │                                │<──────────────────────────────┤
     │                                │ User created                  │
     │                                │                               │
     │                                │ Generate JWT tokens           │
     │                                │ Save refresh token to user    │
     │                                ├──────────────────────────────>│
     │                                │                       Update  │
     │                                │<──────────────────────────────┤
     │                                │                               │
     │                                │ Build response                │
     │ {                              │ {                             │
     │   success: true,               │   success: true,              │
     │   user: {...},                 │   user: {...},                │
     │   accessToken: "...",          │   accessToken: "...",         │
     │   refreshToken: "..."          │   refreshToken: "..."         │
     │ }                              │ }                             │
     │<───────────────────────────────┤                               │
     │                                │                               │
     │ Store tokens                   │                               │
     │ localStorage.setItem()         │                               │
     │                                │                               │
```

---

## 🔒 Password Hashing Process

```
┌──────────────────────────────────────────────────┐
│          Password Hashing Lifecycle              │
├──────────────────────────────────────────────────┤
│                                                  │
│  REGISTRATION:                                   │
│  ┌─────────────────────────────────────────┐    │
│  │ User enters: "password123"              │    │
│  └──────────────┬──────────────────────────┘    │
│                 ↓                               │
│  ┌─────────────────────────────────────────┐    │
│  │ Bcrypt generates random salt (rounds=10)    │
│  │ Salt: $2b$10$...16-character...         │    │
│  └──────────────┬──────────────────────────┘    │
│                 ↓                               │
│  ┌─────────────────────────────────────────┐    │
│  │ Hash = bcrypt(password, salt)           │    │
│  │ Hashed: $2b$10$...full-hash-string...   │    │
│  │ Length: 60 characters                   │    │
│  └──────────────┬──────────────────────────┘    │
│                 ↓                               │
│  ┌─────────────────────────────────────────┐    │
│  │ Save hashed password to DB              │    │
│  │ Plain password NEVER stored             │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
│  ─────────────────────────────────────────────  │
│                                                  │
│  LOGIN:                                          │
│  ┌─────────────────────────────────────────┐    │
│  │ User enters: "password123"              │    │
│  │ Fetch hashed password from DB           │    │
│  └──────────────┬──────────────────────────┘    │
│                 ↓                               │
│  ┌─────────────────────────────────────────┐    │
│  │ Compare: bcrypt.compare(input, hashed)  │    │
│  │ Returns: true/false                     │    │
│  │ Algorithm: Secure comparison            │    │
│  └──────────────┬──────────────────────────┘    │
│                 ↓                               │
│  ┌─────────────────────────────────────────┐    │
│  │ If true: Allow login, generate tokens   │    │
│  │ If false: Deny login, return error      │    │
│  └─────────────────────────────────────────┘    │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 🎫 JWT Token Structure

```
┌─────────────────────────────────────────────────┐
│         JWT Token: eyJhbGciOi...xyz             │
├─────────────────────────────────────────────────┤
│                                                 │
│ Structure: Header.Payload.Signature            │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ HEADER (Base64URL encoded JSON)           │  │
│ ├───────────────────────────────────────────┤  │
│ │ {                                         │  │
│ │   "alg": "HS256",                         │  │
│ │   "typ": "JWT"                            │  │
│ │ }                                         │  │
│ └─────────────┬───────────────────────────┘  │
│               │                               │
│ ┌───────────────────────────────────────────┐  │
│ │ PAYLOAD (Base64URL encoded JSON)          │  │
│ ├───────────────────────────────────────────┤  │
│ │ {                                         │  │
│ │   "userId": "507f1f77bcf86cd799439011",  │  │
│ │   "iat": 1704000000,  (issued at)         │  │
│ │   "exp": 1704000900   (expires)           │  │
│ │ }                                         │  │
│ └─────────────┬───────────────────────────┘  │
│               │                               │
│ ┌───────────────────────────────────────────┐  │
│ │ SIGNATURE (HMAC SHA-256)                  │  │
│ ├───────────────────────────────────────────┤  │
│ │ Signature = HMAC-SHA256(                  │  │
│ │   header.payload,                         │  │
│ │   JWT_SECRET_KEY                          │  │
│ │ )                                         │  │
│ │                                           │  │
│ │ Purpose: Verify token hasn't been        │  │
│ │ tampered with                             │  │
│ └───────────────────────────────────────────┘  │
│                                                 │
│ VERIFICATION PROCESS:                           │
│ 1. Extract signature from token                 │
│ 2. Recalculate signature with secret            │
│ 3. Compare: if match → VALID                    │
│ 4. Check expiry: if exp < now → EXPIRED         │
│ 5. Extract userId from payload                  │
│ 6. Fetch user from database                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔄 Complete Authentication Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: REGISTRATION                                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ POST /api/auth/register                                 │   │
│  │ ├─ Validate input (email, password, name)               │   │
│  │ ├─ Check if email exists in database                    │   │
│  │ ├─ Hash password with bcrypt                            │   │
│  │ ├─ Create user document in MongoDB                      │   │
│  │ ├─ Generate access token (15 min validity)              │   │
│  │ ├─ Generate refresh token (30 day validity)             │   │
│  │ ├─ Save refresh token to user.refreshTokens array       │   │
│  │ └─ Return user data + tokens                            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│                                                                 │
│  STEP 2: FRONTEND STORES TOKENS                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ localStorage.setItem('accessToken', token)              │   │
│  │ localStorage.setItem('refreshToken', token)             │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│                                                                 │
│  STEP 3: API REQUESTS WITH TOKEN                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ All requests include:                                   │   │
│  │ headers: {                                              │   │
│  │   "Authorization": "Bearer <accessToken>"               │   │
│  │ }                                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│                                                                 │
│  STEP 4: BACKEND VERIFIES TOKEN                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ JWT Middleware:                                         │   │
│  │ ├─ Extract token from Authorization header             │   │
│  │ ├─ Verify token signature with JWT_SECRET              │   │
│  │ ├─ Check token expiry                                  │   │
│  │ ├─ Decode payload to get userId                        │   │
│  │ ├─ Fetch user from MongoDB by userId                   │   │
│  │ ├─ Attach user to request object                       │   │
│  │ └─ Allow request to proceed to route handler           │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│                                                                 │
│  STEP 5: TOKEN EXPIRY & REFRESH                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ When access token expires (after 15 min):              │   │
│  │ ├─ API returns 401 Unauthorized                         │   │
│  │ ├─ Frontend catches 401 error                           │   │
│  │ ├─ Frontend sends refresh token to backend              │   │
│  │ │  POST /api/auth/refresh-token                         │   │
│  │ │  { "refreshToken": "..." }                            │   │
│  │ ├─ Backend verifies refresh token                       │   │
│  │ ├─ Backend generates new access token                   │   │
│  │ ├─ Frontend updates localStorage with new token         │   │
│  │ └─ Frontend retries original request                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│                            ↓                                     │
│                                                                 │
│  STEP 6: LOGOUT                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ User clicks logout:                                     │   │
│  │ ├─ Frontend sends to POST /api/auth/logout              │   │
│  │ │  with refreshToken in body                            │   │
│  │ ├─ Backend removes token from user.refreshTokens        │   │
│  │ ├─ Backend sends success response                       │   │
│  │ ├─ Frontend clears localStorage                         │   │
│  │ └─ Frontend redirects to login page                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ALTERNATIVE: GOOGLE OAUTH LOGIN                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ 1. User clicks "Login with Google"                      │   │
│  │ 2. Redirect to Google login screen                      │   │
│  │ 3. User enters Google credentials                       │   │
│  │ 4. Google returns profile data (email, name, picture)   │   │
│  │ 5. Backend receives profile via callback                │   │
│  │ 6. Find or create user in MongoDB                       │   │
│  │ 7. Generate access & refresh tokens                     │   │
│  │ 8. Redirect to frontend with tokens in URL              │   │
│  │ 9. Frontend stores tokens (same as registration)        │   │
│  │ 10. User is logged in                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Database Query Examples

```javascript
// REGISTRATION
db.users.insertOne({
  name: "John Doe",
  email: "john@example.com",
  password: "$2b$10$... (bcrypt hashed)",
  authProvider: "local",
  isVerified: false,
  refreshTokens: [{
    token: "eyJhbGciOiJIUzI1NiIs...",
    createdAt: new Date(),
  }],
  createdAt: new Date(),
  updatedAt: new Date(),
})

// LOGIN - Find user by email
db.users.findOne({ email: "john@example.com" })
// Result: { _id, name, email, password, authProvider, ... }

// REFRESH TOKEN - Add new refresh token
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    $push: {
      refreshTokens: {
        token: "new_token",
        createdAt: new Date(),
      }
    }
  }
)

// LOGOUT - Remove refresh token
db.users.updateOne(
  { _id: ObjectId("...") },
  {
    $pull: {
      refreshTokens: { token: "token_to_remove" }
    }
  }
)

// GOOGLE OAUTH - Find by googleId
db.users.findOne({ googleId: "110123456789" })

// GOOGLE OAUTH - Find by email
db.users.findOne({ email: "john@gmail.com" })

// LOGOUT ALL - Clear all refresh tokens
db.users.updateOne(
  { _id: ObjectId("...") },
  { $set: { refreshTokens: [] } }
)
```

---

## ✅ Security Checklist

```
┌─────────────────────────────────────────────┐
│       SECURITY IMPLEMENTATION               │
├─────────────────────────────────────────────┤
│                                             │
│ ✅ Password Security                        │
│    ├─ Bcrypt hashing (10 salt rounds)      │
│    ├─ Never store plain text               │
│    ├─ Secure comparison on login           │
│    └─ No password in JWT token             │
│                                             │
│ ✅ Token Security                           │
│    ├─ JWT signature verification            │
│    ├─ Token expiry enforcement              │
│    ├─ Refresh tokens in database            │
│    ├─ Token revocation on logout            │
│    └─ Different secrets for access/refresh  │
│                                             │
│ ✅ Database Security                        │
│    ├─ Unique email constraint               │
│    ├─ Unique googleId constraint            │
│    ├─ Mongoose validation                   │
│    ├─ No SQL injection (MongoDB)            │
│    └─ Proper indexing                       │
│                                             │
│ ✅ Input Validation                         │
│    ├─ Email format validation               │
│    ├─ Password length check                 │
│    ├─ Name validation                       │
│    ├─ Server-side validation only           │
│    └─ Reject malformed requests             │
│                                             │
│ ✅ Error Handling                           │
│    ├─ Generic error messages                │
│    ├─ No sensitive info leak                │
│    ├─ Prevent user enumeration              │
│    ├─ Proper HTTP status codes              │
│    └─ Global error middleware               │
│                                             │
│ ✅ CORS Protection                          │
│    ├─ Frontend URL whitelist                │
│    ├─ Credentials with CORS                 │
│    └─ Prevent unauthorized domains          │
│                                             │
│ ⚠️  TO-DO for Production                    │
│    ├─ Use HTTPS only                        │
│    ├─ httpOnly cookie flag                  │
│    ├─ Rate limiting on auth                 │
│    ├─ Email verification                    │
│    ├─ Password reset flow                   │
│    ├─ 2FA implementation                    │
│    ├─ Audit logging                         │
│    └─ Regular security updates              │
│                                             │
└─────────────────────────────────────────────┘
```
