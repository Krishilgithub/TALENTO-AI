# Railway Deployment Guide

## 🚨 **Current Issue Fixed**

The deployment was failing because:

- Docker build was trying to run Python in a Node.js environment
- `buildCommand` was causing conflicts with the build process

## ✅ **Solutions Applied**

### **1. Removed Problematic buildCommand**

- Removed `buildCommand = "cd 'Models/Assessment models' && python deploy_test.py"`
- This was causing the Docker build to fail

### **2. Updated startCommand**

- Changed to: `"cd 'Models/Assessment models' && pip install -r requirements.txt && python start.py"`
- This ensures dependencies are installed before starting

### **3. Added Alternative Files**

- Created `Dockerfile` for direct Docker deployment
- Created `nixpacks.toml` for Railway-specific configuration
- Added `.dockerignore` for optimized builds

## 🚀 **Deployment Options**

### **Option 1: Railway with Nixpacks (Recommended)**

```bash
# Push to Railway
git add .
git commit -m "Fixed Railway deployment configuration"
git push
```

### **Option 2: Railway with Docker**

```bash
# Set Railway to use Dockerfile
railway service update --dockerfile "Models/Assessment models/Dockerfile"
```

### **Option 3: Manual Docker Build**

```bash
cd "Models/Assessment models"
docker build -t talento-ai-backend .
docker run -p 8000:8000 talento-ai-backend
```

## 🔧 **Configuration Files**

### **railway.toml** (Updated)

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd 'Models/Assessment models' && pip install -r requirements.txt && python start.py"
healthcheckPath = "/"
healthcheckTimeout = 60
```

### **nixpacks.toml** (New)

```toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip"]

[phases.install]
cmds = ["pip install -r requirements.txt"]

[start]
cmd = "python start.py"
```

### **Dockerfile** (Alternative)

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
ENV PORT=8000
CMD ["python", "start.py"]
```

## 🛠️ **Troubleshooting**

### **If Railway Still Fails:**

1. **Check Railway Logs**:

   ```bash
   railway logs
   ```

2. **Verify Environment Variables**:

   - Ensure `PORT` is set by Railway
   - Add `HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP` if using AI features

3. **Test Locally First**:

   ```bash
   cd "Models/Assessment models"
   pip install -r requirements.txt
   python start.py
   ```

4. **Use Docker Locally**:
   ```bash
   cd "Models/Assessment models"
   docker build -t talento-ai .
   docker run -p 8000:8000 talento-ai
   ```

## 📋 **Deployment Checklist**

- [ ] All files committed and pushed
- [ ] `railway.toml` updated (no buildCommand)
- [ ] `requirements.txt` has all dependencies
- [ ] `start.py` exists and works locally
- [ ] Environment variables configured in Railway
- [ ] Health check endpoint (`/`) responds correctly

## 🎯 **Expected Behavior**

After successful deployment:

- ✅ Backend starts on Railway-provided port
- ✅ Health check passes (`/` endpoint works)
- ✅ Assessment endpoints respond correctly
- ✅ Logs show module availability status

## 🔄 **Fallback Options**

If Railway continues to fail:

1. **Use Vercel** for the backend
2. **Use Heroku** with the Dockerfile
3. **Use DigitalOcean App Platform**
4. **Self-host** with the Dockerfile

The deployment should now work without the Python command not found error!
