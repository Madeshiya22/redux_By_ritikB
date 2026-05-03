# Authentication API Documentation

## Base URL
```
http://localhost:3001/api/auth
```

---

## 📋 Authentication Endpoints

### 1️⃣ Register User (Create Account)

**POST** `/register`

**Description:** Create a new user account with email & password

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "authProvider": "local",
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
```json
// Email already exists (409)
{
  "success": false,
  "message": "User already exist with this email address"
}

// Validation error (400)
{
  "success": false,
  "message": "Validation Error: {...}"
}

// Passwords don't match (400)
{
  "success": false,
  "message": "Passwords do not match"
}
```

**Validation Rules:**
- Name: Min 2 characters
- Email: Valid email format
- Password: Min 6 characters
- Confirm Password: Must match password

---

### 2️⃣ Login User

**POST** `/login`

**Description:** Authenticate user with email & password

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "authProvider": "local",
      "createdAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
```json
// Invalid credentials (401)
{
  "success": false,
  "message": "Invalid email or password"
}

// User not found (404)
{
  "success": false,
  "message": "User not found"
}

// Google account linked (400)
{
  "success": false,
  "message": "This account is registered with Google. Please use Google login."
}
```

---

### 3️⃣ Refresh Access Token

**POST** `/refresh-token`

**Description:** Get new access token using refresh token

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Access token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**
```json
// Token expired/invalid (401)
{
  "success": false,
  "message": "Refresh token is invalid or has been revoked"
}

// Token not provided (400)
{
  "success": false,
  "message": "Refresh token is required"
}
```

---

### 4️⃣ Google OAuth Callback

**POST** `/google-callback`

**Description:** Handle Google OAuth login (called from frontend)

**Request Body:**
```json
{
  "googleId": "google_unique_id",
  "email": "john@gmail.com",
  "name": "John Doe",
  "profilePicture": "https://..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Google login successful",
  "data": {
    "user": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@gmail.com",
      "googleId": "google_id",
      "profilePicture": "https://...",
      "authProvider": "google",
      "isVerified": true
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### 5️⃣ Logout (Single Device)

**POST** `/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

---

### 6️⃣ Logout from All Devices

**POST** `/logout-all`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logged out from all devices successfully"
}
```

---

### 7️⃣ Get Current User Profile

**GET** `/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id_here",
      "name": "John Doe",
      "email": "john@example.com",
      "authProvider": "local",
      "isVerified": false,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### 8️⃣ Google OAuth Login (Redirect)

**GET** `/google`

**Description:** Initiates Google OAuth flow (redirect user to this URL)

**Query Parameters:** None

**Response:** Redirects to Google login page

---

### 9️⃣ Google OAuth Callback (Internal)

**GET** `/google/callback`

**Description:** Google callback endpoint (handled by Passport)

**Response:** Redirects to `FRONTEND_URL/auth/callback?accessToken=...&refreshToken=...`

---

## 🔐 Protected Routes Example

To access protected routes, include the access token in header:

```javascript
fetch('http://localhost:3001/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIs...'
  }
})
```

---

## 📱 Frontend Integration Examples

### React Example - Register
```javascript
const handleRegister = async (formData) => {
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    if (data.success) {
      // Store tokens
      localStorage.setItem('accessToken', data.data.accessToken);
      localStorage.setItem('refreshToken', data.data.refreshToken);
      // Redirect to dashboard
      navigate('/dashboard');
    }
  } catch (error) {
    console.error('Registration failed:', error);
  }
};
```

### React Example - Login
```javascript
const handleLogin = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
    localStorage.setItem('refreshToken', data.data.refreshToken);
    navigate('/dashboard');
  }
};
```

### React Example - API Call with Token
```javascript
const fetchWithAuth = async (url) => {
  let token = localStorage.getItem('accessToken');
  
  let response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  // If 401 - refresh token
  if (response.status === 401) {
    const refreshResponse = await fetch('http://localhost:3001/api/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        refreshToken: localStorage.getItem('refreshToken') 
      })
    });
    
    const newData = await refreshResponse.json();
    if (newData.success) {
      localStorage.setItem('accessToken', newData.data.accessToken);
      // Retry original request
      response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${newData.data.accessToken}` }
      });
    }
  }
  
  return response.json();
};
```

### React Example - Google OAuth
```javascript
import { GoogleLogin } from '@react-oauth/google';

<GoogleLogin
  onSuccess={(credentialResponse) => {
    // Send credentials to backend
    fetch('http://localhost:3001/api/auth/google-callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        googleId: credentialResponse.credential,
        // Decode JWT to get email, name, picture
      })
    });
  }}
/>
```

---

## ⏱️ Token Expiry Times

- **Access Token:** 15 minutes
- **Refresh Token:** 30 days
- **Refresh Token in DB:** Auto-deleted after 30 days

---

## 🚨 Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created (registration) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/expired token) |
| 404 | Not Found |
| 409 | Conflict (email already exists) |
| 500 | Server Error |

---

## 💡 Best Practices

1. **Store tokens securely** - Use httpOnly cookies when possible
2. **Auto-refresh tokens** - Refresh before expiry or on 401
3. **Clear tokens on logout** - Remove from localStorage/cookies
4. **HTTPS only** - Use HTTPS in production
5. **Validate input** - Client-side validation before sending
6. **Error handling** - Don't expose sensitive info in errors
7. **Rate limiting** - Add to prevent brute force attacks
