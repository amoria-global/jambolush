# Token Refresh Implementation Guide

## Overview

This document describes the implementation of automatic token refresh and session management for the JamboLush application. The system ensures users can work uninterrupted for up to 4 hours while maintaining security through automatic token refresh.

## Features

✅ **4-Hour Maximum Session Duration**
- Users remain logged in for up to 4 hours from initial login
- After 4 hours, users must re-authenticate

✅ **Automatic Token Refresh**
- Access tokens are refreshed every 14 minutes automatically
- Happens in the background without user interaction
- Prevents session interruption during active use

✅ **Idle Timeout Detection (15 minutes of complete inactivity)**
- Users are logged out ONLY after 15 minutes of COMPLETE inactivity
- Activity includes mouse movements, clicks, keyboard input, scrolling
- If user does anything within 15 minutes, the idle timer resets
- Protects against unauthorized access on unattended devices
- **Important**: Token still refreshes every 14 minutes even if user is idle (as long as session < 4 hours)

✅ **Smart 401 Error Handling**
- When API returns 401 (Unauthorized), system attempts token refresh
- Original request is automatically retried with new token
- Only logs out if refresh fails or session expired

✅ **Multi-Tab Support**
- Token refresh in one tab updates tokens for all tabs
- Consistent session across multiple browser tabs

## Architecture

### Components

1. **Token Refresh Service** (`app/utils/tokenRefreshService.ts`)
   - Core service managing automatic refresh and session tracking
   - Monitors user activity and idle time
   - Handles token refresh logic

2. **API Service** (`app/api/apiService.ts`)
   - Intercepts 401 errors and attempts token refresh
   - Retries failed requests with new tokens

3. **API Connector** (`app/api/api-conn.ts`)
   - Alternative API client with same 401 handling
   - Used by some legacy components

4. **Login Integration** (`app/pages/auth/login.tsx`)
   - Initializes token refresh service after successful login
   - Starts session tracking

## How It Works

### Session Flow

```
1. User Login
   ↓
2. Backend issues tokens:
   - accessToken (expires in 15 min)
   - refreshToken (expires in 4 hours)
   ↓
3. Frontend starts Token Refresh Service
   ↓
4. Every 14 minutes: Auto-refresh token (even if user is idle)
   ↓
5. User Activity Monitoring:
   - Any interaction resets idle timer
   - If NO activity for 15 min straight: Logout
   ↓
6. After 4 hours total: Force logout (regardless of activity)
```

### Token Refresh Flow

```
1. Timer triggers (every 14 min)
   ↓
2. Check session age (< 4 hours?)
   ↓
3. Call /auth/refresh-token with refreshToken
   ↓
4. Backend validates and returns new tokens
   ↓
5. Update localStorage with new tokens
   ↓
6. Continue session
```

### 401 Error Handling Flow

```
1. API call receives 401 response
   ↓
2. Check if user has auth tokens
   ↓
3. Attempt token refresh
   ↓
4. If refresh succeeds:
   - Retry original request with new token
   - Return successful response
   ↓
5. If refresh fails:
   - Clear tokens
   - Show session expired modal
   - Redirect to login
```

## Usage

### Starting a Session

The token refresh service is automatically started after login:

```typescript
// In login.tsx - automatically called after successful login
if (accessToken) {
  localStorage.setItem('authToken', accessToken);
  localStorage.setItem('refreshToken', refreshToken);

  // Initialize token refresh service
  tokenRefreshService.startSession();
}
```

### Manual Token Refresh

You can manually trigger a token refresh:

```typescript
import { tokenRefreshService } from '@/app/utils/tokenRefreshService';

const success = await tokenRefreshService.refreshToken();
if (success) {
  console.log('Token refreshed successfully');
} else {
  console.log('Token refresh failed');
}
```

### Checking Session Status

```typescript
import { tokenRefreshService } from '@/app/utils/tokenRefreshService';

// Get session information
const sessionInfo = tokenRefreshService.getSessionInfo();
console.log('Session age:', sessionInfo?.loginTime);
console.log('Last activity:', sessionInfo?.lastActivityTime);
console.log('Refresh count:', sessionInfo?.refreshCount);

// Check if service is running
const isRunning = tokenRefreshService.isRunning();
console.log('Service running:', isRunning);
```

### Handling Session Expiry

Set a callback to handle session expiry:

```typescript
import { tokenRefreshService } from '@/app/utils/tokenRefreshService';

tokenRefreshService.setSessionExpiredCallback((reason: string) => {
  console.log('Session expired:', reason);
  // Show modal, redirect to login, etc.
});
```

### Stopping the Service (Logout)

```typescript
import { tokenRefreshService } from '@/app/utils/tokenRefreshService';

// On logout
tokenRefreshService.stop();
localStorage.removeItem('authToken');
localStorage.removeItem('refreshToken');
```

## Configuration

The token refresh service can be configured with custom values:

```typescript
import { TokenRefreshService } from '@/app/utils/tokenRefreshService';

const customService = new TokenRefreshService({
  refreshIntervalMinutes: 14,  // Refresh every 14 minutes (default)
  maxSessionHours: 4,          // 4 hour max session (default)
  idleTimeoutMinutes: 15,      // 15 minute idle timeout (default)
});
```

## localStorage Keys

The system uses these localStorage keys:

- `authToken` - Current access token (JWT)
- `refreshToken` - Refresh token for getting new access tokens
- `sessionData` - Session tracking data (login time, activity, etc.)

## API Endpoints Required

### 1. Login Endpoint

**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Refresh Token Endpoint

**POST** `/auth/refresh-token`

Request:
```json
{
  "refreshToken": "eyJhbGc..."
}
```

Response (Success):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."  // Optional: new refresh token
  }
}
```

Response (Failure):
```json
{
  "success": false,
  "message": "Refresh token expired or invalid"
}
```
HTTP Status: 401 Unauthorized

## Error Handling

### Session Expired Scenarios

1. **Maximum Duration Exceeded (4 hours) - ALWAYS ENFORCED**
   ```
   User logged in at 10:00 AM
   Current time: 2:01 PM (4 hours 1 minute later)
   Result: Session expired, must re-login
   Note: This happens regardless of user activity
   ```

2. **Idle Timeout (15 minutes of COMPLETE inactivity)**
   ```
   Last activity: 10:00 AM
   Current time: 10:16 AM
   No user interaction during this entire period
   Result: Session expired, force re-login

   Example of NO logout:
   Last activity: 10:00 AM
   User clicks at: 10:10 AM (activity detected)
   Current time: 10:25 AM
   Result: Still logged in (idle timer was reset at 10:10 AM)
   ```

3. **Invalid Refresh Token**
   ```
   Token refresh returns 401
   Result: Session expired, force re-login
   ```

4. **Network Error**
   ```
   Token refresh network failure
   Result: Retry on next interval or 401 error
   ```

## Security Considerations

### ✅ Token Storage
- Tokens stored in localStorage (accessible only to same origin)
- Refresh token is separate from access token
- Both tokens are cleared on logout

### ✅ Token Lifetime
- Access token: Short-lived (15 minutes) for security
- Refresh token: Medium-lived (4 hours) for usability
- Balance between security and user experience

### ✅ Automatic Logout
- Idle timeout prevents unauthorized access on unattended devices
- Maximum session prevents indefinite access
- Immediate logout on refresh token failure

### ✅ Activity Tracking
- Only tracks activity timestamps, no sensitive data
- Used only for idle timeout detection
- Cleared on logout

### ⚠️ Recommendations
- Use HTTPS in production to encrypt token transmission
- Implement refresh token rotation (backend)
- Consider implementing device fingerprinting (backend)
- Monitor for suspicious refresh patterns (backend)

## Testing

### Manual Testing

1. **Test Auto-Refresh**
   ```
   1. Login to the application
   2. Open browser console
   3. Wait 14 minutes
   4. Watch for "[TokenRefreshService] Auto-refresh triggered" log
   5. Verify new token in localStorage
   ```

2. **Test Idle Timeout**
   ```
   1. Login to the application
   2. Don't interact for 16 minutes
   3. Should be automatically logged out
   ```

3. **Test 401 Handling**
   ```
   1. Login to the application
   2. Manually expire the access token (backend)
   3. Make an API call
   4. Should auto-refresh and retry
   ```

4. **Test Maximum Session**
   ```
   1. Login to the application
   2. Mock the login time to 4 hours ago (edit sessionData in localStorage)
   3. Try to make an API call
   4. Should logout due to max session exceeded
   ```

### Automated Testing

```typescript
// Example test
describe('Token Refresh Service', () => {
  it('should refresh token automatically', async () => {
    const service = new TokenRefreshService({
      refreshIntervalMinutes: 1, // 1 minute for testing
    });

    localStorage.setItem('authToken', 'test_token');
    localStorage.setItem('refreshToken', 'test_refresh_token');

    service.startSession();

    await new Promise(resolve => setTimeout(resolve, 61000)); // Wait 61 seconds

    // Verify token was refreshed
    expect(mockRefreshEndpoint).toHaveBeenCalled();
  });
});
```

## Monitoring & Debugging

### Console Logs

The system logs important events to the console:

```
[TokenRefreshService] Initialized successfully
[TokenRefreshService] Auto-refresh triggered
[TokenRefreshService] Token refreshed successfully
[TokenRefreshService] Session expired: Maximum session duration reached
[apiService] Received 401, attempting token refresh...
[apiService] Token refreshed successfully, retrying original request
[api-conn] Token refresh failed, session expired
```

### Session Information

Check current session info in console:

```javascript
tokenRefreshService.getSessionInfo()
// Returns:
// {
//   loginTime: 1234567890,
//   lastActivityTime: 1234567890,
//   lastRefreshTime: 1234567890,
//   refreshCount: 5
// }
```

### localStorage Inspection

Check tokens in browser DevTools:

```
Application → Local Storage → https://your-domain.com
- authToken: eyJhbGc...
- refreshToken: eyJhbGc...
- sessionData: {"loginTime":1234567890,...}
```

## Troubleshooting

### Issue: Token not refreshing automatically

**Solution:**
1. Check if service is running: `tokenRefreshService.isRunning()`
2. Verify tokens exist in localStorage
3. Check console for error messages
4. Verify backend `/auth/refresh-token` endpoint is working

### Issue: Getting logged out unexpectedly

**Solution:**
1. Check if it's idle timeout (15 min of inactivity)
2. Check if session exceeded 4 hours
3. Verify refresh token is valid on backend
4. Check network tab for 401 responses

### Issue: Token refresh fails with 401

**Solution:**
1. Check if refresh token is expired (4 hours)
2. Verify refresh token format on backend
3. Check if session tracking is working on backend
4. Verify user account is still active

### Issue: Multiple tabs showing different states

**Solution:**
1. Tokens are shared via localStorage
2. Ensure all tabs are on same origin
3. Check if localStorage sync is working across tabs
4. Consider using BroadcastChannel API for better sync

## Migration from Old System

If migrating from a system without automatic refresh:

1. **Backend Changes First**
   - Implement `/auth/refresh-token` endpoint
   - Update JWT expiry times
   - Add session tracking

2. **Frontend Changes**
   - Already implemented in this update
   - Initialize service in login flow
   - Test thoroughly

3. **Gradual Rollout**
   - Deploy backend changes
   - Monitor for issues
   - Frontend automatically uses new system

## Future Enhancements

Potential improvements:

- [ ] Implement token refresh queue to prevent concurrent refreshes
- [ ] Add refresh token rotation for enhanced security
- [ ] Implement device fingerprinting
- [ ] Add session management dashboard for users
- [ ] Support "Remember Me" for extended sessions
- [ ] Add biometric authentication for sensitive actions
- [ ] Implement suspicious activity detection

## Support

For questions or issues:
- Review this documentation
- Check console logs for errors
- Review the backend documentation: `BACKEND_SESSION_CONFIG.md`
- Contact the development team

## Version History

- **v1.0.0** (Current) - Initial implementation
  - 4-hour maximum session
  - 14-minute auto-refresh
  - 15-minute idle timeout
  - Smart 401 handling
