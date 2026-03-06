# Troubleshooting: Can't Open the Project

## Issues Found & Fixes

### 1. ✅ Fixed: `uv_interface_addresses` Error
**Symptom:** `NodeError [SystemError]: uv_interface_addresses returned Unknown system error 1`

**Cause:** Next.js tries to enumerate network interfaces; this can fail in some environments (Cursor sandbox, restricted shells).

**Fix applied:** The `dev` script now uses `-H 127.0.0.1` to bind to localhost explicitly, avoiding the network interface lookup.

### 2. Port 3000 Already in Use
**Symptom:** `Port 3000 is in use by process XXXX` or `EADDRINUSE: address already in use :::3000`

**Fix:** Either kill the process using port 3000, or use a different port:

```bash
# Find what's using port 3000
lsof -i :3000

# Kill it (replace PID with the actual process ID)
kill <PID>

# Or run dev on a different port
npm run dev -- -p 3005
```

### 3. EMFILE: Too Many Open Files
**Symptom:** `Watchpack Error (watcher): Error: EMFILE: too many open files`

**Cause:** Your system's file descriptor limit is too low for the file watcher.

**Fix (macOS):**
```bash
# Check current limit
ulimit -n

# Increase temporarily (add to ~/.zshrc or ~/.bashrc for persistence)
ulimit -n 65536
```

### 4. 404 on Homepage (Dev Mode)
If you see 404 when opening `http://localhost:3000`, it can be caused by:
- EMFILE errors preventing the file watcher from detecting your app files
- Try the production build instead: `npm run build && npm run start`

---

## Quick Start (After Fixes)

1. **Stop any existing dev servers** (Ctrl+C in terminals running `npm run dev`)
2. **Free port 3000** if needed: `lsof -i :3000` then `kill <PID>`
3. **Run:** `npm run dev`
4. **Open:** http://127.0.0.1:3000 (or the port shown in the terminal)
