# Progress Tracking Verification Guide

## Quick Test Steps

1. **Check Current Data (in Browser Console):**
   ```javascript
   // Open browser console and run this to check current assessment data
   const supabase = window.supabase || (await import('@supabase/supabase-js')).createClient(
     'YOUR_SUPABASE_URL', 'YOUR_SUPABASE_ANON_KEY'
   );
   
   const { data, error } = await supabase.from('assessment_history').select('*');
   console.log('Assessment History:', data);
   
   const { data: sessions, error: sessionsError } = await supabase.from('assessment_sessions').select('*');
   console.log('Assessment Sessions:', sessions);
   ```

2. **Take a Test Assessment:**
   - Navigate to http://localhost:3002/dashboard?tab=assessment
   - Click "Take Assessment" on any assessment type
   - Complete a short assessment (you can use dummy answers)
   - Watch the browser console for logs

3. **Check Progress Updates:**
   - After completing assessment, go to Progress tab
   - Check browser console for debug logs
   - Verify that charts show your new data

## What to Look For:

### ✅ Success Indicators:
- Console shows "Assessment completed and saved"
- New records appear in both `assessment_sessions` and `assessment_history` tables
- Progress tab shows real data in charts
- Real-time listener triggers on new assessments

### ❌ Troubleshooting:
- **No data showing:** Check browser console for errors
- **Assessment not saving:** Verify Supabase connection
- **Progress not updating:** Check if real-time subscriptions are working

## Debug Commands:

1. **Check Assessment Storage:**
   ```sql
   SELECT * FROM assessment_sessions ORDER BY completed_at DESC LIMIT 5;
   SELECT * FROM assessment_history ORDER BY completed_at DESC LIMIT 5;
   ```

2. **Verify Progress Calculation:**
   ```javascript
   // In browser console on Progress tab
   console.log('Assessment Results State:', assessmentResults);
   ```

## Manual Database Insert (for testing):
If you want to add test data manually:

```sql
INSERT INTO assessment_history (user_id, assessment_type, score, level, number_of_questions, completed_at)
VALUES (
  'your-user-id-here', 
  'aptitude', 
  8, 
  'Intermediate', 
  10, 
  NOW()
);
```

## Expected Behavior:
1. Complete assessment → Data saved to database
2. Navigate to Progress tab → Charts show real data
3. Complete another assessment → Progress tab updates automatically
4. Real-time updates work without page refresh

## Files to Monitor:
- Browser Network tab for Supabase requests
- Browser Console for debug logs
- Supabase Dashboard for database changes

The system should now work immediately after completing any assessment!