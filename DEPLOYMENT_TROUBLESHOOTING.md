# Railway Deployment Troubleshooting Guide

## 🚨 **Current Issue: pip: command not found**

The error occurs because Railway is not properly installing Python and pip before trying to run the startCommand.

## ✅ **Solutions Applied**

### **1. Updated railway.toml**

- Removed `pip install` from startCommand
- Simplified to just run Python directly

### **2. Added nixpacks.toml in Root**

- Ensures Python 3.11 is installed during build
- Installs dependencies during build phase
- Properly configures the start command

### **3. Added Alternative Files**

- `runtime.txt` in root to specify Python version
- `Procfile` as alternative deployment method

## 🚀 **Deployment Options**

### **Option 1: Use Nixpacks (Recommended)**

Railway will automatically detect the `nixpacks.toml` and use it for deployment.

### **Option 2: Use Procfile**

Railway can also use the `Procfile` for deployment.

### **Option 3: Manual Configuration**

Set Railway to use the Dockerfile in the assessment models directory.

## 🔧 **Configuration Files**

### **railway.toml** (Updated)

```toml
[build]
builder = "nixpacks"

[deploy]
startCommand = "cd 'Models/Assessment models' && python start.py"
healthcheckPath = "/"
healthcheckTimeout = 60
```

### **nixpacks.toml** (Root Directory)

```toml
[phases.setup]
nixPkgs = ["python311", "python311Packages.pip"]

[phases.install]
cmds = ["cd 'Models/Assessment models' && pip install -r requirements.txt"]

[start]
cmd = "cd 'Models/Assessment models' && python start.py"
```

### **Procfile** (Alternative)

```
web: cd "Models/Assessment models" && python start.py
```

## 🛠️ **Troubleshooting Steps**

### **Step 1: Check Railway Logs**

```bash
railway logs
```

### **Step 2: Verify Build Process**

- Look for "Installing Python" messages
- Check if dependencies are being installed
- Verify the start command is correct

### **Step 3: Test Locally**

```bash
cd "Models/Assessment models"
pip install -r requirements.txt
python start.py
```

### **Step 4: Use Docker Alternative**

```bash
cd "Models/Assessment models"
docker build -t talento-ai .
docker run -p 8000:8000 talento-ai
```

## 📋 **Deployment Checklist**

- [ ] `nixpacks.toml` exists in root directory
- [ ] `railway.toml` has correct startCommand
- [ ] `requirements.txt` has all dependencies
- [ ] `start.py` exists and works locally
- [ ] Environment variables are set in Railway
- [ ] Health check endpoint (`/`) responds correctly

## 🎯 **Expected Build Process**

1. **Setup Phase**: Install Python 3.11 and pip
2. **Install Phase**: Install requirements from `requirements.txt`
3. **Build Phase**: Complete build process
4. **Start Phase**: Run `python start.py`

## 🔄 **Alternative Solutions**

If Railway continues to fail:

### **Option A: Use Heroku**

```bash
# Create Procfile for Heroku
echo "web: cd 'Models/Assessment models' && python start.py" > Procfile

# Deploy to Heroku
heroku create your-app-name
git push heroku main
```

### **Option B: Use Vercel**

```bash
# Create vercel.json
{
  "builds": [
    {
      "src": "Models/Assessment models/start.py",
      "use": "@vercel/python"
    }
  ]
}
```

### **Option C: Use DigitalOcean App Platform**

- Use the Dockerfile for deployment
- Configure environment variables
- Deploy directly from GitHub

## 🚨 **Common Issues and Solutions**

### **Issue 1: pip: command not found**

**Solution**: Use nixpacks.toml to ensure Python is installed

### **Issue 2: Module not found**

**Solution**: Check requirements.txt and ensure all dependencies are listed

### **Issue 3: Health check fails**

**Solution**: Verify the `/` endpoint returns a valid response

### **Issue 4: Environment variables missing**

**Solution**: Set required environment variables in Railway dashboard

## 📊 **Monitoring Deployment**

### **Check Build Logs**

- Look for Python installation messages
- Verify dependency installation
- Check for any error messages

### **Check Runtime Logs**

- Monitor application startup
- Check for import errors
- Verify endpoint responses

### **Test Endpoints**

```bash
# Test health check
curl https://your-railway-app.railway.app/

# Test assessment endpoint
curl -X POST https://your-railway-app.railway.app/api/assessment/technical_assessment/
```

The deployment should now work with proper Python installation and dependency management!
