# Resume-Analysis Linkage Testing Guide

## 🔗 **Issue: Linking ATS Scores and Analyses to Specific Resumes**

The goal is to ensure that when you upload a resume in the Overview tab and run ATS scoring or optimization, the results are saved and linked to that specific resume in the history system.

## 🧪 **Testing Steps**

### **Step 1: Verify Database Setup**
First, make sure you have created the database tables by running the SQL from `database_setup.sql` in your Supabase SQL Editor.

### **Step 2: Test Resume Upload & Analysis Flow**

1. **Open Browser Console**
   - Press F12 to open Developer Tools
   - Go to Console tab to see debug messages

2. **Upload a Resume in Overview Tab**
   - Go to Dashboard → Overview tab
   - Upload a resume file
   - **Look for console message:** `"Resume uploaded successfully. Resume ID: [some-uuid]"`
   - Note down this Resume ID

3. **Run ATS Scoring**
   - Click "Find ATS Score" button
   - **Look for console messages:**
     ```
     Saving ATS analysis: { resumeId: "uuid", analysisData: {...} }
     ATS analysis saved successfully: { id: "analysis-uuid", ... }
     ```

4. **Run Resume Optimization**
   - Click "Optimize Resume" button
   - **Look for console messages:**
     ```
     Saving optimization analysis: { resumeId: "uuid", analysisData: {...} }
     Optimization analysis saved successfully: { id: "analysis-uuid", ... }
     ```

### **Step 3: Verify in History Tab**

1. **Go to History Tab**
   - Click "Resume History" in sidebar
   - Your uploaded resume should appear in the list

2. **Select the Resume**
   - Click on the resume you just uploaded
   - **Look for console message:** `"Fetching analyses for resume ID: [uuid]"`
   - **Look for console message:** `"Fetched analyses: [array of analysis objects]"`

3. **Check Analysis Display**
   - Click "Analyses" button (should show count > 0)
   - You should see the ATS score and optimization results
   - Each analysis should show the correct type and data

## 🔍 **Debugging Checklist**

### **If No Analyses Appear:**

1. **Check Console Errors**
   - Look for any red error messages in browser console
   - Common issues: database connection, missing tables, RLS policies

2. **Verify Resume ID Consistency**
   - The Resume ID from upload should match the one in fetch analyses
   - If they don't match, there's a state management issue

3. **Check Database Directly**
   - Go to Supabase Dashboard → Table Editor
   - Check `resumes` table for your uploaded resume
   - Check `resume_analyses` table for linked analyses
   - Verify `resume_id` matches between tables

### **If Analyses Not Linking:**

1. **Check `currentResumeId` State**
   - The console should show the Resume ID being set on upload
   - If it shows "No currentResumeId available", the state isn't being set

2. **Verify Analysis Saving**
   - Console should show successful save messages
   - If it shows save errors, check the analysis data structure

### **If Upload Issues:**

1. **Check File Processing**
   - Verify file upload completes successfully
   - Check if file appears in Supabase Storage bucket
   - Ensure resume record is created in database

## 🛠 **Common Fixes**

### **Fix 1: Database Tables Missing**
```sql
-- Run this in Supabase SQL Editor if tables don't exist
-- Use the complete SQL from database_setup.sql
```

### **Fix 2: Storage Bucket Missing**
- Go to Supabase → Storage
- Create "resumes" bucket (private)
- Set up the 3 storage policies

### **Fix 3: RLS Policies**
- Ensure RLS is enabled on both tables
- Verify policies allow authenticated users to access their own data

### **Fix 4: State Management**
```javascript
// If currentResumeId not being set, check this in OverviewTab.jsx
const result = await saveResume(supabase, resumeData);
if (result.success) {
    setCurrentResumeId(result.data.id); // This should log the ID
}
```

## 📊 **Expected Data Flow**

1. **Upload Resume** → `resumes` table record created with unique ID
2. **Set State** → `currentResumeId` stores the resume ID
3. **Run Analysis** → `resume_analyses` record created with `resume_id` linking to step 1
4. **View History** → Query analyses by `resume_id` to show linked results

## ✅ **Success Indicators**

- ✅ Console shows resume ID on upload
- ✅ Console shows successful analysis saves with resume ID
- ✅ History tab shows analyses linked to specific resumes
- ✅ Each resume has its own separate analysis history
- ✅ Analysis count shows correct number in History tab

## 🚨 **Red Flags**

- ❌ "No currentResumeId available" console warnings
- ❌ Analysis save errors in console
- ❌ Empty analyses array in History tab
- ❌ Analyses appear under wrong resume
- ❌ Database connection errors

## 📝 **Manual Database Verification**

If testing through the UI doesn't work, check directly in Supabase:

1. **Go to Supabase Dashboard → Table Editor**
2. **Check `resumes` table:**
   - Find your uploaded resume by `original_name`
   - Note the `id` field

3. **Check `resume_analyses` table:**
   - Look for records with `resume_id` matching the resume `id`
   - Verify `analysis_type` is correct (`ats_score` or `optimization`)
   - Check that `user_id` matches your user

The linkage is working if you can find matching `resume_id` values between the two tables.

## 🔧 **Next Steps After Testing**

1. **If everything works:** Remove the console.log debugging statements
2. **If issues found:** Use the debugging info to identify the root cause
3. **If database issues:** Re-run the database setup SQL
4. **If storage issues:** Verify bucket and policies are set up correctly

This testing will definitively show whether the resume-analysis linkage is working correctly!