# Backend Session Configuration Requirements

## Overview
The frontend has been updated to support a 4-hour session duration with automatic token refresh. The backend needs to be updated to match these requirements.

## Required Backend Changes

### 1. JWT Token Expiration Times

Update the JWT token expiration times in your backend configuration:

```javascript
// Current (OLD - needs to be changed)
const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes

// New Required Configuration
const ACCESS_TOKEN_EXPIRY = '15m';  // Keep short for security
const REFRESH_TOKEN_EXPIRY = '4h';  // 4 hours maximum session
```

### 2. Session Duration Logic

The system should work as follows:

- **Access Token**: Short-lived (15 minutes) for security
- **Refresh Token**: Long-lived (4 hours) for session duration
- **Automatic Refresh**: Frontend refreshes access token every 14 minutes
- **Idle Timeout**: Frontend logs out user after 15 minutes of inactivity
- **Maximum Session**: Backend enforces 4-hour maximum session duration

### 3. Refresh Token Endpoint

Ensure your `/auth/refresh-token` endpoint:

1. **Accepts refresh token** from request body:
   ```json
   {
     "refreshToken": "string"
   }
   ```

2. **Returns new tokens**:
   ```json
   {
     "success": true,
     "data": {
       "accessToken": "new_access_token",
       "refreshToken": "new_refresh_token"  // Optional: rotate refresh token
     }
   }
   ```

3. **Validates**:
   - Refresh token is valid and not expired
   - Refresh token hasn't been revoked
   - Session hasn't exceeded 4 hours from initial login
   - User account is still active

4. **Error Responses**:
   - `401 Unauthorized` - Refresh token expired or invalid
   - `403 Forbidden` - Session exceeded maximum duration
   - `500 Internal Server Error` - Server error

### 4. Session Tracking

Implement session tracking to enforce the 4-hour maximum:

```javascript
// Example session data to track
{
  userId: "user_id",
  loginTime: 1234567890,  // Initial login timestamp
  lastRefreshTime: 1234567890,  // Last token refresh
  refreshCount: 5,  // Number of refreshes
  expiresAt: 1234567890 + (4 * 60 * 60 * 1000)  // Login time + 4 hours
}
```

When a refresh request comes in:
1. Check if current time > session.expiresAt
2. If yes, return 401 and force re-login
3. If no, issue new tokens and update lastRefreshTime

### 5. Token Refresh Logic (Backend Pseudocode)

```javascript
async function refreshToken(refreshToken) {
  // 1. Verify refresh token signature
  const decoded = verifyJWT(refreshToken);

  // 2. Get session data
  const session = await getSession(decoded.userId, decoded.sessionId);

  // 3. Check if session exists and is valid
  if (!session) {
    throw new UnauthorizedError('Session not found');
  }

  // 4. Check if session has exceeded 4 hours
  const now = Date.now();
  const sessionAge = now - session.loginTime;
  const FOUR_HOURS = 4 * 60 * 60 * 1000;

  if (sessionAge > FOUR_HOURS) {
    await deleteSession(session.id);
    throw new ForbiddenError('Session expired - maximum duration exceeded');
  }

  // 5. Check if user is still active
  const user = await getUser(decoded.userId);
  if (user.status !== 'active') {
    throw new UnauthorizedError('User account is not active');
  }

  // 6. Generate new tokens
  const newAccessToken = generateJWT({
    userId: user.id,
    email: user.email,
    sessionId: session.id
  }, '15m');

  // Optional: Rotate refresh token for added security
  const newRefreshToken = generateJWT({
    userId: user.id,
    sessionId: session.id,
    type: 'refresh'
  }, '4h');

  // 7. Update session
  await updateSession(session.id, {
    lastRefreshTime: now,
    refreshCount: session.refreshCount + 1
  });

  // 8. Return new tokens
  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
}
```

### 6. Database Schema Updates

Add session tracking table if not exists:

```sql
CREATE TABLE user_sessions (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  login_time BIGINT NOT NULL,
  last_refresh_time BIGINT NOT NULL,
  refresh_count INT DEFAULT 0,
  expires_at BIGINT NOT NULL,
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at)
);
```

### 7. Logout Endpoint

Update logout to properly clean up session:

```javascript
async function logout(userId, sessionId) {
  // Delete the session from database
  await deleteSession(sessionId);

  // Optional: Add refresh token to blacklist
  await addToBlacklist(refreshToken, expiresAt);

  return { success: true };
}
```

### 8. Session Cleanup

Implement a cleanup job to remove expired sessions:

```javascript
// Run every hour
cron.schedule('0 * * * *', async () => {
  const now = Date.now();
  await deleteExpiredSessions(now);
});
```

## Testing Requirements

### Test Cases

1. **Normal Token Refresh**
   - Login with valid credentials
   - Wait 14 minutes
   - Trigger API call (should auto-refresh)
   - Verify new tokens are issued

2. **Session Expiry (4 hours)**
   - Login with valid credentials
   - Mock time to 4 hours + 1 minute later
   - Attempt token refresh
   - Should receive 401/403 and be logged out

3. **Idle Timeout (15 minutes)**
   - Login with valid credentials
   - Don't perform any actions for 16 minutes
   - Frontend should automatically logout
   - Backend should clean up session

4. **Invalid Refresh Token**
   - Send invalid/expired refresh token
   - Should receive 401 error
   - User should be redirected to login

5. **Multiple Tab Support**
   - Open app in multiple tabs
   - Token refresh in one tab should work for all tabs
   - All tabs share the same session

## Configuration Files to Update

### 1. Environment Variables (.env)

```bash
# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=4h

# Session Configuration
MAX_SESSION_DURATION_HOURS=4
IDLE_TIMEOUT_MINUTES=15
```

### 2. Auth Config File

Update your authentication configuration:

```javascript
// config/auth.js
module.exports = {
  jwt: {
    secret: process.env.JWT_SECRET,
    accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '4h',
  },
  session: {
    maxDurationHours: parseInt(process.env.MAX_SESSION_DURATION_HOURS) || 4,
    idleTimeoutMinutes: parseInt(process.env.IDLE_TIMEOUT_MINUTES) || 15,
  }
};
```

## Frontend Implementation Summary

The frontend has been updated with:

1. **Token Refresh Service** (`app/utils/tokenRefreshService.ts`)
   - Automatically refreshes tokens every 14 minutes
   - Monitors user activity for idle timeout
   - Enforces 4-hour maximum session duration

2. **API Interceptors**
   - Both `apiService.ts` and `api-conn.ts` intercept 401 errors
   - Automatically attempt token refresh before logging out
   - Retry failed request with new token

3. **Login Integration**
   - Token refresh service starts after successful login
   - Works with both email/password and Google OAuth

## Migration Plan

1. **Phase 1: Backend Updates**
   - Update JWT expiry times
   - Implement session tracking
   - Update refresh token endpoint

2. **Phase 2: Testing**
   - Test all scenarios listed above
   - Verify frontend and backend work together
   - Load test with multiple concurrent users

3. **Phase 3: Deployment**
   - Deploy backend changes first
   - Verify backend is working correctly
   - Frontend is already updated and deployed

## Questions or Issues?

If you encounter any issues or need clarification:
1. Check the frontend implementation in:
   - `app/utils/tokenRefreshService.ts`
   - `app/api/apiService.ts`
   - `app/api/api-conn.ts`
   - `app/pages/auth/login.tsx`

2. Review the console logs - both frontend and backend log refresh attempts

3. Contact the frontend team for coordination

## Expected Behavior

After implementation:
- ✅ User logs in and can work for up to 4 hours
- ✅ Token automatically refreshes every 14 minutes
- ✅ User is logged out after 15 minutes of inactivity
- ✅ User is logged out after 4 hours total session time
- ✅ On 401 errors, system tries to refresh before logging out
- ✅ Smooth user experience with no interruptions during active use
