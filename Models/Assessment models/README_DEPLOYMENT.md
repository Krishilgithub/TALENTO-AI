# Railway Deployment Guide for Talento AI

## Issues Fixed

### 1. **Missing Dependencies**

- **Problem**: `requirements.txt` only had Flask, but the app uses FastAPI
- **Solution**: Updated to include `fastapi`, `uvicorn[standard]`, and `python-multipart`

### 2. **Wrong Working Directory**

- **Problem**: Railway was trying to run from root directory instead of the Assessment models directory
- **Solution**: Updated `railway.toml` to `cd` into the correct directory

### 3. **Health Check Timeout**

- **Problem**: 30-second timeout was too short for initial startup
- **Solution**: Increased to 60 seconds

### 4. **Missing Error Handling**

- **Problem**: No proper logging or error handling for debugging
- **Solution**: Added comprehensive logging and startup script

## Files Updated

1. **`requirements.txt`** - Added FastAPI dependencies
2. **`railway.toml`** - Fixed working directory and timeout
3. **`test_app.py`** - Added logging and better error handling
4. **`start.py`** - New startup script with dependency checking
5. **`deploy_test.py`** - New deployment test script
6. **`Procfile`** - Updated to use startup script
7. **`runtime.txt`** - Specified Python version

## Deployment Steps

1. **Push to Railway**: The deployment should now work automatically
2. **Monitor Logs**: Check Railway logs for any startup issues
3. **Test Endpoints**: Verify `/`, `/health`, and `/test` endpoints work

## Troubleshooting

### If deployment still fails:

1. **Check Railway Logs**:

   ```bash
   railway logs
   ```

2. **Test Locally**:

   ```bash
   cd "Models/Assessment models"
   python deploy_test.py
   python start.py
   ```

3. **Verify Dependencies**:

   ```bash
   pip install -r requirements.txt
   python -c "import fastapi, uvicorn; print('Dependencies OK')"
   ```

4. **Check Environment**:
   - Ensure `PORT` environment variable is set
   - Verify Python 3.11 is available

### Common Issues:

1. **"Service Unavailable"**: Usually means the app isn't starting properly
2. **"Health Check Failed"**: App is running but not responding on the health check path
3. **"Build Failed"**: Missing dependencies or syntax errors

## Health Check Endpoints

- `/` - Main health check (returns JSON with status)
- `/health` - Alternative health check
- `/test` - Test endpoint

All endpoints should return JSON responses indicating the service is running.

## Environment Variables

- `PORT` - Railway sets this automatically
- `PYTHON_VERSION` - Set to 3.11

## Monitoring

The app now includes comprehensive logging:

- Startup logs show port and environment info
- Each endpoint call is logged
- Error messages are detailed for debugging
