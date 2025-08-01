# Assessment API Backend

This is the FastAPI backend for the TALENTO-AI assessment system.

## Environment Variables

### Required for Full Functionality

- `HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP`: Your HuggingFace Hub access token

### How to Get HuggingFace Token

1. Go to [HuggingFace Settings](https://huggingface.co/settings/tokens)
2. Create a new access token
3. Copy the token

## Deployment

### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to this directory
cd "Models/Assessment models"

# Initialize Railway project
railway init

# Add environment variable
railway variables set HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP=your_token_here

# Deploy
railway up
```

### Render Deployment

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Set configuration:
   - **Root Directory**: `Models/Assessment models`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn assessment_api:app --host 0.0.0.0 --port $PORT`

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Create .env file with your token
echo "HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP=your_token_here" > .env

# Run locally
uvicorn assessment_api:app --reload
```

## API Endpoints

- `POST /api/assessment/upload_resume/` - Technical assessment
- `POST /api/assessment/ats_score/` - ATS scoring
- `POST /api/assessment/resume_optimize/` - Resume optimization
- `POST /api/assessment/communication_test/` - Communication assessment
- `POST /api/assessment/domain_questions/` - Domain-specific questions
- `POST /api/assessment/general_aptitude/` - General aptitude test

## Fallback Mode

If the HuggingFace token is not provided, the API will run in fallback mode with sample responses. This allows the application to deploy and function without the AI model, but with limited functionality.

## Troubleshooting

1. **Missing Token Error**: Add the `HUGGINGFACEHUB_ACCESS_TOKEN_BACKUP` environment variable
2. **Import Errors**: Ensure all dependencies in `requirements.txt` are installed
3. **CORS Issues**: Update the CORS origins in `assessment_api.py` with your frontend URL
