# Railway Deployment Checklist

## Files That Must Exist

- ✅ `main.py` - Simple FastAPI app
- ✅ `Procfile` - Points to main:app
- ✅ `railway.json` - Points to main:app
- ✅ `requirements.txt` - Only fastapi and uvicorn
- ✅ `runtime.txt` - Python 3.11

## File Contents Check

### main.py

```python
from fastapi import FastAPI
import uvicorn
import os

app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World", "status": "healthy"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

### Procfile

```
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### railway.json

```json
{
	"build": {
		"builder": "nixpacks"
	},
	"deploy": {
		"startCommand": "uvicorn main:app --host 0.0.0.0 --port $PORT"
	}
}
```

### requirements.txt

```
fastapi
uvicorn
```

### runtime.txt

```
python-3.11
```

## Deployment Steps

1. **Verify all files exist and have correct content**
2. **Push to repository**
3. **Deploy to Railway**
4. **Check logs for any errors**
5. **Test endpoints after deployment**

## Expected Behavior

- Build time: ~80 seconds
- Startup time: <30 seconds
- Health checks: Should pass immediately
- Endpoints: / and /health should return 200 OK

## Troubleshooting

If still failing:

1. Check Railway logs for specific error messages
2. Verify Python version compatibility
3. Try different Python version in runtime.txt
4. Check if Railway is using the correct directory

## This Should Definitely Work

This is the absolute minimal FastAPI setup that Railway supports. If this doesn't work, there's likely an issue with the Railway configuration or the repository setup.
