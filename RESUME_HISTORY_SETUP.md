# Resume History System - Setup Guide

## Overview
The Resume History System allows users to upload, store, and manage their resumes with comprehensive tracking of ATS scores, optimization results, and analysis history. This system integrates with your existing Supabase setup and provides a complete CRUD interface for resume management.

## Features Implemented

### 1. Resume Upload & Storage
- **File Upload**: Drag-and-drop interface for PDF, DOC, DOCX, and TXT files
- **File Storage**: Secure file storage in Supabase Storage with user-specific folders
- **Content Extraction**: Text extraction from uploaded files for analysis
- **Metadata Tracking**: File size, type, upload date, and original filename

### 2. History Management
- **Resume List**: View all uploaded resumes with metadata
- **Analysis Tracking**: Store and display ATS scores, optimization results, and feedback
- **Delete Functionality**: Remove resumes and associated analyses
- **Responsive Design**: Works on desktop and mobile devices

### 3. Database Integration
- **Secure Storage**: Row Level Security (RLS) ensures users only see their own data
- **Relational Data**: Proper foreign key relationships between resumes and analyses
- **Performance**: Indexed queries for fast retrieval
- **Auto-timestamps**: Automatic creation and update timestamps

## Setup Instructions

### Step 1: Database Setup
1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Run the SQL commands from `database_setup.sql`:

```sql
-- Run all the commands in database_setup.sql file
-- This creates the tables, indexes, and RLS policies
```

### Step 2: Storage Setup
1. In Supabase dashboard, go to Storage
2. Create a new bucket called `resumes`
3. Make it private (not public)
4. Set up the storage policies (included in the SQL file comments)

### Step 3: Environment Variables
Make sure your `.env.local` file has the Supabase configuration:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 4: Test the System
1. Start your Next.js development server:
   ```bash
   npm run dev
   ```

2. Navigate to the dashboard and click on "Resume History" in the sidebar

3. Test the upload functionality:
   - Click "Upload Resume"
   - Drag and drop a file or click to browse
   - Verify the file appears in the resume list

## File Structure

```
app/
├── dashboard/
│   └── components/
│       ├── HistoryTab.jsx          # Main history interface
│       └── Sidebar.jsx             # Updated with history tab
├── components/
│   └── ResumeUpload.jsx            # File upload component
utils/
└── resumeStorage.js                # Database operations
database_setup.sql                  # Database schema
```

## Component Usage

### HistoryTab.jsx
- Main interface for resume history management
- Displays list of uploaded resumes
- Shows analysis results for each resume
- Provides upload and delete functionality

### ResumeUpload.jsx
- Reusable file upload component
- Handles file validation and processing
- Integrates with storage and database
- Provides upload progress feedback

### resumeStorage.js
- Utility functions for database operations
- File upload to Supabase storage
- CRUD operations for resumes and analyses
- Text extraction from files

## Integration with Existing Features

### ATS Score Integration
When you run ATS analysis, save the results using:

```javascript
import { saveAnalysis } from '../utils/resumeStorage';

// After generating ATS score
const analysisData = {
  analysis_type: 'ats_score',
  score: atsScore,
  feedback: feedbackText,
  suggestions: suggestionsObject,
  model_used: 'your-model-name'
};

await saveAnalysis(supabase, resumeId, userId, analysisData);
```

### Resume Optimization Integration
When you optimize a resume, save the results:

```javascript
const analysisData = {
  analysis_type: 'optimization',
  feedback: optimizedContent,
  suggestions: optimizationSuggestions,
  model_used: 'optimization-model'
};

await saveAnalysis(supabase, resumeId, userId, analysisData);
```

## Database Schema

### resumes table
- `id`: UUID primary key
- `user_id`: Foreign key to auth.users
- `filename`: Stored filename in storage
- `original_name`: Original uploaded filename
- `file_size`: File size in bytes
- `file_type`: MIME type
- `content`: Extracted text content
- `upload_date`: When uploaded
- `created_at`, `updated_at`: Timestamps

### resume_analyses table
- `id`: UUID primary key
- `resume_id`: Foreign key to resumes
- `user_id`: Foreign key to auth.users
- `analysis_type`: Type of analysis (ats_score, optimization, etc.)
- `score`: Numeric score (for ATS)
- `feedback`: Text feedback
- `suggestions`: JSON object with suggestions
- `model_used`: Which AI model was used
- `analysis_date`: When analysis was performed

## Security Features

1. **Row Level Security**: Users can only access their own data
2. **File Storage Security**: Files stored in user-specific folders
3. **Input Validation**: File type and size restrictions
4. **Error Handling**: Comprehensive error handling and user feedback

## Next Steps

1. **Test the basic functionality** by uploading a resume
2. **Integrate with your ATS scoring system** to save analysis results
3. **Add resume optimization results** to the analysis tracking
4. **Customize the UI** to match your existing design system
5. **Add additional analysis types** as needed

## Troubleshooting

### Common Issues

1. **Upload fails**: Check Supabase storage bucket exists and policies are set
2. **Database errors**: Ensure all tables are created and RLS is enabled
3. **File not displaying**: Verify the storage policies allow user access
4. **Analysis not saving**: Check the resume_analyses table and foreign keys

### Debug Steps

1. Check browser console for JavaScript errors
2. Check Supabase logs for database/storage errors
3. Verify user authentication is working
4. Test database operations in Supabase SQL editor

## Support

If you encounter issues:
1. Check the browser console for errors
2. Review the Supabase dashboard for any policy or storage issues
3. Test the database queries directly in the SQL editor
4. Ensure all environment variables are properly set

The system is now ready for use and can be extended with additional features as needed!