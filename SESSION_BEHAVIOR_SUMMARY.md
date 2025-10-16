# Session Behavior Summary

## Simple Explanation

Your session management now works like this:

### ✅ What Happens

1. **You log in** → Session starts, you can work for up to 4 hours

2. **Every 14 minutes** → Your token automatically refreshes in the background
   - This happens even if you're not doing anything
   - You won't notice it happening
   - Keeps your session alive

3. **Any activity resets the idle timer**
   - Moving your mouse
   - Clicking anything
   - Typing on keyboard
   - Scrolling the page
   - Any interaction with the app

4. **After 15 minutes of ZERO activity** → You get logged out
   - This only happens if you literally do nothing for 15 minutes straight
   - If you move your mouse even once during those 15 minutes, the timer resets
   - This protects you if you leave your computer unattended

5. **After 4 hours total** → You MUST log in again
   - Doesn't matter if you're actively using it
   - This is a security measure
   - Cannot be extended, must re-login

### 📊 Real-World Scenarios

#### Scenario 1: Active User
```
10:00 AM - Log in
10:14 AM - Auto token refresh (you don't notice)
10:28 AM - Auto token refresh (you don't notice)
10:42 AM - Auto token refresh (you don't notice)
... continues every 14 minutes
2:00 PM - 4 hours reached, must re-login
```
**Result**: You work normally for 4 hours, then need to log in again

#### Scenario 2: Taking a Break
```
10:00 AM - Log in, start working
10:30 AM - Go to lunch, leave computer
10:45 AM - Still logged in (only 15 min idle)
10:46 AM - Get logged out (15 min idle timeout)
```
**Result**: Logged out after 15 minutes of not touching anything

#### Scenario 3: Occasional Activity
```
10:00 AM - Log in
10:10 AM - Click something (idle timer resets)
10:20 AM - Type something (idle timer resets)
10:30 AM - Scroll page (idle timer resets)
... you occasionally interact
1:30 PM - Still logged in (never hit 15 min idle)
2:00 PM - 4 hours reached, must re-login
```
**Result**: As long as you do SOMETHING every 15 minutes, you stay logged in until 4 hours

#### Scenario 4: Working on Another Tab
```
10:00 AM - Log in to app
10:05 AM - Switch to different website, work there for 20 minutes
10:25 AM - Switch back to app
```
**Result**: You're LOGGED OUT because you didn't interact with the app for more than 15 minutes

#### Scenario 5: Reading Content
```
10:00 AM - Log in
10:05 AM - Start reading a long article
10:20 AM - Still reading (haven't scrolled or clicked)
```
**Result**: You're LOGGED OUT because no mouse/keyboard activity for 15+ minutes

**To Stay Logged In While Reading**: Just scroll occasionally or move your mouse

### 🔄 Token Refresh Behavior

**Important**: Token refresh happens independently of user activity!

```
Token refreshes every 14 minutes automatically
↓
Even if you're idle
↓
Until 4 hours is reached OR you're idle for 15+ minutes
```

This means:
- ✅ You can leave the tab open and come back in 10 minutes - still logged in
- ✅ Token refreshes happen even if you're not using the app
- ❌ If you don't interact for 15 minutes - logged out (security)
- ❌ After 4 hours - logged out (security)

### 🎯 Key Takeaways

1. **Normal use**: You'll work for up to 4 hours without interruption

2. **Step away briefly** (< 15 min): Still logged in when you return

3. **Step away longer** (> 15 min): Need to log in again (security feature)

4. **Long work session**: After 4 hours, must re-login (security requirement)

5. **Background refresh**: Happens automatically, you never notice it

6. **Activity tracking**: Any mouse/keyboard action keeps you logged in

### 🔒 Why These Rules?

1. **14-minute refresh**: Keeps your session alive without you noticing

2. **15-minute idle timeout**:
   - Protects your account if you walk away
   - Someone else can't use your computer to access your account
   - Industry standard security practice

3. **4-hour maximum**:
   - Security best practice
   - Forces periodic re-authentication
   - Limits exposure if credentials are compromised
   - Complies with security standards

### 💡 Tips for Best Experience

1. **For long reading sessions**: Scroll occasionally or move your mouse every 10 minutes

2. **Taking a break?**: If > 15 minutes, expect to log in again (this is good for security)

3. **Long work day?**: You'll need to log in every 4 hours (2-3 times per work day)

4. **Multiple tabs?**: Each tab shares the same session, but you need to interact with the APP tab to prevent idle logout

5. **Meeting or call?**: If > 15 minutes without touching the app, you'll need to re-login after

### 📱 What You'll Experience

**Normal Day:**
```
9:00 AM - Log in
Work normally...
1:00 PM - Still logged in (4 hours not reached yet)
1:01 PM - Prompted to log in again (4 hours reached)
Log in again...
Work normally...
5:01 PM - Prompted to log in again (another 4 hours)
```

**With Breaks:**
```
9:00 AM - Log in
10:30 AM - Go to 20-minute meeting
10:50 AM - Return, need to log in again (idle > 15 min)
Continue working...
```

### 🚫 What Won't Happen

- ❌ You won't get logged out randomly while actively working
- ❌ You won't get interrupted every 15 minutes
- ❌ You won't need to manually refresh your session
- ❌ You won't lose your work due to unexpected logout (as long as you're saving)

### ✅ What Will Happen

- ✅ Smooth experience while actively working
- ✅ Automatic session management in background
- ✅ Protection when you leave your computer unattended
- ✅ Regular re-authentication for security (every 4 hours)
- ✅ Transparent token refresh every 14 minutes

## Technical Summary

For developers:

| Event | Action | Result |
|-------|--------|--------|
| Login | Start session, set loginTime | 4-hour session begins |
| Every 14 min | Auto token refresh | Session stays alive |
| Any user activity | Update lastActivityTime | Idle timer resets |
| 15 min no activity | Check idle timeout | Force logout |
| 4 hours since login | Check max duration | Force logout |
| 401 API error | Attempt token refresh | Retry request or logout |
| Logout | Stop service, clear tokens | End session |

## Configuration

Current settings (can be adjusted):
```typescript
refreshIntervalMinutes: 14  // Auto-refresh every 14 minutes
maxSessionHours: 4          // Maximum 4-hour session
idleTimeoutMinutes: 15      // Logout after 15 min idle
```

These are balanced for security and user experience based on industry standards.
