# Resume Optimization & ATS Scoring Setup

## Overview

The Overview section in the dashboard now includes two new features:

1. **Resume Optimization** - AI-powered resume analysis and improvement suggestions
2. **ATS Score Calculation** - Applicant Tracking System compatibility scoring

## Backend Setup

### 1. Deploy Your Backend API

Follow the deployment instructions in `Models/Assessment models/README.md` to deploy your FastAPI backend to Railway or Render.

### 2. Environment Configuration

Create a `.env.local` file in your project root with:

```env
# Backend API URL - Update with your deployed backend URL
BACKEND_API_URL=https://your-app-name.railway.app

# For local development:
# BACKEND_API_URL=http://localhost:8000
```

## Frontend Features

### Resume Upload

- Drag and drop or click to upload PDF, DOC, or DOCX files
- File validation and size checking
- Visual feedback during upload

### Job Role Input

- Specify target job role for better analysis
- Default: "Software Engineer"
- Customizable for any position

### Action Buttons

#### Optimize Resume

- **Icon**: Sparkles
- **Color**: Cyan to Blue gradient
- **Function**: Analyzes resume and provides improvement suggestions
- **Output**: Detailed analysis in modal popup

#### Find ATS Score

- **Icon**: Chart Bar
- **Color**: Purple to Pink gradient
- **Function**: Calculates ATS compatibility score
- **Output**: Score and feedback in modal popup

## API Integration

### Resume Optimization API

- **Endpoint**: `/api/assessment/resume_optimize`
- **Method**: POST
- **Input**: File upload + job role
- **Output**: Detailed optimization analysis

### ATS Scoring API

- **Endpoint**: `/api/assessment/ats_score`
- **Method**: POST
- **Input**: File upload + job role
- **Output**: ATS score and feedback

## Usage Flow

1. **Upload Resume**: Drag and drop or select a resume file
2. **Set Job Role**: Enter target position (optional)
3. **Choose Action**: Click either "Optimize Resume" or "Find ATS Score"
4. **View Results**: Results appear in a modal popup
5. **Close Modal**: Click X or outside modal to close

## Error Handling

- File format validation
- Upload progress indicators
- Error messages for failed requests
- Loading states during processing

## Backend Requirements

Ensure your backend has:

- CORS configured for your frontend domain
- File upload handling
- HuggingFace API token (for full functionality)
- Proper error responses

## Troubleshooting

1. **Backend Connection Error**: Check `BACKEND_API_URL` in `.env.local`
2. **File Upload Issues**: Ensure file is PDF, DOC, or DOCX format
3. **API Errors**: Check backend logs for detailed error messages
4. **CORS Issues**: Update CORS origins in backend configuration

## Development Notes

- Backend runs on port 8000 locally
- Frontend runs on port 3000 locally
- API routes proxy requests to backend
- Results are displayed in formatted modals
