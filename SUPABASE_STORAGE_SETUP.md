# Supabase Storage Setup Guide for Resume History System

## Step-by-Step Instructions

### Step 1: Create the Storage Bucket

1. **Open your Supabase project dashboard**
   - Go to https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - In the left sidebar, click on "Storage"
   - You'll see the Storage overview page

3. **Create a new bucket**
   - Click the "New bucket" button
   - Fill in the details:
     - **Name**: `resumes`
     - **Public**: **UNCHECK** this box (keep it private for security)
     - **File size limit**: You can set a limit (e.g., 10MB) or leave default
     - **Allowed MIME types**: Leave empty or specify: `application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain`
   - Click "Create bucket"

### Step 2: Set Up Storage Policies

1. **Go to Storage Policies**
   - In the Storage section, click on "Policies" tab
   - You'll see a list of storage policies

2. **Create Upload Policy**
   - Click "New Policy" button
   - Select "For full customization" (not template)
   - Fill in the details:
     - **Policy name**: `Users can upload their own resume files`
     - **Allowed operation**: `INSERT`
     - **Target roles**: `authenticated`
     - **USING expression**: 
       ```sql
       bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
       ```
     - **WITH CHECK expression**: 
       ```sql
       bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
       ```
   - Click "Review" then "Save policy"

3. **Create View/Download Policy**
   - Click "New Policy" button again
   - Select "For full customization"
   - Fill in the details:
     - **Policy name**: `Users can view their own resume files`
     - **Allowed operation**: `SELECT`
     - **Target roles**: `authenticated`
     - **USING expression**: 
       ```sql
       bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
       ```
   - Click "Review" then "Save policy"

4. **Create Delete Policy**
   - Click "New Policy" button again
   - Select "For full customization"
   - Fill in the details:
     - **Policy name**: `Users can delete their own resume files`
     - **Allowed operation**: `DELETE`
     - **Target roles**: `authenticated`
     - **USING expression**: 
       ```sql
       bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]
       ```
   - Click "Review" then "Save policy"

### Step 3: Alternative - Using SQL Editor (Advanced)

If you prefer to create the bucket and policies using SQL, you can run these commands in the SQL Editor:

1. **Go to SQL Editor**
   - In the left sidebar, click on "SQL Editor"

2. **Create the bucket** (Run this first):
   ```sql
   INSERT INTO storage.buckets (id, name, public) 
   VALUES ('resumes', 'resumes', false);
   ```

3. **Create the policies** (Run these after the bucket is created):
   ```sql
   -- Upload policy
   CREATE POLICY "Users can upload their own resume files" ON storage.objects
     FOR INSERT WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- View policy  
   CREATE POLICY "Users can view their own resume files" ON storage.objects
     FOR SELECT USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);

   -- Delete policy
   CREATE POLICY "Users can delete their own resume files" ON storage.objects
     FOR DELETE USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Step 4: Verify the Setup

1. **Check the bucket exists**
   - Go back to Storage overview
   - You should see the "resumes" bucket listed
   - It should show as "Private"

2. **Check the policies**
   - Go to Storage > Policies
   - You should see 3 policies for the resumes bucket:
     - Upload policy (INSERT)
     - View policy (SELECT) 
     - Delete policy (DELETE)

3. **Test the setup**
   - Run your Next.js application
   - Try uploading a resume file
   - Check if the file appears in the Storage bucket under a user-specific folder

### Step 5: Troubleshooting

**If upload fails:**
- Check that the bucket name is exactly `resumes`
- Verify all policies are created and enabled
- Check browser console for specific error messages
- Ensure user is authenticated when uploading

**If files don't appear:**
- Check the file was actually uploaded to storage
- Verify the file path follows the pattern: `userId/filename`
- Check RLS policies are properly configured

**Common Policy Issues:**
- Make sure the `USING` and `WITH CHECK` expressions are identical for INSERT policies
- Verify the bucket_id matches exactly (`resumes`)
- Check that `auth.uid()` returns the correct user ID

### Security Notes

1. **File Organization**: Files are stored in user-specific folders (`userId/filename`)
2. **Privacy**: Users can only access their own files
3. **Authentication**: All operations require user authentication
4. **File Types**: Consider adding MIME type restrictions for security

### File Path Structure

When files are uploaded, they will be stored as:
```
resumes/
├── user-uuid-1/
│   ├── timestamp-filename.pdf
│   └── timestamp-filename.docx
├── user-uuid-2/
│   └── timestamp-filename.txt
```

This structure ensures user isolation and prevents unauthorized access to other users' files.

## Next Steps

After completing the storage setup:
1. Test the file upload functionality in your application
2. Verify files are stored correctly in user-specific folders
3. Test the file download/view functionality
4. Ensure file deletion works properly

The storage system is now ready to work with your resume history system!