// Resume storage and management utilities

// Upload file to Supabase storage
export const uploadResumeFile = async (supabase, userId, file) => {
    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('resumes')
            .upload(fileName, file);

        if (error) throw error;
        return { success: true, fileName, filePath: data.path };
    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: error.message };
    }
};

export const saveResume = async (supabase, resumeData) => {
    try {
        const { data, error } = await supabase
            .from('resumes')
            .insert([resumeData])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error saving resume:', error);
        return { success: false, error: error.message };
    }
};

export const saveAnalysis = async (supabase, resumeId, userId, analysisData) => {
    try {
        const analysisRecord = {
            resume_id: resumeId,
            user_id: userId,
            ...analysisData
        };

        const { data, error } = await supabase
            .from('resume_analyses')
            .insert([analysisRecord])
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error saving analysis:', error);
        return { success: false, error: error.message };
    }
};

export const getUserResumes = async (supabase, userId) => {
    try {
        const { data, error } = await supabase
            .from('resumes')
            .select(`
        *,
        resume_analyses (
          id,
          analysis_type,
          ats_score,
          created_at
        )
      `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return { success: false, error: error.message };
    }
};

export const getResumeAnalyses = async (supabase, resumeId, userId) => {
    try {
        const { data, error } = await supabase
            .from('resume_analyses')
            .select('*')
            .eq('resume_id', resumeId)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching analyses:', error);
        return { success: false, error: error.message };
    }
};

export const deleteResume = async (supabase, resumeId, userId) => {
    try {
        const { error } = await supabase
            .from('resumes')
            .delete()
            .eq('id', resumeId)
            .eq('user_id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting resume:', error);
        return { success: false, error: error.message };
    }
};

export const updateResumeTitle = async (supabase, resumeId, userId, newTitle) => {
    try {
        const { data, error } = await supabase
            .from('resumes')
            .update({
                title: newTitle,
                updated_at: new Date().toISOString()
            })
            .eq('id', resumeId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating resume title:', error);
        return { success: false, error: error.message };
    }
};

// Helper function to extract text from file content
export const extractTextFromFile = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const content = e.target.result;

            if (file.type === 'text/plain') {
                resolve(content);
            } else if (file.type === 'application/pdf') {
                // For PDF files, you might want to use a PDF parser library
                // For now, we'll just return a placeholder
                resolve('PDF content extraction requires additional setup');
            } else {
                resolve(content);
            }
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};